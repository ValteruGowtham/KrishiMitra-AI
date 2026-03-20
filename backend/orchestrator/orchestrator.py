"""
KrishiMitra AI — LangGraph orchestrator with 6 nodes.

Graph flow:
    load_farmer → parse_intent → run_agents → synthesize → compliance_check → write_audit

Exposes:
    get_orchestrator()  → compiled StateGraph
    run_orchestrator()  → async convenience function
"""

from __future__ import annotations

import asyncio
import json
from typing import Any, Annotated, Dict, List, Optional, Sequence

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END

from backend.agents.agents import (
    AGENT_REGISTRY,
    KrishiVoiceAgent,
)
from backend.compliance.audit import write_audit_log
from backend.compliance.guardrails import check_compliance
from backend.db.models import FarmerProfileDB, SessionLocal, init_db
from backend.schemas import (
    AdvisoryResponse,
    AgentMessage,
    FarmerProfile,
    FarmerQuery,
    Intent,
    OrchestratorState,
    SoilProfile,
    SoilType,
)

import os
from dotenv import load_dotenv

load_dotenv()


# ---------------------------------------------------------------------------
# Demo farmer (used when no DB record exists)
# ---------------------------------------------------------------------------

_DEMO_FARMER = FarmerProfile(
    farmer_id="demo-001",
    name="Ram Singh",
    state="Rajasthan",
    district="Ajmer",
    language="hi",
    land_acres=3.5,
    current_crop="wheat",
    crop_history=["mustard", "bajra", "wheat"],
    soil_profile=SoilProfile(
        N=180, P=12, K=210, pH=7.8,
        organic_matter=1.2, soil_type=SoilType.ALLUVIAL,
    ),
    monthly_income_inr=10218,
    has_kisan_credit_card=True,
    enrolled_schemes=["PM-KISAN"],
)


# ---------------------------------------------------------------------------
# Intent → agent mapping
# ---------------------------------------------------------------------------

_INTENT_AGENT_MAP: Dict[str, List[str]] = {
    "soil_health":    ["soil_agent", "crop_agent", "weather_agent"],
    "crop_advisory":  ["crop_agent", "soil_agent", "weather_agent", "scheme_agent"],
    "pest_disease":   ["pest_disease_agent", "weather_agent", "finance_agent"],
    "weather":        ["weather_agent", "crop_agent"],
    "market_price":   ["mandi_agent", "finance_agent", "scheme_agent"],
    "scheme":         ["scheme_agent", "finance_agent"],
    "credit":         ["finance_agent", "scheme_agent", "mandi_agent"],
    "distress":       ["scheme_agent", "finance_agent", "mandi_agent"],
    "general":        ["crop_agent", "weather_agent", "scheme_agent"],
    "irrigation":     ["weather_agent", "crop_agent"],
}


# ---------------------------------------------------------------------------
# State type for LangGraph (dict-based to work with StateGraph)
# ---------------------------------------------------------------------------

def _state_to_dict(state: OrchestratorState) -> dict:
    return state.model_dump(mode="json")


def _dict_to_state(d: dict) -> OrchestratorState:
    return OrchestratorState.model_validate(d)


# ---------------------------------------------------------------------------
# Node 1: load_farmer
# ---------------------------------------------------------------------------

async def load_farmer(state: dict) -> dict:
    """Load FarmerProfile from SQLite; fall back to demo farmer."""
    s = _dict_to_state(state)
    farmer_id = s.query.farmer_id

    db = SessionLocal()
    try:
        row = db.query(FarmerProfileDB).filter(
            FarmerProfileDB.farmer_id == farmer_id
        ).first()

        if row:
            soil = None
            if row.soil_profile:
                try:
                    soil_data = json.loads(row.soil_profile)
                    soil = SoilProfile(**soil_data)
                except Exception:
                    soil = None

            farmer = FarmerProfile(
                farmer_id=row.farmer_id,
                name=row.name,
                state=row.state,
                district=row.district,
                language=row.language or "hi",
                land_acres=row.land_acres,
                current_crop=row.current_crop,
                crop_history=json.loads(row.crop_history) if row.crop_history else [],
                soil_profile=soil,
                monthly_income_inr=row.monthly_income_inr,
                has_kisan_credit_card=row.has_kisan_credit_card or False,
                enrolled_schemes=json.loads(row.enrolled_schemes) if row.enrolled_schemes else [],
            )
        else:
            farmer = _DEMO_FARMER
    finally:
        db.close()

    s.farmer = farmer
    s.audit_log.append({"node": "load_farmer", "farmer_id": farmer.farmer_id, "source": "db" if row else "demo"})
    return _state_to_dict(s)


# ---------------------------------------------------------------------------
# Node 2: parse_intent
# ---------------------------------------------------------------------------

async def parse_intent(state: dict) -> dict:
    """Run KrishiVoiceAgent to classify intent and select agents."""
    s = _dict_to_state(state)

    voice = KrishiVoiceAgent()
    voice_msg = await voice.run(s.query, s.farmer)

    primary = voice_msg.output_data.get("primary_intent", "general")
    intent = Intent(primary) if primary in Intent.__members__.values() or primary in [e.value for e in Intent] else Intent.GENERAL
    s.intent = intent
    s.query.intent = intent

    agents = list(_INTENT_AGENT_MAP.get(primary, _INTENT_AGENT_MAP["general"]))
    # Always include scheme_agent if not already present
    if "scheme_agent" not in agents:
        agents.append("scheme_agent")

    s.agents_to_invoke = agents
    s.agent_responses["voice_agent"] = voice_msg
    s.audit_log.append({"node": "parse_intent", "intent": primary, "agents": agents})
    return _state_to_dict(s)


# ---------------------------------------------------------------------------
# Node 3: run_agents (parallel with 5s timeout)
# ---------------------------------------------------------------------------

async def run_agents(state: dict) -> dict:
    """Run all selected agents in parallel with a 5-second timeout each."""
    s = _dict_to_state(state)

    # Build context from any already-completed agent responses
    context = {aid: msg.output_data for aid, msg in s.agent_responses.items()}

    async def _run_one(agent_id: str) -> tuple[str, AgentMessage]:
        agent_cls = AGENT_REGISTRY.get(agent_id)
        if not agent_cls:
            return agent_id, AgentMessage(
                agent_id=agent_id, query_id=s.query.query_id,
                error=f"Unknown agent: {agent_id}", fallback_triggered=True,
            )
        agent = agent_cls()
        try:
            result = await asyncio.wait_for(
                agent.run(s.query, s.farmer, context),
                timeout=5.0,
            )
            return agent_id, result
        except asyncio.TimeoutError:
            return agent_id, AgentMessage(
                agent_id=agent_id, query_id=s.query.query_id,
                output_data={"error": "Agent timed out after 5s"},
                fallback_triggered=True, error="timeout",
            )
        except Exception as exc:
            return agent_id, AgentMessage(
                agent_id=agent_id, query_id=s.query.query_id,
                output_data={"error": str(exc)},
                fallback_triggered=True, error=str(exc),
            )

    tasks = [_run_one(aid) for aid in s.agents_to_invoke if aid != "voice_agent"]
    results = await asyncio.gather(*tasks)

    for agent_id, msg in results:
        s.agent_responses[agent_id] = msg
        context[agent_id] = msg.output_data  # update context for dependent agents

    s.audit_log.append({
        "node": "run_agents",
        "agents_run": [aid for aid, _ in results],
        "timeouts": [aid for aid, m in results if m.fallback_triggered],
    })
    return _state_to_dict(s)


# ---------------------------------------------------------------------------
# Node 4: synthesize
# ---------------------------------------------------------------------------

async def synthesize(state: dict) -> dict:
    """Merge all agent outputs into one farmer-friendly advisory."""
    s = _dict_to_state(state)

    agent_summaries = {}
    for aid, msg in s.agent_responses.items():
        if aid == "voice_agent":
            continue
        agent_summaries[aid] = msg.output_data

    system_prompt = (
        "You are KrishiMitra, a trusted farming advisor for Indian farmers. "
        "Combine the following agent analyses into ONE clear, actionable advisory. "
        "Write for a farmer with 8th-grade education. Use simple language. "
        "Structure: 1) Key advice, 2) Actions to take this week, "
        "3) Government schemes to apply for, 4) Market advice. "
        "End with a Hindi section (सारांश हिंदी में)."
    )

    human_msg = (
        f"Farmer: {s.farmer.name}, {s.farmer.district}, {s.farmer.state}\n"
        f"Crop: {s.farmer.current_crop}, Land: {s.farmer.land_acres} acres\n"
        f"Original question: {s.query.raw_input}\n\n"
        f"Agent analyses:\n{json.dumps(agent_summaries, indent=2, default=str)}"
    )

    try:
        llm = ChatOpenAI(model="gpt-4o", temperature=0.2, api_key=os.getenv("OPENAI_API_KEY"))
        resp = await llm.ainvoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_msg),
        ])
        s.final_advisory = resp.content
    except Exception as exc:
        # Fallback: concatenate agent summaries
        parts = []
        for aid, data in agent_summaries.items():
            hindi = data.get("summary_hindi", "")
            if hindi:
                parts.append(f"[{aid}] {hindi}")
        s.final_advisory = "\n\n".join(parts) if parts else "Advisory generation failed. Please try again."

    s.audit_log.append({"node": "synthesize", "advisory_length": len(s.final_advisory or "")})
    return _state_to_dict(s)


# ---------------------------------------------------------------------------
# Node 5: compliance_check
# ---------------------------------------------------------------------------

async def compliance_check(state: dict) -> dict:
    """Run 5-layer compliance and prepend mandatory additions."""
    s = _dict_to_state(state)

    # Build agent_responses dict suitable for check_compliance
    resp_dict = {aid: msg.output_data for aid, msg in s.agent_responses.items()}

    result = check_compliance(
        advisory_text=s.final_advisory or "",
        agent_responses=resp_dict,
        raw_farmer_input=s.query.raw_input,
    )

    s.compliance_passed = result.passed
    s.distress_detected = result.distress_detected

    if result.distress_detected:
        # Replace entire advisory with helpline message
        s.final_advisory = "\n".join(result.mandatory_additions)
    elif result.mandatory_additions:
        # Prepend warnings
        additions = "\n".join(result.mandatory_additions)
        s.final_advisory = f"{additions}\n\n---\n\n{s.final_advisory}"

    s.audit_log.append({
        "node": "compliance_check",
        "passed": result.passed,
        "flags": result.flags,
        "distress": result.distress_detected,
    })
    return _state_to_dict(s)


# ---------------------------------------------------------------------------
# Node 6: write_audit
# ---------------------------------------------------------------------------

async def write_audit(state: dict) -> dict:
    """Persist audit log to database."""
    s = _dict_to_state(state)

    db = SessionLocal()
    try:
        audit_id = write_audit_log(s, db)
    except Exception as exc:
        audit_id = f"FAILED:{exc}"
    finally:
        db.close()

    s.audit_log.append({"node": "write_audit", "audit_id": audit_id})
    return _state_to_dict(s)


# ---------------------------------------------------------------------------
# Graph assembly
# ---------------------------------------------------------------------------

def get_orchestrator() -> StateGraph:
    """Build and compile the 6-node LangGraph orchestrator."""
    graph = StateGraph(dict)

    graph.add_node("load_farmer", load_farmer)
    graph.add_node("parse_intent", parse_intent)
    graph.add_node("run_agents", run_agents)
    graph.add_node("synthesize", synthesize)
    graph.add_node("compliance_check", compliance_check)
    graph.add_node("write_audit", write_audit)

    graph.set_entry_point("load_farmer")
    graph.add_edge("load_farmer", "parse_intent")
    graph.add_edge("parse_intent", "run_agents")
    graph.add_edge("run_agents", "synthesize")
    graph.add_edge("synthesize", "compliance_check")
    graph.add_edge("compliance_check", "write_audit")
    graph.add_edge("write_audit", END)

    return graph.compile()


# ---------------------------------------------------------------------------
# Convenience runner
# ---------------------------------------------------------------------------

async def run_orchestrator(
    query: FarmerQuery,
    farmer: FarmerProfile | None = None,
) -> AdvisoryResponse:
    """
    End-to-end: accept a FarmerQuery, run the full graph, return AdvisoryResponse.
    """
    # Ensure tables exist
    init_db()

    initial_state = OrchestratorState(
        query=query,
        farmer=farmer or _DEMO_FARMER,
    )

    app = get_orchestrator()
    final = await app.ainvoke(_state_to_dict(initial_state))
    s = _dict_to_state(final)

    audit_entries = [e for e in s.audit_log if e.get("node") == "write_audit"]
    audit_id = audit_entries[-1].get("audit_id") if audit_entries else None

    compliance_entries = [e for e in s.audit_log if e.get("node") == "compliance_check"]
    flags = compliance_entries[-1].get("flags", []) if compliance_entries else []

    return AdvisoryResponse(
        query_id=s.query.query_id,
        farmer_id=s.farmer.farmer_id,
        advisory_text=s.final_advisory or "",
        agents_invoked=list(s.agent_responses.keys()),
        compliance_flags=flags,
        distress_alert=s.distress_detected,
        helpline_number="1800-180-1551" if s.distress_detected else None,
        audit_id=audit_id,
    )

"""
KrishiMitra AI — Audit log writer.

Persists the full orchestrator state (agent reasoning chains, compliance flags,
data sources) into the AuditLogDB table for regulatory traceability.
"""

from __future__ import annotations

import json
import uuid
from datetime import datetime
from typing import Any, Dict

from sqlalchemy.orm import Session

from backend.db.models import AuditLogDB
from backend.schemas import OrchestratorState


def write_audit_log(state: OrchestratorState, db: Session) -> str:
    """
    Write a full audit record and return the generated audit_id.

    Args:
        state: The completed OrchestratorState after compliance.
        db:    An active SQLAlchemy session.

    Returns:
        The UUID string of the new audit row.
    """
    audit_id = str(uuid.uuid4())

    # Serialise agent responses — each value is an AgentMessage pydantic model
    serialised_responses: Dict[str, Any] = {}
    for agent_id, msg in state.agent_responses.items():
        serialised_responses[agent_id] = msg.model_dump(mode="json") if hasattr(msg, "model_dump") else str(msg)

    # Collect all compliance flags across agents
    all_flags = []
    for msg in state.agent_responses.values():
        if hasattr(msg, "compliance_flags"):
            all_flags.extend(msg.compliance_flags)

    # Collect agents invoked
    agents_invoked = list(state.agent_responses.keys())

    row = AuditLogDB(
        audit_id=audit_id,
        query_id=state.query.query_id,
        farmer_id=state.farmer.farmer_id,
        raw_input=state.query.raw_input,
        intent=state.intent.value if state.intent else None,
        agents_invoked=json.dumps(agents_invoked),
        agent_responses=json.dumps(serialised_responses, default=str),
        compliance_flags=json.dumps(all_flags),
        compliance_passed=state.compliance_passed,
        distress_detected=state.distress_detected,
        final_advisory=state.final_advisory,
        timestamp=datetime.utcnow(),
    )
    db.add(row)
    db.commit()
    return audit_id

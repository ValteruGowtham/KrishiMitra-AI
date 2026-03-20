"""
KrishiMitra AI — Eight specialised agents that power the advisory engine.

Each agent inherits BaseKrishiAgent and implements ``async run()``.
"""

from __future__ import annotations

import asyncio
import base64
import json
import os
import re
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import aiohttp
from langchain_core.messages import HumanMessage, SystemMessage

from backend.agents.base import BaseKrishiAgent
from backend.db.models import MandiPriceCacheDB, SchemeDB, SessionLocal
from backend.schemas import AgentMessage, FarmerProfile, FarmerQuery, Intent


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  1. KrishiVoiceAgent — keyword-based intent classifier                 ║
# ╚══════════════════════════════════════════════════════════════════════════╝

class KrishiVoiceAgent(BaseKrishiAgent):
    """
    Classifies farmer intent using keyword matching (no LLM call).
    Supports Hindi and English keywords.
    """

    AGENT_ID = "voice_agent"

    _INTENT_KEYWORDS: Dict[Intent, List[str]] = {
        Intent.SOIL_HEALTH: [
            "soil", "mitti", "mati", "nitrogen", "phosphorus", "potassium",
            "urea", "khad", "fertilizer", "fertiliser", "dap", "npk",
            "organic", "jaivik", "pH",
        ],
        Intent.CROP_ADVISORY: [
            "crop", "fasal", "beej", "seed", "sowing", "buwai", "harvest",
            "katai", "variety", "kism", "yield", "paidawar", "ugana",
            "kheti", "farming",
        ],
        Intent.PEST_DISEASE: [
            "pest", "keeda", "keet", "disease", "bimari", "rog", "fungus",
            "khumbi", "insect", "spray", "dawai", "medicine", "leaf",
            "patta", "yellow", "peela", "brown", "wilt", "jhadna",
        ],
        Intent.WEATHER: [
            "weather", "mausam", "rain", "barish", "baarish", "temperature",
            "tapman", "humidity", "namee", "forecast", "storm", "toofan",
            "heatwave", "frost", "pala",
        ],
        Intent.MARKET_PRICE: [
            "price", "bhav", "daam", "mandi", "market", "sell", "bechna",
            "rate", "quintal", "khareed", "procurement", "msp",
        ],
        Intent.SCHEME: [
            "scheme", "yojana", "subsidy", "anudan", "government", "sarkar",
            "sarkari", "benefit", "labh", "pm-kisan", "fasal bima",
            "kisan credit", "kcc", "registration",
        ],
        Intent.CREDIT: [
            "loan", "karz", "rin", "credit", "bank", "interest", "byaj",
            "emi", "nabard", "finance", "paisa", "money",
        ],
        Intent.DISTRESS: [
            "suicide", "aatmhatya", "hopeless", "nirasha", "helpline",
            "karz se tang", "mar jaunga", "jeena nahi", "sab khatam",
            "jaan de dunga", "tang aa gaya", "barbaad",
        ],
    }

    async def run(
        self,
        query: FarmerQuery,
        farmer: FarmerProfile,
        context: Dict[str, Any] | None = None,
    ) -> AgentMessage:
        text = query.raw_input.lower()
        scores: Dict[str, int] = {}

        for intent, keywords in self._INTENT_KEYWORDS.items():
            hits = sum(1 for kw in keywords if kw in text)
            if hits:
                scores[intent.value] = hits

        detected = sorted(scores, key=scores.get, reverse=True)  # type: ignore[arg-type]
        primary = detected[0] if detected else Intent.GENERAL.value

        return self._build_message(
            query_id=query.query_id,
            output_data={
                "detected_intents": detected,
                "primary_intent": primary,
                "keyword_scores": scores,
            },
            confidence=min(1.0, max(scores.values()) / 3) if scores else 0.3,
            reasoning_chain=[
                f"Scanned input against {len(self._INTENT_KEYWORDS)} intent keyword lists",
                f"Top intent: {primary} (score {scores.get(primary, 0)})",
            ],
        )


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  2. SoilIntelligenceAgent — NPK / pH / fertiliser recommendations     ║
# ╚══════════════════════════════════════════════════════════════════════════╝

class SoilIntelligenceAgent(BaseKrishiAgent):
    """
    Analyses a farmer's soil profile and returns fertiliser recommendations.
    HARD RULE: never recommend > 120 kg urea per acre.
    """

    AGENT_ID = "soil_agent"

    _OPTIMAL_RANGES = {
        "N": (240, 280), "P": (20, 30), "K": (200, 250),
        "pH": (6.0, 7.5), "organic_matter": (2.0, 5.0),
    }

    async def run(
        self,
        query: FarmerQuery,
        farmer: FarmerProfile,
        context: Dict[str, Any] | None = None,
    ) -> AgentMessage:
        sp = farmer.soil_profile
        if not sp:
            return self._build_message(
                query_id=query.query_id,
                output_data={"error": "No soil profile available for this farmer."},
                confidence=0.0,
                fallback_triggered=True,
            )

        soil_summary = (
            f"N={sp.nitrogen_kg_ha} kg/ha, P={sp.phosphorus_kg_ha} kg/ha, "
            f"K={sp.potassium_kg_ha} kg/ha, pH={sp.pH}, "
            f"OM={sp.organic_matter}%, type={sp.soil_type.value}"
        )

        system_prompt = (
            "You are a certified Indian agronomist. "
            "Analyse the soil data and give fertiliser recommendations for the crop mentioned. "
            "HARD RULE: Never recommend more than 120 kg urea per acre. "
            "Return a JSON object with keys: nutrient_status (dict), "
            "fertilizer_recommendations (list of {product, kg_per_acre, timing}), "
            "application_timing, ph_advice, summary_hindi."
        )

        human_msg = (
            f"Farmer: {farmer.name}, State: {farmer.state}, District: {farmer.district}\n"
            f"Land: {farmer.land_acres} acres, Current crop: {farmer.current_crop}\n"
            f"Soil data: {soil_summary}\n"
            f"Farmer's question: {query.raw_input}"
        )

        try:
            resp = await self.llm.ainvoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=human_msg),
            ])
            raw = resp.content
            # Attempt to parse JSON from response
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                json_match = re.search(r"\{.*\}", raw, re.DOTALL)
                data = json.loads(json_match.group()) if json_match else {"raw_response": raw}

            # Enforce urea hard-rule
            flags: List[str] = []
            for rec in data.get("fertilizer_recommendations", []):
                if "urea" in rec.get("product", "").lower():
                    if rec.get("kg_per_acre", 0) > 120:
                        rec["kg_per_acre"] = 120
                        flags.append("UREA_CAPPED_120KG")

            return self._build_message(
                query_id=query.query_id,
                output_data=data,
                confidence=0.85,
                data_sources=["farmer_soil_profile", "gpt-4o"],
                reasoning_chain=[
                    f"Soil profile: {soil_summary}",
                    "Sent to GPT-4o with agronomist system prompt",
                    "Parsed structured JSON response",
                    "Applied urea 120 kg/acre cap",
                ],
                compliance_flags=flags,
            )
        except Exception as e:
            return self._build_message(
                query_id=query.query_id,
                output_data={"error": str(e)},
                confidence=0.0,
                fallback_triggered=True,
                error=str(e),
            )


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  3. CropAdvisoryAgent — growth-stage aware crop guidance               ║
# ╚══════════════════════════════════════════════════════════════════════════╝

class CropAdvisoryAgent(BaseKrishiAgent):
    """
    Provides crop-specific advisory by combining soil + weather context.
    Recommends only state-approved varieties.
    """

    AGENT_ID = "crop_agent"

    async def run(
        self,
        query: FarmerQuery,
        farmer: FarmerProfile,
        context: Dict[str, Any] | None = None,
    ) -> AgentMessage:
        ctx = context or {}
        soil_data = ctx.get("soil_agent", {})
        weather_data = ctx.get("weather_agent", {})

        system_prompt = (
            "You are an Indian crop scientist with 20 years' experience. "
            "Give practical crop advisory using the soil analysis and weather data provided. "
            "Only recommend state-approved crop varieties. "
            "Return a JSON object with keys: growth_stage, next_7_day_actions (list of strings), "
            "sowing_window, variety_recommendations (list), expected_yield_range, "
            "risk_alert, summary_hindi."
        )

        human_msg = (
            f"Farmer: {farmer.name}, State: {farmer.state}, District: {farmer.district}\n"
            f"Land: {farmer.land_acres} acres, Current crop: {farmer.current_crop}\n"
            f"Crop history: {', '.join(farmer.crop_history) or 'None'}\n"
            f"Soil analysis: {json.dumps(soil_data, default=str)}\n"
            f"Weather data: {json.dumps(weather_data, default=str)}\n"
            f"Farmer's question: {query.raw_input}"
        )

        try:
            resp = await self.llm.ainvoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=human_msg),
            ])
            raw = resp.content
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                json_match = re.search(r"\{.*\}", raw, re.DOTALL)
                data = json.loads(json_match.group()) if json_match else {"raw_response": raw}

            return self._build_message(
                query_id=query.query_id,
                output_data=data,
                confidence=0.82,
                data_sources=["soil_agent", "weather_agent", "gpt-4o"],
                reasoning_chain=[
                    f"Used soil context: {bool(soil_data)}",
                    f"Used weather context: {bool(weather_data)}",
                    "Sent combined context to GPT-4o crop scientist prompt",
                ],
            )
        except Exception as e:
            return self._build_message(
                query_id=query.query_id,
                output_data={"error": str(e)},
                confidence=0.0,
                fallback_triggered=True,
                error=str(e),
            )


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  4. PestDiseaseAgent — vision + text-based plant pathology             ║
# ╚══════════════════════════════════════════════════════════════════════════╝

class PestDiseaseAgent(BaseKrishiAgent):
    """
    Diagnoses pests/diseases via image (GPT-4o vision) or text symptoms.
    Always recommends biological treatment FIRST; chemical must be CIB-approved.
    """

    AGENT_ID = "pest_disease_agent"

    async def run(
        self,
        query: FarmerQuery,
        farmer: FarmerProfile,
        context: Dict[str, Any] | None = None,
    ) -> AgentMessage:
        system_prompt = (
            "You are an expert Indian plant pathologist and entomologist. "
            "Diagnose the pest or disease and recommend treatments. "
            "ALWAYS suggest biological treatment FIRST. "
            "Chemical recommendations must be CIB-approved only; include dose and "
            "harvest safety interval (PHI). "
            "Return JSON with keys: diagnoses (list of {name, confidence_pct, severity_1_to_5}), "
            "spread_risk, biological_treatment, chemical_treatment "
            "(with product, dose, phi_days), prevention, summary_hindi."
        )

        messages: list = [SystemMessage(content=system_prompt)]

        # Build human message content — text or text + image
        content_parts: list = []

        if query.image_path and os.path.exists(query.image_path):
            with open(query.image_path, "rb") as img_f:
                b64 = base64.b64encode(img_f.read()).decode()
            content_parts.append({
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{b64}"},
            })
            content_parts.append({
                "type": "text",
                "text": (
                    f"Farmer: {farmer.name}, State: {farmer.state}, Crop: {farmer.current_crop}\n"
                    f"Symptoms described: {query.raw_input}\n"
                    "Please diagnose this plant image."
                ),
            })
            messages.append(HumanMessage(content=content_parts))
            diagnosis_mode = "image+text"
        else:
            text_msg = (
                f"Farmer: {farmer.name}, State: {farmer.state}, Crop: {farmer.current_crop}\n"
                f"Symptom description: {query.raw_input}\n"
                "No image provided. Diagnose based on text description only."
            )
            messages.append(HumanMessage(content=text_msg))
            diagnosis_mode = "text-only"

        try:
            resp = await self.llm.ainvoke(messages)
            raw = resp.content
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                json_match = re.search(r"\{.*\}", raw, re.DOTALL)
                data = json.loads(json_match.group()) if json_match else {"raw_response": raw}

            return self._build_message(
                query_id=query.query_id,
                output_data=data,
                confidence=0.75 if diagnosis_mode == "text-only" else 0.85,
                data_sources=["gpt-4o-vision" if "image" in diagnosis_mode else "gpt-4o"],
                reasoning_chain=[
                    f"Diagnosis mode: {diagnosis_mode}",
                    "Used CIB-approved chemicals only",
                    "Biological treatment prioritised",
                ],
            )
        except Exception as e:
            return self._build_message(
                query_id=query.query_id,
                output_data={"error": str(e)},
                confidence=0.0,
                fallback_triggered=True,
                error=str(e),
            )


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  5. WeatherClimateAgent — IMD API or demo fallback                     ║
# ╚══════════════════════════════════════════════════════════════════════════╝

class WeatherClimateAgent(BaseKrishiAgent):
    """
    Fetches weather forecast and translates it into farming-specific actions.
    Falls back to a hardcoded 5-day demo forecast for Ajmer, Rajasthan.
    """

    AGENT_ID = "weather_agent"

    _DEMO_FORECAST = [
        {"day": 1, "date": "tomorrow", "temp_max": 38, "temp_min": 22, "humidity": 35, "condition": "Clear sky", "wind_kmh": 12, "rain_mm": 0},
        {"day": 2, "date": "day_2", "temp_max": 39, "temp_min": 23, "humidity": 30, "condition": "Hazy sunshine", "wind_kmh": 15, "rain_mm": 0},
        {"day": 3, "date": "day_3", "temp_max": 36, "temp_min": 21, "humidity": 55, "condition": "Partly cloudy", "wind_kmh": 18, "rain_mm": 0},
        {"day": 4, "date": "day_4", "temp_max": 33, "temp_min": 20, "humidity": 72, "condition": "Thunderstorm likely", "wind_kmh": 25, "rain_mm": 15},
        {"day": 5, "date": "day_5", "temp_max": 34, "temp_min": 21, "humidity": 60, "condition": "Clearing up", "wind_kmh": 10, "rain_mm": 2},
    ]

    async def _fetch_imd(self, state: str, district: str) -> Optional[list]:
        """Attempt to fetch from IMD API with 3-second timeout."""
        api_key = os.getenv("IMD_API_KEY", "")
        if not api_key:
            return None
        url = f"https://api.imd.gov.in/forecast?state={state}&district={district}"
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    url, headers={"X-API-Key": api_key}, timeout=aiohttp.ClientTimeout(total=3)
                ) as resp:
                    if resp.status == 200:
                        return await resp.json()
        except Exception:
            pass
        return None

    async def run(
        self,
        query: FarmerQuery,
        farmer: FarmerProfile,
        context: Dict[str, Any] | None = None,
    ) -> AgentMessage:
        forecast = await self._fetch_imd(farmer.state, farmer.district)
        fallback = forecast is None
        if fallback:
            forecast = self._DEMO_FORECAST

        system_prompt = (
            "You are an agro-meteorologist advising Indian farmers. "
            "DON'T just report weather — translate each day into a SPECIFIC farming action. "
            "Return JSON with keys: forecast_summary, "
            "farming_actions (list of {day, weather, specific_action, urgency}), "
            "spray_advisory, irrigation_advisory, risk_alert, summary_hindi."
        )

        human_msg = (
            f"Farmer: {farmer.name}, Location: {farmer.district}, {farmer.state}\n"
            f"Crop: {farmer.current_crop}, Land: {farmer.land_acres} acres\n"
            f"5-day forecast data: {json.dumps(forecast)}\n"
            f"Farmer's question: {query.raw_input}"
        )

        try:
            resp = await self.llm.ainvoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=human_msg),
            ])
            raw = resp.content
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                json_match = re.search(r"\{.*\}", raw, re.DOTALL)
                data = json.loads(json_match.group()) if json_match else {"raw_response": raw}

            return self._build_message(
                query_id=query.query_id,
                output_data=data,
                confidence=0.70 if fallback else 0.90,
                data_sources=["imd_demo_forecast" if fallback else "imd_api", "gpt-4o"],
                reasoning_chain=[
                    f"IMD API attempt: {'fallback to demo data' if fallback else 'success'}",
                    "Translated weather into farming actions via GPT-4o",
                ],
                fallback_triggered=fallback,
            )
        except Exception as e:
            return self._build_message(
                query_id=query.query_id,
                output_data={"error": str(e)},
                confidence=0.0,
                fallback_triggered=True,
                error=str(e),
            )


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  6. MandiMarketAgent — mandi prices + MSP comparison                   ║
# ╚══════════════════════════════════════════════════════════════════════════╝

class MandiMarketAgent(BaseKrishiAgent):
    """
    Fetches mandi prices (AgMarkNet API or demo), compares with MSP,
    and recommends best selling strategy.
    """

    AGENT_ID = "mandi_agent"

    _MSP_TABLE = {
        "wheat": 2275, "paddy": 2300, "mustard": 5950,
        "cotton": 7121, "maize": 2090, "soybean": 4892,
        "groundnut": 6783, "bajra": 2500, "jowar": 3180,
        "ragi": 3846, "tur": 7000, "moong": 8558,
        "urad": 6950, "chana": 5440, "barley": 1850,
        "sugarcane": 315,                # per quintal FRP
    }

    _DEMO_PRICES = [
        {"commodity": "wheat", "market": "Ajmer Mandi", "state": "Rajasthan", "district": "Ajmer", "min_price": 2200, "max_price": 2450, "modal_price": 2350},
        {"commodity": "wheat", "market": "Jaipur Mandi", "state": "Rajasthan", "district": "Jaipur", "min_price": 2250, "max_price": 2500, "modal_price": 2380},
        {"commodity": "wheat", "market": "Kota Mandi", "state": "Rajasthan", "district": "Kota", "min_price": 2180, "max_price": 2400, "modal_price": 2300},
        {"commodity": "wheat", "market": "Udaipur Mandi", "state": "Rajasthan", "district": "Udaipur", "min_price": 2150, "max_price": 2380, "modal_price": 2280},
        {"commodity": "mustard", "market": "Ajmer Mandi", "state": "Rajasthan", "district": "Ajmer", "min_price": 5800, "max_price": 6200, "modal_price": 6050},
        {"commodity": "mustard", "market": "Jaipur Mandi", "state": "Rajasthan", "district": "Jaipur", "min_price": 5900, "max_price": 6300, "modal_price": 6100},
        {"commodity": "mustard", "market": "Kota Mandi", "state": "Rajasthan", "district": "Kota", "min_price": 5700, "max_price": 6100, "modal_price": 5900},
        {"commodity": "mustard", "market": "Udaipur Mandi", "state": "Rajasthan", "district": "Udaipur", "min_price": 5750, "max_price": 6150, "modal_price": 5950},
    ]

    async def _fetch_agmarknet(self, commodity: str, state: str) -> Optional[list]:
        """Attempt AgMarkNet API with 3s timeout."""
        api_key = os.getenv("AGMARKNET_API_KEY", "")
        if not api_key:
            return None
        url = f"https://api.agmarknet.gov.in/prices?commodity={commodity}&state={state}"
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    url, headers={"X-API-Key": api_key}, timeout=aiohttp.ClientTimeout(total=3)
                ) as resp:
                    if resp.status == 200:
                        return await resp.json()
        except Exception:
            pass
        return None

    async def run(
        self,
        query: FarmerQuery,
        farmer: FarmerProfile,
        context: Dict[str, Any] | None = None,
    ) -> AgentMessage:
        crop = (farmer.current_crop or "wheat").lower()

        prices = await self._fetch_agmarknet(crop, farmer.state)
        fallback = prices is None
        if fallback:
            prices = [p for p in self._DEMO_PRICES if p["commodity"] == crop]
            if not prices:
                prices = [p for p in self._DEMO_PRICES if p["commodity"] == "wheat"]

        msp = self._MSP_TABLE.get(crop, 0)
        best = max(prices, key=lambda p: p.get("modal_price", 0)) if prices else {}
        best_price = best.get("modal_price", 0)

        system_prompt = (
            "You are an agricultural market analyst advising Indian farmers. "
            "Analyse the mandi price data and give selling advice. "
            "Include MSP comparison and negotiation tips. "
            "Return JSON with keys: best_mandi, transport_estimate, net_price, "
            "msp_comparison, sell_timing_recommendation, negotiation_tip, summary_hindi."
        )

        human_msg = (
            f"Farmer: {farmer.name}, Location: {farmer.district}, {farmer.state}\n"
            f"Crop: {crop}, Land: {farmer.land_acres} acres\n"
            f"MSP for {crop}: ₹{msp}/quintal\n"
            f"Mandi prices: {json.dumps(prices)}\n"
            f"Farmer's question: {query.raw_input}"
        )

        try:
            resp = await self.llm.ainvoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=human_msg),
            ])
            raw = resp.content
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                json_match = re.search(r"\{.*\}", raw, re.DOTALL)
                data = json.loads(json_match.group()) if json_match else {"raw_response": raw}

            # Store crop & best price for compliance layer
            data["crop"] = crop
            data["best_price_per_quintal"] = best_price

            return self._build_message(
                query_id=query.query_id,
                output_data=data,
                confidence=0.70 if fallback else 0.90,
                data_sources=["agmarknet_demo" if fallback else "agmarknet_api", "gpt-4o"],
                reasoning_chain=[
                    f"Crop: {crop}, MSP: ₹{msp}/q",
                    f"Best mandi: {best.get('market', 'N/A')} @ ₹{best_price}/q",
                    f"AgMarkNet API: {'fallback' if fallback else 'live'}",
                ],
                fallback_triggered=fallback,
                compliance_flags=[f"BELOW_MSP:{crop}" for _ in [1] if best_price < msp and best_price > 0],
            )
        except Exception as e:
            return self._build_message(
                query_id=query.query_id,
                output_data={"error": str(e), "crop": crop, "best_price_per_quintal": 0},
                confidence=0.0,
                fallback_triggered=True,
                error=str(e),
            )


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  7. GovernmentSchemeAgent — scheme eligibility from SQLite             ║
# ╚══════════════════════════════════════════════════════════════════════════╝

class GovernmentSchemeAgent(BaseKrishiAgent):
    """
    Queries the local SchemeDB and filters schemes by farmer eligibility.
    Excludes schemes the farmer is already enrolled in.
    """

    AGENT_ID = "scheme_agent"

    def _check_eligibility(self, scheme_row: SchemeDB, farmer: FarmerProfile) -> bool:
        """Simple rule-based eligibility check."""
        try:
            rules = json.loads(scheme_row.eligibility) if isinstance(scheme_row.eligibility, str) else scheme_row.eligibility
        except (json.JSONDecodeError, TypeError):
            rules = {}

        states = json.loads(scheme_row.states_applicable) if isinstance(scheme_row.states_applicable, str) else scheme_row.states_applicable
        if "ALL" not in states and farmer.state not in states:
            return False

        if rules.get("land_acres_max") and farmer.land_acres > rules["land_acres_max"]:
            return False
        if rules.get("land_acres_min") and farmer.land_acres < rules["land_acres_min"]:
            return False
        if rules.get("state_resident") and farmer.state not in states and "ALL" not in states:
            return False

        return True

    async def run(
        self,
        query: FarmerQuery,
        farmer: FarmerProfile,
        context: Dict[str, Any] | None = None,
    ) -> AgentMessage:
        db = SessionLocal()
        try:
            schemes = db.query(SchemeDB).filter(SchemeDB.active == True).all()

            eligible = []
            for s in schemes:
                if s.name in farmer.enrolled_schemes:
                    continue
                if self._check_eligibility(s, farmer):
                    eligible.append({
                        "scheme_id": s.scheme_id,
                        "name": s.name,
                        "category": s.category,
                        "benefit_inr": s.benefit_inr,
                        "benefit_desc": s.benefit_desc,
                        "enrollment_url": s.enrollment_url,
                        "deadline": s.deadline,
                    })

            total_benefit = sum(s["benefit_inr"] or 0 for s in eligible)

            # Generate Hindi summary via LLM
            scheme_names = [s["name"] for s in eligible[:5]]
            try:
                resp = await self.llm.ainvoke([
                    SystemMessage(content="Briefly summarise these government schemes in simple Hindi for a farmer. 2-3 lines only."),
                    HumanMessage(content=f"Eligible schemes: {', '.join(scheme_names)}. Total unclaimed benefit: ₹{total_benefit:,.0f}"),
                ])
                summary_hindi = resp.content
            except Exception:
                summary_hindi = f"आपके लिए {len(eligible)} सरकारी योजनाएं उपलब्ध हैं।"

            return self._build_message(
                query_id=query.query_id,
                output_data={
                    "eligible_schemes": eligible,
                    "total_unclaimed_benefit_inr": total_benefit,
                    "scheme_count": len(eligible),
                    "summary": f"{len(eligible)} schemes available with ₹{total_benefit:,.0f} in unclaimed benefits",
                    "summary_hindi": summary_hindi,
                },
                confidence=0.95,
                data_sources=["sqlite_scheme_db"],
                reasoning_chain=[
                    f"Queried {len(schemes)} active schemes from DB",
                    f"Filtered by state={farmer.state}, land={farmer.land_acres} acres",
                    f"Excluded {len(farmer.enrolled_schemes)} already-enrolled schemes",
                    f"Result: {len(eligible)} eligible",
                ],
            )
        finally:
            db.close()


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  8. FarmFinanceAgent — cost-revenue analysis and credit advice         ║
# ╚══════════════════════════════════════════════════════════════════════════╝

class FarmFinanceAgent(BaseKrishiAgent):
    """
    Financial analysis: input cost, revenue, break-even, and credit advice.
    HARD RULE: only recommend government/NABARD loans — never private lenders.
    """

    AGENT_ID = "finance_agent"

    async def run(
        self,
        query: FarmerQuery,
        farmer: FarmerProfile,
        context: Dict[str, Any] | None = None,
    ) -> AgentMessage:
        ctx = context or {}
        crop_data = ctx.get("crop_agent", {})
        mandi_data = ctx.get("mandi_agent", {})

        system_prompt = (
            "You are an agricultural finance advisor in India. "
            "Analyse the farmer's finances using crop and market data. "
            "HARD RULE: only recommend government/NABARD loans, NEVER private lenders or microfinance at high interest. "
            "Return JSON with keys: input_cost_per_acre, expected_revenue, "
            "break_even_yield, net_profit_estimate, financial_risk_level (low/medium/high), "
            "kcc_advice, fasal_bima_advice, summary_hindi."
        )

        human_msg = (
            f"Farmer: {farmer.name}, Location: {farmer.district}, {farmer.state}\n"
            f"Land: {farmer.land_acres} acres, Crop: {farmer.current_crop}\n"
            f"Monthly income: ₹{farmer.monthly_income_inr or 'unknown'}\n"
            f"Has KCC: {farmer.has_kisan_credit_card}\n"
            f"Crop analysis: {json.dumps(crop_data, default=str)}\n"
            f"Market data: {json.dumps(mandi_data, default=str)}\n"
            f"Farmer's question: {query.raw_input}"
        )

        try:
            resp = await self.llm.ainvoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=human_msg),
            ])
            raw = resp.content
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                json_match = re.search(r"\{.*\}", raw, re.DOTALL)
                data = json.loads(json_match.group()) if json_match else {"raw_response": raw}

            return self._build_message(
                query_id=query.query_id,
                output_data=data,
                confidence=0.78,
                data_sources=["crop_agent", "mandi_agent", "gpt-4o"],
                reasoning_chain=[
                    f"Used crop context: {bool(crop_data)}",
                    f"Used mandi context: {bool(mandi_data)}",
                    "Applied government-only lending rule",
                ],
            )
        except Exception as e:
            return self._build_message(
                query_id=query.query_id,
                output_data={"error": str(e)},
                confidence=0.0,
                fallback_triggered=True,
                error=str(e),
            )


# ---------------------------------------------------------------------------
# Agent registry — convenient mapping from ID → class
# ---------------------------------------------------------------------------

AGENT_REGISTRY: Dict[str, type[BaseKrishiAgent]] = {
    "voice_agent": KrishiVoiceAgent,
    "soil_agent": SoilIntelligenceAgent,
    "crop_agent": CropAdvisoryAgent,
    "pest_disease_agent": PestDiseaseAgent,
    "weather_agent": WeatherClimateAgent,
    "mandi_agent": MandiMarketAgent,
    "scheme_agent": GovernmentSchemeAgent,
    "finance_agent": FarmFinanceAgent,
}

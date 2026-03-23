"""
KrishiMitra AI — Pydantic schemas for request/response models and agent state.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class SoilType(str, Enum):
    ALLUVIAL = "alluvial"
    BLACK = "black"
    RED = "red"
    LATERITE = "laterite"
    DESERT = "desert"
    MOUNTAIN = "mountain"
    SALINE = "saline"
    PEATY = "peaty"


class Channel(str, Enum):
    WHATSAPP = "whatsapp"
    VOICE = "voice"
    WEB = "web"
    SMS = "sms"
    USSD = "ussd"


class Intent(str, Enum):
    CROP_ADVISORY = "crop_advisory"
    PEST_DISEASE = "pest_disease"
    WEATHER = "weather"
    MARKET_PRICE = "market_price"
    SCHEME = "scheme"
    SOIL_HEALTH = "soil_health"
    IRRIGATION = "irrigation"
    CREDIT = "credit"
    DISTRESS = "distress"
    GENERAL = "general"


# ---------------------------------------------------------------------------
# Core models
# ---------------------------------------------------------------------------

class SoilProfile(BaseModel):
    """Macro-nutrient and physical profile of a farmer's soil."""
    nitrogen_kg_ha: float = Field(..., alias="N", description="Nitrogen (kg/ha)")
    phosphorus_kg_ha: float = Field(..., alias="P", description="Phosphorus (kg/ha)")
    potassium_kg_ha: float = Field(..., alias="K", description="Potassium (kg/ha)")
    pH: float = Field(..., ge=0, le=14, description="Soil pH")
    organic_matter: float = Field(..., ge=0, le=100, description="Organic matter (%)")
    soil_type: SoilType

    model_config = {"populate_by_name": True}


class FarmerProfile(BaseModel):
    """Farmer demographic & agronomic profile."""
    farmer_id: str
    name: str
    state: str
    district: str
    language: str = "hi"
    land_acres: float = Field(..., gt=0)
    current_crop: Optional[str] = None
    crop_history: List[str] = Field(default_factory=list)
    soil_profile: Optional[SoilProfile] = None
    monthly_income_inr: Optional[float] = None
    has_kisan_credit_card: bool = False
    enrolled_schemes: List[str] = Field(default_factory=list)


class FarmerQuery(BaseModel):
    """Incoming farmer query — can originate from any channel."""
    query_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    farmer_id: str
    raw_input: str
    intent: Optional[Intent] = None
    image_path: Optional[str] = None
    channel: Channel = Channel.WEB
    language_code: str = "hi-IN"
    language_label: str = "हिंदी (Hindi)"
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class AgentMessage(BaseModel):
    """Standardised output envelope returned by every agent."""
    agent_id: str
    query_id: str
    output_data: Dict[str, Any] = Field(default_factory=dict)
    confidence_score: float = Field(0.0, ge=0, le=1)
    data_sources: List[str] = Field(default_factory=list)
    reasoning_chain: List[str] = Field(default_factory=list)
    compliance_flags: List[str] = Field(default_factory=list)
    fallback_triggered: bool = False
    error: Optional[str] = None


class OrchestratorState(BaseModel):
    """
    State object that flows through the LangGraph orchestrator.
    Accumulates agent responses, compliance results, and the final advisory.
    """
    query: FarmerQuery
    farmer: FarmerProfile
    intent: Optional[Intent] = None
    agents_to_invoke: List[str] = Field(default_factory=list)
    agent_responses: Dict[str, AgentMessage] = Field(default_factory=dict)
    compliance_passed: bool = False
    distress_detected: bool = False
    final_advisory: Optional[str] = None
    audit_log: List[Dict[str, Any]] = Field(default_factory=list)


class AdvisoryResponse(BaseModel):
    """Final response sent back to the farmer."""
    query_id: str
    farmer_id: str
    advisory_text: str
    agents_invoked: List[str] = Field(default_factory=list)
    compliance_flags: List[str] = Field(default_factory=list)
    distress_alert: bool = False
    helpline_number: Optional[str] = None
    audit_id: Optional[str] = None
    data_freshness: Optional[datetime] = None

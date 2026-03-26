"""
KrishiMitra AI — Advisory and management API routes.
"""

from __future__ import annotations

import json
import os
import uuid
from datetime import datetime
from typing import List, Optional

import aiofiles
from fastapi import APIRouter, Body, Depends, File, Form, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

from backend.db.models import (
    AuditLogDB,
    FarmerProfileDB,
    MandiPriceCacheDB,
    SchemeDB,
    SessionLocal,
    get_db,
)
from backend.orchestrator.orchestrator import run_orchestrator
from backend.services.sarvam import SUPPORTED_LANGUAGES, synthesise_speech, transcribe_audio
from backend.schemas import (
    AdvisoryResponse,
    Channel,
    FarmerProfile,
    FarmerQuery,
    SoilProfile,
    SoilType,
)

router = APIRouter()

UPLOAD_DIR = "/tmp/krishimitra_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  POST /advisory — text-only advisory                                   ║
# ╚══════════════════════════════════════════════════════════════════════════╝

from pydantic import BaseModel


class AdvisoryRequest(BaseModel):
    farmer_id: str
    text_input: str
    language: str = "hi"
    language_code: str = "hi-IN"
    channel: str = "app"


@router.post("/advisory", response_model=AdvisoryResponse)
async def create_advisory(req: AdvisoryRequest):
    """Run the full orchestrator pipeline on a text query."""
    try:
        channel = Channel(req.channel)
    except ValueError:
        channel = Channel.WEB

    # Map language code to language label
    from backend.services.sarvam import SUPPORTED_LANGUAGES
    language_label = SUPPORTED_LANGUAGES.get(req.language_code, "हिंदी (Hindi)")

    query = FarmerQuery(
        farmer_id=req.farmer_id,
        raw_input=req.text_input,
        channel=channel,
        language_code=req.language_code,
        language_label=language_label,
    )
    result = await run_orchestrator(query)
    return result


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  POST /advisory/with-photo — multipart advisory with image             ║
# ╚══════════════════════════════════════════════════════════════════════════╝

@router.post("/advisory/with-photo", response_model=AdvisoryResponse)
async def create_advisory_with_photo(
    farmer_id: str = Form(...),
    text_input: str = Form(...),
    language: str = Form("hi"),
    language_code: str = Form("hi-IN"),
    photo: UploadFile = File(...),
):
    """Run orchestrator with an uploaded photo (pest/disease diagnosis)."""
    # Save uploaded photo
    ext = os.path.splitext(photo.filename or "img.jpg")[1] or ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    async with aiofiles.open(filepath, "wb") as f:
        content = await photo.read()
        await f.write(content)

    # Map language code to language label
    from backend.services.sarvam import SUPPORTED_LANGUAGES
    language_label = SUPPORTED_LANGUAGES.get(language_code, "हिंदी (Hindi)")

    query = FarmerQuery(
        farmer_id=farmer_id,
        raw_input=text_input,
        image_path=filepath,
        channel=Channel.WEB,
        language_code=language_code,
        language_label=language_label,
    )
    result = await run_orchestrator(query)
    return result


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  POST /farmer/register — register a new farmer                        ║
# ╚══════════════════════════════════════════════════════════════════════════╝

class FarmerRegistration(BaseModel):
    name: str
    state: str
    district: str
    village: str = ""
    language: str = "hi"
    phone: str = ""
    land_acres: float
    current_crop: Optional[str] = None
    crop_history: List[str] = []
    N: Optional[float] = None
    P: Optional[float] = None
    K: Optional[float] = None
    pH: Optional[float] = None
    organic_matter: Optional[float] = None
    soil_type: Optional[str] = None
    monthly_income_inr: Optional[float] = None
    sowing_date: Optional[str] = None


@router.post("/farmer/register")
async def register_farmer(reg: FarmerRegistration, db: Session = Depends(get_db)):
    """Register a new farmer profile."""
    farmer_id = f"KM-{uuid.uuid4().hex[:8].upper()}"

    # Build soil profile JSON if values provided
    soil_json = None
    if reg.N is not None and reg.P is not None and reg.K is not None:
        soil_json = json.dumps({
            "N": reg.N,
            "P": reg.P,
            "K": reg.K,
            "pH": reg.pH or 7.0,
            "organic_matter": reg.organic_matter or 0.0,
            "soil_type": reg.soil_type or "alluvial",
        })

    farmer = FarmerProfileDB(
        farmer_id=farmer_id,
        name=reg.name,
        state=reg.state,
        district=reg.district,
        language=reg.language,
        land_acres=reg.land_acres,
        current_crop=reg.current_crop,
        crop_history=json.dumps(reg.crop_history),
        soil_profile=soil_json,
        monthly_income_inr=reg.monthly_income_inr,
        has_kisan_credit_card=False,
        enrolled_schemes=json.dumps([]),
    )
    db.add(farmer)
    db.commit()

    return {
        "farmer_id": farmer_id,
        "status": "registered",
        "message": f"Farmer '{reg.name}' registered successfully.",
    }


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  GET /farmer/{farmer_id} — fetch farmer profile                       ║
# ╚══════════════════════════════════════════════════════════════════════════╝

@router.get("/farmer/{farmer_id}")
async def get_farmer(farmer_id: str, db: Session = Depends(get_db)):
    """Return a farmer's profile."""
    row = db.query(FarmerProfileDB).filter(
        FarmerProfileDB.farmer_id == farmer_id
    ).first()
    if not row:
        raise HTTPException(status_code=404, detail=f"Farmer '{farmer_id}' not found")

    return {
        "farmer_id": row.farmer_id,
        "name": row.name,
        "state": row.state,
        "district": row.district,
        "language": row.language,
        "land_acres": row.land_acres,
        "current_crop": row.current_crop,
        "crop_history": json.loads(row.crop_history) if row.crop_history else [],
        "soil_profile": json.loads(row.soil_profile) if row.soil_profile else None,
        "monthly_income_inr": row.monthly_income_inr,
        "has_kisan_credit_card": row.has_kisan_credit_card,
        "enrolled_schemes": json.loads(row.enrolled_schemes) if row.enrolled_schemes else [],
        "created_at": str(row.created_at) if row.created_at else None,
    }


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  GET /audit/{audit_id} — full audit record                            ║
# ╚══════════════════════════════════════════════════════════════════════════╝

@router.get("/audit/{audit_id}")
async def get_audit(audit_id: str, db: Session = Depends(get_db)):
    """Return full audit record including agent reasoning chains."""
    row = db.query(AuditLogDB).filter(AuditLogDB.audit_id == audit_id).first()
    if not row:
        raise HTTPException(status_code=404, detail=f"Audit '{audit_id}' not found")

    return {
        "audit_id": row.audit_id,
        "query_id": row.query_id,
        "farmer_id": row.farmer_id,
        "raw_input": row.raw_input,
        "intent": row.intent,
        "agents_invoked": json.loads(row.agents_invoked) if row.agents_invoked else [],
        "agent_responses": json.loads(row.agent_responses) if row.agent_responses else {},
        "compliance_flags": json.loads(row.compliance_flags) if row.compliance_flags else [],
        "compliance_passed": row.compliance_passed,
        "distress_detected": row.distress_detected,
        "final_advisory": row.final_advisory,
        "timestamp": str(row.timestamp) if row.timestamp else None,
    }


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  GET /audit/farmer/{farmer_id} — last 10 advisories for a farmer      ║
# ╚══════════════════════════════════════════════════════════════════════════╝

@router.get("/audit/farmer/{farmer_id}")
async def get_farmer_audits(farmer_id: str, db: Session = Depends(get_db)):
    """Return last 10 advisory audit summaries for a farmer."""
    rows = (
        db.query(AuditLogDB)
        .filter(AuditLogDB.farmer_id == farmer_id)
        .order_by(AuditLogDB.timestamp.desc())
        .limit(10)
        .all()
    )

    return [
        {
            "audit_id": r.audit_id,
            "query_id": r.query_id,
            "intent": r.intent,
            "compliance_passed": r.compliance_passed,
            "distress_detected": r.distress_detected,
            "timestamp": str(r.timestamp) if r.timestamp else None,
            "preview": (r.final_advisory or "")[:200],
        }
        for r in rows
    ]


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  GET /schemes — filtered scheme listing                                ║
# ╚══════════════════════════════════════════════════════════════════════════╝

@router.get("/schemes")
async def list_schemes(
    state: Optional[str] = Query(None, description="Filter by state"),
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db),
):
    """Return all active schemes, optionally filtered by state and category."""
    q = db.query(SchemeDB).filter(SchemeDB.active == True)

    if category:
        q = q.filter(SchemeDB.category == category)

    rows = q.all()

    # Filter by state in Python (states_applicable is a JSON list)
    results = []
    for r in rows:
        states = json.loads(r.states_applicable) if r.states_applicable else []
        if state and "ALL" not in states and state not in states:
            continue
        results.append({
            "scheme_id": r.scheme_id,
            "name": r.name,
            "ministry": r.ministry,
            "category": r.category,
            "description": r.description,
            "eligibility": json.loads(r.eligibility) if r.eligibility else {},
            "benefit_inr": r.benefit_inr,
            "benefit_desc": r.benefit_desc,
            "enrollment_url": r.enrollment_url,
            "deadline": r.deadline,
            "states_applicable": states,
            "active": r.active,
        })

    return results


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  GET /languages — supported language list                             ║
# ╚══════════════════════════════════════════════════════════════════════════╝

@router.get("/languages")
async def list_supported_languages():
    """Return all Sarvam-supported Indian languages for the frontend selector."""
    return {
        "languages": [
            {"code": code, "label": label}
            for code, label in SUPPORTED_LANGUAGES.items()
        ]
    }


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  POST /stt — speech to text                                           ║
# ╚══════════════════════════════════════════════════════════════════════════╝

@router.post("/stt")
async def speech_to_text(
    audio: UploadFile = File(...),
    language_code: str = Form("hi-IN"),
):
    """
    Receive an audio file from the browser (WebM/WAV/MP3),
    send to Sarvam saarika:v1, return transcript.
    """
    audio_bytes = await audio.read()
    result = await transcribe_audio(
        audio_bytes=audio_bytes,
        language_code=language_code,
        filename=audio.filename or "audio.webm",
    )
    if result.get("error"):
        raise HTTPException(status_code=502, detail=f"STT failed: {result['error']}")
    return {
        "transcript": result["transcript"],
        "language_code": result["language_code"],
    }


class TTSRequest(BaseModel):
    text: str
    language_code: str = "hi-IN"


@router.post("/tts")
async def text_to_speech(req: TTSRequest):
    """
    Receive advisory text + language code,
    return Sarvam bulbul:v1 audio as base64 WAV string.
    """
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="text field is required")
    result = await synthesise_speech(
        text=req.text,
        language_code=req.language_code,
    )
    if result.get("error"):
        raise HTTPException(status_code=502, detail=f"TTS failed: {result['error']}")
    return {
        "audio_base64": result["audio_base64"],
        "language_code": result["language_code"],
    }


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  GET /health — system health check                                    ║
# ╚══════════════════════════════════════════════════════════════════════════╝

@router.get("/health")
async def health_check():
    """System health check — lists all online agents and layers."""
    return {
        "status": "online",
        "version": "0.1.0",
        "agents_online": [
            "voice_agent",
            "soil_agent",
            "crop_agent",
            "pest_disease_agent",
            "weather_agent",
            "mandi_agent",
            "scheme_agent",
            "finance_agent",
        ],
        "compliance_layer": "active",
        "audit_trail": "active",
        "timestamp": datetime.utcnow().isoformat(),
    }

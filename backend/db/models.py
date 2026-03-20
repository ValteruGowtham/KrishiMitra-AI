"""
KrishiMitra AI — SQLAlchemy ORM models, DB initialisation, and scheme seed data.
"""

from __future__ import annotations

import json
import uuid
from datetime import datetime
from typing import Generator

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    Integer,
    String,
    Text,
    create_engine,
)
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from backend.schemas import SoilType

# ---------------------------------------------------------------------------
# Engine / Session setup
# ---------------------------------------------------------------------------

DATABASE_URL = "sqlite:///./krishimitra.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ---------------------------------------------------------------------------
# Helper: store Python objects as JSON text columns
# ---------------------------------------------------------------------------

def _json_col():
    """Shorthand for a nullable JSON-as-text column."""
    return Column(Text, default="[]")


# ---------------------------------------------------------------------------
# ORM Models
# ---------------------------------------------------------------------------

class FarmerProfileDB(Base):
    __tablename__ = "farmer_profiles"

    farmer_id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    language = Column(String, default="hi")
    land_acres = Column(Float, nullable=False)
    current_crop = Column(String, nullable=True)
    crop_history = Column(Text, default="[]")           # JSON list
    soil_profile = Column(Text, nullable=True)           # JSON dict
    monthly_income_inr = Column(Float, nullable=True)
    has_kisan_credit_card = Column(Boolean, default=False)
    enrolled_schemes = Column(Text, default="[]")        # JSON list
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AuditLogDB(Base):
    __tablename__ = "audit_logs"

    audit_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    query_id = Column(String, nullable=False, index=True)
    farmer_id = Column(String, nullable=False, index=True)
    raw_input = Column(Text, nullable=False)
    intent = Column(String, nullable=True)
    agents_invoked = Column(Text, default="[]")          # JSON list
    agent_responses = Column(Text, default="{}")         # JSON dict
    compliance_flags = Column(Text, default="[]")        # JSON list
    compliance_passed = Column(Boolean, default=False)
    distress_detected = Column(Boolean, default=False)
    final_advisory = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)


class SchemeDB(Base):
    __tablename__ = "schemes"

    scheme_id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)
    ministry = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    eligibility = Column(Text, default="{}")             # JSON dict
    benefit_inr = Column(Float, nullable=True)
    benefit_desc = Column(Text, nullable=True)
    enrollment_url = Column(String, nullable=True)
    deadline = Column(String, nullable=True)
    states_applicable = Column(Text, default='["ALL"]')  # JSON list
    active = Column(Boolean, default=True)


class MandiPriceCacheDB(Base):
    __tablename__ = "mandi_price_cache"

    id = Column(Integer, primary_key=True, autoincrement=True)
    commodity = Column(String, nullable=False, index=True)
    market = Column(String, nullable=False)
    state = Column(String, nullable=False)
    district = Column(String, nullable=False)
    min_price = Column(Float, nullable=True)
    max_price = Column(Float, nullable=True)
    modal_price = Column(Float, nullable=True)
    msp = Column(Float, nullable=True)
    fetched_at = Column(DateTime, default=datetime.utcnow, index=True)


# ---------------------------------------------------------------------------
# FastAPI dependency
# ---------------------------------------------------------------------------

def get_db() -> Generator[Session, None, None]:
    """Yield a SQLAlchemy session; auto-close on completion."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Seed data — 20 Indian government agricultural schemes
# ---------------------------------------------------------------------------

_SCHEMES = [
    {
        "name": "PM-KISAN",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "income_support",
        "description": "Pradhan Mantri Kisan Samman Nidhi provides ₹6,000/year in three instalments to small and marginal farmer families.",
        "eligibility": {"land_acres_max": 5, "exclude_tax_payers": True, "exclude_govt_employees": True},
        "benefit_inr": 6000,
        "benefit_desc": "₹6,000 per year in 3 equal instalments of ₹2,000 each",
        "enrollment_url": "https://pmkisan.gov.in",
        "deadline": "Rolling",
        "states_applicable": ["ALL"],
    },
    {
        "name": "PM Fasal Bima Yojana",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "crop_insurance",
        "description": "Subsidised crop insurance covering yield losses from natural calamities, pests, and diseases.",
        "eligibility": {"kcc_holder": True, "crops": ["kharif", "rabi", "commercial", "horticultural"]},
        "benefit_inr": 200000,
        "benefit_desc": "Sum insured up to ₹2,00,000; farmer premium 1.5%-5% of sum insured",
        "enrollment_url": "https://pmfby.gov.in",
        "deadline": "Kharif: 31 Jul, Rabi: 31 Dec",
        "states_applicable": ["ALL"],
    },
    {
        "name": "Kisan Credit Card",
        "ministry": "Ministry of Finance / NABARD",
        "category": "credit",
        "description": "Short-term crop loans at subsidised 4% interest (with prompt repayment rebate) up to ₹3 lakh.",
        "eligibility": {"land_owner_or_tenant": True, "min_age": 18, "max_age": 75},
        "benefit_inr": 300000,
        "benefit_desc": "Crop loan up to ₹3,00,000 at 4% p.a. (with interest subvention)",
        "enrollment_url": "https://www.pmkisan.gov.in/kcc",
        "deadline": "Rolling",
        "states_applicable": ["ALL"],
    },
    {
        "name": "PMKSY - Pradhan Mantri Krishi Sinchayee Yojana",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "irrigation",
        "description": "Per Drop More Crop — subsidies for micro-irrigation (drip, sprinkler) to improve water-use efficiency.",
        "eligibility": {"land_owner_or_tenant": True, "irrigation_type": ["drip", "sprinkler"]},
        "benefit_inr": 50000,
        "benefit_desc": "55% subsidy for small/marginal farmers, 45% for others on micro-irrigation systems",
        "enrollment_url": "https://pmksy.gov.in",
        "deadline": "Rolling",
        "states_applicable": ["ALL"],
    },
    {
        "name": "Soil Health Card Scheme",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "soil_health",
        "description": "Free soil testing and nutrient-status cards with crop-wise fertiliser recommendations issued every 2 years.",
        "eligibility": {"any_farmer": True},
        "benefit_inr": 0,
        "benefit_desc": "Free soil testing, nutrient status report, and fertiliser recommendations",
        "enrollment_url": "https://soilhealth.dac.gov.in",
        "deadline": "Rolling",
        "states_applicable": ["ALL"],
    },
    {
        "name": "National Food Security Mission (NFSM)",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "production",
        "description": "Subsidised seeds, farm machinery, and demonstrations to boost production of rice, wheat, pulses, coarse cereals, and nutri-cereals.",
        "eligibility": {"crops": ["rice", "wheat", "pulses", "coarse_cereals", "nutri_cereals"]},
        "benefit_inr": 25000,
        "benefit_desc": "50% subsidy on certified seeds; ₹25,000 assistance for farm mechanisation",
        "enrollment_url": "https://nfsm.gov.in",
        "deadline": "Annual — check state notification",
        "states_applicable": ["ALL"],
    },
    {
        "name": "Rashtriya Krishi Vikas Yojana (RKVY-RAFTAAR)",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "infrastructure",
        "description": "Flexi-fund scheme for states to invest in agri-infrastructure, value-chain projects, and agri-startups.",
        "eligibility": {"state_approved_project": True},
        "benefit_inr": 2500000,
        "benefit_desc": "Project-based funding up to ₹25 lakh for agri-startups; infrastructure grants via state govts",
        "enrollment_url": "https://rkvy.nic.in",
        "deadline": "Annual state-level call",
        "states_applicable": ["ALL"],
    },
    {
        "name": "Mission for Integrated Development of Horticulture (MIDH)",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "horticulture",
        "description": "Financial assistance for area expansion, rejuvenation of orchards, protected cultivation, and post-harvest management in horticulture.",
        "eligibility": {"crops": ["fruits", "vegetables", "flowers", "spices", "medicinal_plants"]},
        "benefit_inr": 80000,
        "benefit_desc": "Up to ₹80,000/ha for area expansion; 50% subsidy on greenhouses/polyhouses",
        "enrollment_url": "https://midh.gov.in",
        "deadline": "Annual",
        "states_applicable": ["ALL"],
    },
    {
        "name": "Sub-Mission on Agricultural Mechanisation (SMAM)",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "mechanisation",
        "description": "Subsidies on purchase of farm machinery, custom hiring centres, and hi-tech equipment hubs.",
        "eligibility": {"any_farmer": True, "priority": "small_marginal"},
        "benefit_inr": 150000,
        "benefit_desc": "40-50% subsidy on machinery purchase; up to ₹1.5 lakh per implement for SC/ST/small farmers",
        "enrollment_url": "https://agrimachinery.nic.in",
        "deadline": "Rolling",
        "states_applicable": ["ALL"],
    },
    {
        "name": "Formation and Promotion of 10,000 FPOs",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "collective_farming",
        "description": "Supports formation of Farmer Producer Organisations with equity grants and credit guarantee for collective bargaining and market access.",
        "eligibility": {"min_members": 300, "min_members_ne_hilly": 100},
        "benefit_inr": 1800000,
        "benefit_desc": "₹18 lakh equity grant per FPO over 3 years; credit guarantee up to ₹2 crore",
        "enrollment_url": "https://enam.gov.in/web/fpo",
        "deadline": "Rolling until 2027-28",
        "states_applicable": ["ALL"],
    },
    {
        "name": "Paramparagat Krishi Vikas Yojana (PKVY)",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "organic_farming",
        "description": "Cluster-based organic farming programme providing ₹50,000/ha over 3 years for organic inputs, certification, and marketing.",
        "eligibility": {"cluster_size_ha_min": 20, "willing_for_organic": True},
        "benefit_inr": 50000,
        "benefit_desc": "₹50,000 per hectare over 3 years (₹31,000 for inputs + ₹8,800 for certification + value addition)",
        "enrollment_url": "https://pgsindia-ncof.gov.in/pkvy",
        "deadline": "Annual",
        "states_applicable": ["ALL"],
    },
    {
        "name": "NABARD Agriculture Infrastructure Fund (AIF)",
        "ministry": "Ministry of Agriculture & Farmers Welfare / NABARD",
        "category": "infrastructure",
        "description": "₹1 lakh crore financing facility with 3% interest subvention and CGTMSE credit guarantee for post-harvest and community farming infrastructure.",
        "eligibility": {"entities": ["farmer", "fpo", "agri_entrepreneur", "startup"], "viable_project": True},
        "benefit_inr": 20000000,
        "benefit_desc": "Loan up to ₹2 crore with 3% interest subvention for 7 years; CGTMSE guarantee up to ₹2 crore",
        "enrollment_url": "https://agriinfra.dac.gov.in",
        "deadline": "Rolling until 2032-33",
        "states_applicable": ["ALL"],
    },
    {
        "name": "Agricultural Technology Management Agency (ATMA)",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "extension",
        "description": "District-level extension services — farmer training, demonstrations, exposure visits, and technology dissemination.",
        "eligibility": {"any_farmer": True},
        "benefit_inr": 15000,
        "benefit_desc": "Free training, demonstration plots; up to ₹15,000 for exposure visits and FFS participation",
        "enrollment_url": "https://extensionreforms.dacnet.nic.in",
        "deadline": "Rolling",
        "states_applicable": ["ALL"],
    },
    {
        "name": "National Mission on Agricultural Extension & Technology (NMAET)",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "extension",
        "description": "Umbrella mission integrating ATMA, seed & planting material, and agri-mechanisation sub-missions for technology uptake.",
        "eligibility": {"any_farmer": True, "focus": ["seeds", "mechanisation", "extension"]},
        "benefit_inr": 25000,
        "benefit_desc": "Subsidised seed minikits; ₹25,000 demonstrations; mechanisation subsidies per SMAM norms",
        "enrollment_url": "https://agricoop.nic.in",
        "deadline": "Annual",
        "states_applicable": ["ALL"],
    },
    {
        "name": "Direct Benefit Transfer for Fertiliser Subsidy (DBT-Fertiliser)",
        "ministry": "Ministry of Chemicals & Fertilizers",
        "category": "input_subsidy",
        "description": "Fertiliser subsidy credited directly to companies; farmers buy urea at MRP ₹242/45 kg via Aadhaar-linked PoS.",
        "eligibility": {"any_farmer": True, "aadhaar_linked": True},
        "benefit_inr": 500,
        "benefit_desc": "Urea at ₹242/45 kg (govt subsidy ~₹2,500/bag); DAP at ₹1,350/50 kg",
        "enrollment_url": "https://fert.nic.in/dbt",
        "deadline": "Ongoing",
        "states_applicable": ["ALL"],
    },
    {
        "name": "eNAM - National Agriculture Market",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "category": "market_access",
        "description": "Pan-India electronic trading portal linking 1,361 APMC mandis for transparent price discovery.",
        "eligibility": {"any_farmer": True, "required_docs": ["aadhaar", "bank_account"]},
        "benefit_inr": 0,
        "benefit_desc": "Free registration; transparent bidding; direct payment to bank account; no mandi fee in some states",
        "enrollment_url": "https://enam.gov.in",
        "deadline": "Rolling",
        "states_applicable": ["ALL"],
    },
    {
        "name": "WDRA Warehouse Receipt Financing",
        "ministry": "Ministry of Consumer Affairs, Food & Public Distribution",
        "category": "post_harvest",
        "description": "Negotiable warehouse receipts allowing farmers to store produce and avail loans at low interest instead of distress-selling.",
        "eligibility": {"registered_warehouse": True, "commodities": ["cereals", "pulses", "oilseeds", "spices"]},
        "benefit_inr": 0,
        "benefit_desc": "Pledge loans up to 70% of commodity value at ~7% interest; storage in WDRA-registered warehouses",
        "enrollment_url": "https://wdra.gov.in",
        "deadline": "Rolling",
        "states_applicable": ["ALL"],
    },
    {
        "name": "MGNREGS - Farm-related Works",
        "ministry": "Ministry of Rural Development",
        "category": "rural_employment",
        "description": "100 days guaranteed wage employment; includes farm-related works — land development, water harvesting, plantation on private land of SC/ST/BPL.",
        "eligibility": {"rural_household": True, "job_card": True},
        "benefit_inr": 30000,
        "benefit_desc": "100 days guaranteed employment at ₹267-₹351/day (state-wise); farm pond, land levelling, plantation on own land",
        "enrollment_url": "https://nrega.nic.in",
        "deadline": "Rolling",
        "states_applicable": ["ALL"],
    },
    {
        "name": "Rajasthan Tarbandi (Fencing) Yojana",
        "ministry": "Rajasthan State Government — Agriculture Department",
        "category": "crop_protection",
        "description": "Subsidy for barbed-wire fencing to protect crops from stray/wild animals; up to 400 running metres per farmer.",
        "eligibility": {"land_acres_min": 0.5, "state_resident": True},
        "benefit_inr": 48000,
        "benefit_desc": "50% subsidy up to ₹48,000 (max 400 rmt); for small/marginal & SC/ST — 60% subsidy",
        "enrollment_url": "https://rajkisan.rajasthan.gov.in",
        "deadline": "Annual — check state portal",
        "states_applicable": ["Rajasthan"],
    },
    {
        "name": "Punjab Crop Diversification Programme",
        "ministry": "Punjab State Government — Agriculture Department",
        "category": "crop_diversification",
        "description": "Incentivises shifting from paddy monoculture to maize, cotton, basmati, pulses, and oilseeds to conserve groundwater.",
        "eligibility": {"state_resident": True, "current_crop_paddy": True, "shift_to": ["maize", "cotton", "pulses", "oilseeds", "basmati"]},
        "benefit_inr": 15000,
        "benefit_desc": "₹15,000/ha incentive for switching from non-basmati paddy; free seed kits and technical guidance",
        "enrollment_url": "https://agri.punjab.gov.in",
        "deadline": "Kharif season (May-Jun)",
        "states_applicable": ["Punjab"],
    },
]


# ---------------------------------------------------------------------------
# Seed helper
# ---------------------------------------------------------------------------

def _seed_schemes(session: Session) -> int:
    """Insert predefined schemes if they don't already exist. Returns count seeded."""
    existing = {s.name for s in session.query(SchemeDB.name).all()}
    count = 0
    for s in _SCHEMES:
        if s["name"] not in existing:
            session.add(
                SchemeDB(
                    scheme_id=str(uuid.uuid4()),
                    name=s["name"],
                    ministry=s["ministry"],
                    category=s["category"],
                    description=s["description"],
                    eligibility=json.dumps(s["eligibility"]),
                    benefit_inr=s["benefit_inr"],
                    benefit_desc=s["benefit_desc"],
                    enrollment_url=s.get("enrollment_url"),
                    deadline=s.get("deadline"),
                    states_applicable=json.dumps(s["states_applicable"]),
                    active=True,
                )
            )
            count += 1
    session.commit()
    return count


# ---------------------------------------------------------------------------
# DB init (create tables + seed)
# ---------------------------------------------------------------------------

def init_db() -> None:
    """Create all tables and seed reference data."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seeded = _seed_schemes(db)
        total = db.query(SchemeDB).count()
        print(f"✅ Tables created.  Schemes seeded this run: {seeded}, total in DB: {total}")
    finally:
        db.close()

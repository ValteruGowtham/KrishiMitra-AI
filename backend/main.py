"""
KrishiMitra AI — FastAPI application entry point.
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from backend.api.routes.advisory import router as advisory_router
from backend.api.routes.mandi import router as mandi_router
from backend.api.routes.weather import router as weather_router
from backend.db.models import init_db


# Load project .env so API keys are available in all routes
PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")


# ---------------------------------------------------------------------------
# Lifespan — runs init_db() on startup
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialise database tables and seed data on startup."""
    init_db()
    yield


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="KrishiMitra AI",
    description="AI-powered agricultural advisory platform for Indian farmers",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — allow all origins for MVP
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount advisory router
app.include_router(advisory_router, prefix="/api/v1")

# Mount mandi router
app.include_router(mandi_router, prefix="/api/v1")

# Mount weather router
app.include_router(weather_router, prefix="/api/v1")


# ---------------------------------------------------------------------------
# Root
# ---------------------------------------------------------------------------

@app.get("/")
async def root():
    return {
        "project": "KrishiMitra AI",
        "description": "AI-powered agricultural advisory for Indian farmers",
        "docs": "/docs",
        "health": "/api/v1/health",
    }

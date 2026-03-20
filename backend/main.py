"""
KrishiMitra AI — FastAPI application entry point.
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes.advisory import router as advisory_router
from backend.db.models import init_db


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

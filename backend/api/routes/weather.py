"""
KrishiMitra AI — Weather forecast API routes.
"""

from __future__ import annotations

import json
import os
import re
from pathlib import Path
from urllib.parse import quote_plus
from datetime import date, timedelta
from typing import Optional

import aiohttp
from dotenv import load_dotenv
from fastapi import APIRouter, Query

router = APIRouter()

# Weather provider configuration defaults
DEFAULT_GEMINI_MODEL = "gemini-2.0-flash"
PROJECT_ENV_PATH = Path(__file__).resolve().parents[3] / ".env"

# Demo forecast template (fallback)
DEMO_FORECAST_TEMPLATE = [
    {"day": 1, "temp_max": 38, "temp_min": 22, "humidity": 35, "condition": "Clear sky", "wind_kmh": 12, "rain_mm": 0, "icon": "☀️"},
    {"day": 2, "temp_max": 39, "temp_min": 23, "humidity": 30, "condition": "Hazy sunshine", "wind_kmh": 15, "rain_mm": 0, "icon": "🌤️"},
    {"day": 3, "temp_max": 36, "temp_min": 21, "humidity": 55, "condition": "Partly cloudy", "wind_kmh": 18, "rain_mm": 0, "icon": "⛅"},
    {"day": 4, "temp_max": 33, "temp_min": 20, "humidity": 72, "condition": "Thunderstorm likely", "wind_kmh": 25, "rain_mm": 15, "icon": "⛈️"},
    {"day": 5, "temp_max": 34, "temp_min": 21, "humidity": 60, "condition": "Clearing up", "wind_kmh": 10, "rain_mm": 2, "icon": "🌤️"},
]


def build_demo_forecast() -> list[dict]:
    """Build demo forecast with real calendar dates for upcoming 5 days."""
    today = date.today()
    forecast: list[dict] = []

    for item in DEMO_FORECAST_TEMPLATE:
        day_no = int(item.get("day", 1))
        target_date = today + timedelta(days=day_no)
        enriched = {**item, "date": target_date.isoformat()}
        forecast.append(enriched)

    return forecast

# Farming advisory based on weather conditions
FARMING_ADVISORY = {
    "Clear sky": {
        "action": "Good day for field operations, spraying, and harvesting",
        "irrigation": "Increase irrigation frequency due to high evaporation",
        "risk": "Low",
    },
    "Hazy sunshine": {
        "action": "Continue field operations with adequate hydration",
        "irrigation": "Maintain regular irrigation schedule",
        "risk": "Low",
    },
    "Partly cloudy": {
        "action": "Favorable for most farming activities",
        "irrigation": "Monitor soil moisture, reduce irrigation if needed",
        "risk": "Low",
    },
    "Thunderstorm likely": {
        "action": "Avoid spraying, secure loose materials, harvest if ready",
        "irrigation": "Skip irrigation, expect rainfall",
        "risk": "High - protect crops from wind damage",
    },
    "Clearing up": {
        "action": "Resume field operations, check for waterlogging",
        "irrigation": "Assess soil moisture before irrigating",
        "risk": "Low",
    },
    "Rain": {
        "action": "Ensure proper drainage, avoid field operations",
        "irrigation": "Skip irrigation",
        "risk": "Medium - watch for waterlogging",
    },
    "Overcast": {
        "action": "Good for transplanting and nursery operations",
        "irrigation": "Reduce irrigation frequency",
        "risk": "Low",
    },
}

CONDITION_ICON_MAP = {
    "clear": "☀️",
    "sunny": "☀️",
    "partly cloudy": "⛅",
    "cloudy": "☁️",
    "overcast": "☁️",
    "rain": "🌧️",
    "light rain": "🌦️",
    "thunder": "⛈️",
    "storm": "⛈️",
    "mist": "🌫️",
    "fog": "🌫️",
}


def _extract_json_object(raw: str) -> Optional[dict]:
    """Extract first valid JSON object from model text output."""
    if not raw:
        return None

    text = raw.strip()
    try:
        return json.loads(text)
    except Exception:
        pass

    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        return None

    try:
        return json.loads(match.group(0))
    except Exception:
        return None


def _pick_icon(condition: str) -> str:
    c = (condition or "").lower()
    for key, icon in CONDITION_ICON_MAP.items():
        if key in c:
            return icon
    return "⛅"


def _normalize_groq_day(day: dict, idx: int) -> dict:
    today = date.today()
    target_date = today + timedelta(days=idx + 1)

    condition = str(day.get("condition", "Partly cloudy"))
    return {
        "day": idx + 1,
        "date": str(day.get("date") or target_date.isoformat()),
        "temp_max": int(day.get("temp_max", 35)),
        "temp_min": int(day.get("temp_min", 24)),
        "humidity": int(day.get("humidity", 50)),
        "condition": condition,
        "wind_kmh": int(day.get("wind_kmh", 10)),
        "rain_mm": int(day.get("rain_mm", 0)),
        "icon": str(day.get("icon") or _pick_icon(condition)),
    }


def _normalize_groq_current(current: dict) -> dict:
    condition = str(current.get("condition", "Partly cloudy"))
    temp = int(current.get("temperature", 32))
    return {
        "temperature": temp,
        "feels_like": int(current.get("feels_like", temp + 2)),
        "humidity": int(current.get("humidity", 45)),
        "condition": condition,
        "wind_kmh": int(current.get("wind_kmh", 12)),
        "icon": str(current.get("icon") or _pick_icon(condition)),
        "uv_index": int(current.get("uv_index", 6)),
        "visibility_km": int(current.get("visibility_km", 8)),
    }


async def fetch_imd_forecast(state: str, district: str) -> tuple[Optional[list], Optional[str]]:
    """
    Fetch weather forecast from IMD API.
    """
    load_dotenv(PROJECT_ENV_PATH, override=True)
    api_key = os.getenv("IMD_API_KEY", "")
    if not api_key:
        return None, "missing_imd_api_key"

    state_q = quote_plus(state)
    district_q = quote_plus(district)
    url = f"https://api.imd.gov.in/forecast?state={state_q}&district={district_q}"
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                url,
                headers={"X-API-Key": api_key},
                timeout=aiohttp.ClientTimeout(total=5),
            ) as resp:
                if resp.status != 200:
                    return None, f"imd_http_{resp.status}"
                data = await resp.json()
                # Normalize IMD API response to our schema
                # (adjust based on actual IMD API response format)
                forecast = data.get("forecast", None)
                if not forecast:
                    return None, "imd_response_missing_forecast"
                return forecast, None
    except Exception as exc:
        return None, f"imd_request_error:{type(exc).__name__}"


async def fetch_gemini_weather(state: str, district: str) -> tuple[Optional[dict], Optional[str]]:
    """Fetch weather estimation from Gemini LLM in strict JSON format."""
    load_dotenv(PROJECT_ENV_PATH, override=True)
    gemini_api_key = os.getenv("GEMINI_API_KEY", "")
    gemini_model = os.getenv("GEMINI_WEATHER_MODEL", DEFAULT_GEMINI_MODEL)

    if not gemini_api_key:
        return None, "missing_gemini_api_key"

    prompt = (
        "Return ONLY JSON. No markdown. "
        "Provide realistic weather estimate for next 5 days for this Indian location. "
        "Use this exact schema:\n"
        "{\n"
        '  "current": {"temperature": int, "feels_like": int, "humidity": int, "condition": str, "wind_kmh": int, "uv_index": int, "visibility_km": int, "icon": str},\n'
        '  "forecast": [\n'
        '    {"day": 1, "date": "YYYY-MM-DD", "temp_max": int, "temp_min": int, "humidity": int, "condition": str, "wind_kmh": int, "rain_mm": int, "icon": str},\n'
        "    ... exactly 5 items with day=1..5 ...\n"
        "  ]\n"
        "}\n"
        "Location: " + district + ", " + state
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": "You are a weather assistant. Reply with strict JSON only.\n" + prompt,
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
        },
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/{gemini_model}:generateContent?key={gemini_api_key}",
                headers={"Content-Type": "application/json"},
                json=payload,
                timeout=aiohttp.ClientTimeout(total=12),
            ) as resp:
                if resp.status != 200:
                    body = await resp.text()
                    if "api key not valid" in body.lower() or "invalid api key" in body.lower():
                        return None, "gemini_invalid_api_key"
                    return None, f"gemini_http_{resp.status}:{body[:120]}"

                data = await resp.json()
                content = (
                    data.get("candidates", [{}])[0]
                    .get("content", {})
                    .get("parts", [{}])[0]
                    .get("text", "")
                )
                parsed = _extract_json_object(content)
                if not parsed:
                    return None, "gemini_invalid_json"

                forecast_raw = parsed.get("forecast") or []
                current_raw = parsed.get("current") or {}
                if not isinstance(forecast_raw, list) or len(forecast_raw) < 5:
                    return None, "gemini_missing_forecast"

                normalized_forecast = [_normalize_groq_day(day, idx) for idx, day in enumerate(forecast_raw[:5])]
                normalized_current = _normalize_groq_current(current_raw)

                return {
                    "current": normalized_current,
                    "forecast": normalized_forecast,
                }, None
    except Exception as exc:
        return None, f"gemini_request_error:{type(exc).__name__}"


def get_farming_advisory(condition: str) -> dict:
    """Get farming advisory based on weather condition."""
    # Fuzzy match condition
    condition_lower = condition.lower()
    for key, value in FARMING_ADVISORY.items():
        if key.lower() in condition_lower or condition_lower in key.lower():
            return value
    # Default advisory
    return FARMING_ADVISORY["Partly cloudy"]


@router.get("/weather/forecast")
async def get_weather_forecast(
    state: str = Query(..., description="State name (e.g., Rajasthan)"),
    district: str = Query(..., description="District name (e.g., Ajmer)"),
):
    """
    Get 5-day weather forecast with farming advisory.
    Falls back to demo data if IMD API is unavailable.
    """
    # 1) Try IMD API
    forecast, fallback_reason = await fetch_imd_forecast(state, district)
    source = "imd_api"
    
    if not forecast:
        # 2) Try Gemini weather estimation
        gemini_data, gemini_reason = await fetch_gemini_weather(state, district)
        if gemini_data and gemini_data.get("forecast"):
            forecast = gemini_data["forecast"]
            source = "gemini_llm"
            fallback_reason = "live_gemini"
        else:
            # 3) Demo fallback
            forecast = build_demo_forecast()
            source = "demo_data"
            fallback_reason = gemini_reason or fallback_reason
    
    # Add farming advisory to each day
    enriched_forecast = []
    for day in forecast:
        condition = day.get("condition", "Clear sky")
        advisory = get_farming_advisory(condition)
        
        enriched_forecast.append({
            "day": day.get("day", 1),
            "date": day.get("date", f"Day {day.get('day', 1)}"),
            "temp_max": day.get("temp_max", 35),
            "temp_min": day.get("temp_min", 22),
            "humidity": day.get("humidity", 50),
            "condition": condition,
            "wind_kmh": day.get("wind_kmh", 10),
            "rain_mm": day.get("rain_mm", 0),
            "icon": day.get("icon", "☀️"),
            "farming_action": advisory["action"],
            "irrigation_advice": advisory["irrigation"],
            "risk_level": advisory["risk"],
        })
    
    return {
        "success": True,
        "location": {
            "state": state,
            "district": district,
        },
        "forecast": enriched_forecast,
        "source": source,
        "source_reason": fallback_reason if source != "imd_api" else "live_imd",
        "units": {
            "temperature": "Celsius",
            "wind": "km/h",
            "rain": "mm",
        },
    }


@router.get("/weather/current")
async def get_current_weather(
    state: str = Query(..., description="State name"),
    district: str = Query(..., description="District name"),
):
    """
    Get current weather conditions.
    Uses Gemini estimation when available, otherwise falls back to demo data.
    """
    gemini_data, gemini_reason = await fetch_gemini_weather(state, district)
    if gemini_data and gemini_data.get("current"):
        return {
            "success": True,
            "location": {
                "state": state,
                "district": district,
            },
            "current": gemini_data["current"],
            "source": "gemini_llm",
            "source_reason": "live_gemini",
        }

    # Demo current weather fallback
    demo_current = {
        "temperature": 32,
        "feels_like": 35,
        "humidity": 45,
        "condition": "Partly cloudy",
        "wind_kmh": 15,
        "icon": "⛅",
        "uv_index": 7,
        "visibility_km": 10,
    }
    
    return {
        "success": True,
        "location": {
            "state": state,
            "district": district,
        },
        "current": demo_current,
        "source": "demo_data",
        "source_reason": gemini_reason or "demo_fallback",
    }

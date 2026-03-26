"""
KrishiMitra AI — Mandi rates and market data API routes.
"""

from __future__ import annotations

import asyncio
from typing import List, Optional

import aiohttp
from fastapi import APIRouter, Query

router = APIRouter()

# data.gov.in AgMarkNet configuration
DATA_GOV_IN_API_KEY = ""
DATA_GOV_IN_RESOURCE_ID = ""

# Demo data fallback
DEMO_MANDI_DATA = [
    {"crop": "Wheat (Sharbati)", "state": "Rajasthan", "mandi": "Ajmer", "price": 2380, "msp": 2275, "chg": 4.6},
    {"crop": "Rice (Basmati)", "state": "Haryana", "mandi": "Karnal", "price": 3400, "msp": 3100, "chg": 2.1},
    {"crop": "Cotton", "state": "Gujarat", "mandi": "Rajkot", "price": 7800, "msp": 6620, "chg": -1.2},
    {"crop": "Soybean", "state": "M.P.", "mandi": "Indore", "price": 4800, "msp": 4600, "chg": 3.5},
    {"crop": "Mustard", "state": "Rajasthan", "mandi": "Bharatpur", "price": 5600, "msp": 5650, "chg": -0.8},
    {"crop": "Onion", "state": "Maharashtra", "mandi": "Lasalgaon", "price": 2100, "msp": None, "chg": 12.5},
    {"crop": "Tur/Arhar", "state": "Karnataka", "mandi": "Kalaburagi", "price": 10500, "msp": 7000, "chg": 8.4},
    {"crop": "Maize", "state": "Karnataka", "mandi": "Hubli", "price": 2150, "msp": 2090, "chg": 1.8},
    {"crop": "Bajra", "state": "Rajasthan", "mandi": "Jodhpur", "price": 2650, "msp": 2500, "chg": 3.2},
    {"crop": "Gram", "state": "M.P.", "mandi": "Ujjain", "price": 5600, "msp": 5440, "chg": 2.5},
    {"crop": "Groundnut", "state": "Gujarat", "mandi": "Junagadh", "price": 7200, "msp": 6900, "chg": -0.5},
    {"crop": "Tomato", "state": "Maharashtra", "mandi": "Pune", "price": 1800, "msp": None, "chg": 15.3},
    {"crop": "Potato", "state": "U.P.", "mandi": "Agra", "price": 1250, "msp": None, "chg": -2.1},
    {"crop": "Chilli", "state": "Telangana", "mandi": "Warangal", "price": 9800, "msp": None, "chg": 5.7},
]

MSP_DATA = [
    {"crop": "Wheat", "price": 2275},
    {"crop": "Paddy (Common)", "price": 2183},
    {"crop": "Mustard", "price": 5650},
    {"crop": "Cotton", "price": 6620},
    {"crop": "Soybean", "price": 4600},
    {"crop": "Gram", "price": 5440},
    {"crop": "Tur", "price": 7000},
    {"crop": "Maize", "price": 2090},
    {"crop": "Bajra", "price": 2500},
    {"crop": "Groundnut", "price": 6900},
    {"crop": "Sunflower", "price": 6820},
    {"crop": "Nigerseed", "price": 7360},
    {"crop": "Safflower", "price": 5575},
]


async def fetch_from_datagovin(commodity: str, state: Optional[str] = None) -> Optional[list]:
    """
    Fetch mandi prices from data.gov.in AgMarkNet dataset.
    """
    api_key = DATA_GOV_IN_API_KEY
    resource_id = DATA_GOV_IN_RESOURCE_ID
    
    if not api_key or not resource_id:
        return None

    url = f"https://api.data.gov.in/resource/{resource_id}"
    params = {
        "api-key": api_key,
        "format": "json",
        "limit": "100",
    }
    
    if state:
        params["filters[state]"] = state
    if commodity:
        params["filters[commodity]"] = commodity.capitalize()

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                url,
                params=params,
                timeout=aiohttp.ClientTimeout(total=10),
            ) as resp:
                if resp.status != 200:
                    return None
                data = await resp.json()
                records = data.get("records", [])
                if not records:
                    return None

                # Normalize to our schema
                normalized = []
                for r in records:
                    try:
                        modal = float(r.get("modal_price", 0) or 0)
                        normalized.append({
                            "commodity": r.get("commodity", commodity).lower(),
                            "market": r.get("market", ""),
                            "state": r.get("state", ""),
                            "district": r.get("district", ""),
                            "min_price": float(r.get("min_price", 0) or 0),
                            "max_price": float(r.get("max_price", 0) or 0),
                            "modal_price": modal,
                        })
                    except (ValueError, TypeError):
                        continue
                return normalized if normalized else None
    except Exception:
        return None


@router.get("/mandi/prices")
async def get_mandi_prices(
    crop: Optional[str] = Query(None, description="Filter by crop name"),
    state: Optional[str] = Query(None, description="Filter by state"),
):
    """
    Get live mandi prices from data.gov.in API with demo fallback.
    Returns prices with MSP comparison.
    """
    # Try to fetch from data.gov.in
    api_data = None
    if crop or state:
        api_data = await fetch_from_datagovin(crop or "", state)
    
    # Use demo data as fallback or if no filters
    if not api_data:
        api_data = DEMO_MANDI_DATA
    
    # Filter results
    filtered = api_data
    if crop:
        crop_lower = crop.lower()
        filtered = [
            d for d in filtered
            if crop_lower in d.get("crop", d.get("commodity", "")).lower()
        ]
    if state:
        state_lower = state.lower()
        filtered = [
            d for d in filtered
            if state_lower in d.get("state", "").lower()
        ]
    
    # Build MSP lookup
    msp_lookup = {m["crop"].lower(): m["price"] for m in MSP_DATA}
    
    # Format response
    results = []
    for item in filtered[:50]:  # Limit to 50 results
        crop_name = item.get("crop", item.get("commodity", "Unknown"))
        price = item.get("price", item.get("modal_price", 0))
        
        # Find MSP for this crop
        msp = None
        for msp_crop, msp_price in msp_lookup.items():
            if msp_crop in crop_name.lower() or crop_name.lower() in msp_crop:
                msp = msp_price
                break
        
        results.append({
            "crop": crop_name,
            "state": item.get("state", ""),
            "mandi": item.get("mandi", item.get("market", "")),
            "price": price,
            "msp": msp,
            "change": item.get("chg", 0),
        })
    
    return {
        "success": True,
        "count": len(results),
        "data": results,
        "msp_list": MSP_DATA,
        "source": "data.gov.in" if api_data else "demo_data",
    }


@router.get("/mandi/msp")
async def get_msp_list():
    """
    Get current MSP (Minimum Support Price) list for all crops.
    """
    return {
        "success": True,
        "data": MSP_DATA,
        "season": "FY 2024-25",
    }


@router.get("/mandi/states")
async def get_available_states():
    """
    Get list of states with available mandi data.
    """
    states = list(set(d["state"] for d in DEMO_MANDI_DATA))
    return {
        "success": True,
        "data": sorted(states),
    }


@router.get("/mandi/crops")
async def get_available_crops():
    """
    Get list of crops with available mandi data.
    """
    crops = list(set(d["crop"] for d in DEMO_MANDI_DATA))
    return {
        "success": True,
        "data": sorted(crops),
    }

"""
KrishiMitra AI — Five-layer compliance guardrails.

Layers (in order):
    1. Distress detection (short-circuits if triggered)
    2. Banned pesticide check
    3. MSP comparison check
    4. Fertiliser overdose check
    5. Financial predatory-lending check
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


# ---------------------------------------------------------------------------
# Result object
# ---------------------------------------------------------------------------

@dataclass
class ComplianceResult:
    passed: bool = True
    flags: List[str] = field(default_factory=list)
    distress_detected: bool = False
    mandatory_additions: List[str] = field(default_factory=list)
    helpline_routing: List[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

_DISTRESS_KEYWORDS = [
    "jeena nahi chahta", "karz se tang", "mar jaunga",
    "hopeless", "suicide", "sab khatam", "jaan de dunga",
    "aatmhatya", "nirasha", "tang aa gaya", "barbaad",
    "jeena nahi", "can't live", "want to die", "end my life",
]

_BANNED_PESTICIDES = [
    "monocrotophos", "endosulfan", "chlorpyrifos",
    "methyl parathion", "phorate", "carbofuran",
    "ddt", "lindane", "aldrin", "methomyl",
]

_MSP_TABLE = {
    "wheat": 2275, "paddy": 2300, "mustard": 5950,
    "cotton": 7121, "maize": 2090, "soybean": 4892,
    "groundnut": 6783, "bajra": 2500, "jowar": 3180,
    "ragi": 3846, "tur": 7000, "moong": 8558,
    "urad": 6950, "chana": 5440, "barley": 1850,
    "sugarcane": 315,
}

_HELPLINES = {
    "kisan_helpline": "Kisan Helpline: 1800-180-1551 (toll-free, 24×7)",
    "kvk_helpline": "Krishi Vigyan Kendra: 1800-425-1122 (toll-free)",
    "mental_health": "iCALL: 9152987821 | Vandrevala Foundation: 1860-2662-345",
}


# ---------------------------------------------------------------------------
# Main compliance function
# ---------------------------------------------------------------------------

def check_compliance(
    advisory_text: str,
    agent_responses: Dict[str, Any],
    raw_farmer_input: str,
) -> ComplianceResult:
    """
    Run all 5 compliance layers and return a ComplianceResult.

    Args:
        advisory_text: The synthesised advisory text to scan.
        agent_responses: Dict of agent_id → AgentMessage (or output_data dict).
        raw_farmer_input: The farmer's original query text.
    """
    result = ComplianceResult()
    text_lower = advisory_text.lower()
    input_lower = raw_farmer_input.lower()

    # ── Layer 1: DISTRESS CHECK (short-circuit) ──────────────────────────
    for kw in _DISTRESS_KEYWORDS:
        if kw in input_lower or kw in text_lower:
            result.distress_detected = True
            result.passed = False
            result.flags.append(f"DISTRESS_DETECTED: keyword='{kw}'")
            result.helpline_routing = list(_HELPLINES.values())
            result.mandatory_additions = [
                "🚨 हमने आपकी तकलीफ़ समझी है। आप अकेले नहीं हैं।",
                f"📞 {_HELPLINES['kisan_helpline']}",
                f"📞 {_HELPLINES['kvk_helpline']}",
                f"📞 {_HELPLINES['mental_health']}",
                "कृपया अभी इन नंबरों पर कॉल करें — ये निःशुल्क और गोपनीय हैं।",
            ]
            return result  # STOP — do not run further checks

    # ── Layer 2: BANNED PESTICIDE CHECK ──────────────────────────────────
    for pesticide in _BANNED_PESTICIDES:
        if pesticide in text_lower:
            result.passed = False
            result.flags.append(f"BANNED_PESTICIDE: {pesticide}")
            result.mandatory_additions.append(
                f"⚠️ WARNING: '{pesticide}' is BANNED in India. "
                "Do NOT use it. Ask your KVK for safe alternatives."
            )

    # ── Layer 3: MSP CHECK ───────────────────────────────────────────────
    mandi_resp = agent_responses.get("mandi_agent")
    if mandi_resp:
        # Support both AgentMessage objects and raw dicts
        out = mandi_resp if isinstance(mandi_resp, dict) else getattr(mandi_resp, "output_data", {})
        crop = out.get("crop", "").lower()
        best_price = out.get("best_price_per_quintal", 0)
        msp = _MSP_TABLE.get(crop, 0)

        if msp and best_price and best_price < msp:
            result.flags.append(f"BELOW_MSP: {crop} price ₹{best_price} < MSP ₹{msp}")
            result.mandatory_additions.append(
                f"⚠️ ध्यान दें: {crop} का बाज़ार भाव (₹{best_price}/क्विंटल) MSP "
                f"(₹{msp}/क्विंटल) से कम है। आपको MSP पर बेचने का कानूनी अधिकार "
                "है — अपने निकटतम APMC मंडी या eNAM पोर्टल पर संपर्क करें।"
            )

    # ── Layer 4: FERTILISER OVER-DOSE CHECK ──────────────────────────────
    urea_matches = re.findall(r"(\d+)\s*(?:kg|kilogram).*?urea.*?(?:per\s*)?acre", text_lower)
    if not urea_matches:
        urea_matches = re.findall(r"urea.*?(\d+)\s*(?:kg|kilogram).*?(?:per\s*)?acre", text_lower)

    for match in urea_matches:
        qty = int(match)
        if qty > 120:
            result.passed = False
            result.flags.append(f"UREA_OVERDOSE: {qty}kg/acre recommended (max 120)")
            result.mandatory_additions.append(
                f"⚠️ CORRECTION: {qty} kg/acre urea is EXCESSIVE and harms soil. "
                "Maximum safe limit is 120 kg/acre. Use soil-test-based recommendation."
            )

    # ── Layer 5: FINANCIAL / PREDATORY LENDING CHECK ─────────────────────
    interest_matches = re.findall(r"(\d+(?:\.\d+)?)\s*%\s*(?:p\.?a\.?|per\s*annum|interest|rate)", text_lower)
    for match in interest_matches:
        rate = float(match)
        if rate > 18:
            result.passed = False
            result.flags.append(f"HIGH_INTEREST: {rate}% detected")
            result.mandatory_additions.append(
                f"⚠️ WARNING: {rate}% interest rate is predatory. "
                "Use Kisan Credit Card (4% p.a.) or NABARD-linked loans (7-9% p.a.) instead. "
                "Apply at your nearest bank branch or CSC centre."
            )

    return result

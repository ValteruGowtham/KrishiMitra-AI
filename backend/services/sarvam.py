"""
KrishiMitra AI — Sarvam AI service client.
Wraps three Sarvam APIs: STT (saarika:v1), TTS (bulbul:v1), Translate (mayura:v1).
All 10 major Indian languages supported.
"""

from __future__ import annotations

import base64
import os
from typing import Optional

import httpx
from dotenv import load_dotenv

load_dotenv()

SARVAM_BASE = "https://api.sarvam.ai"
_API_KEY = os.getenv("SARVAM_API_KEY", "")

SUPPORTED_LANGUAGES: dict[str, str] = {
    "hi-IN": "हिंदी (Hindi)",
    "bn-IN": "বাংলা (Bengali)",
    "te-IN": "తెలుగు (Telugu)",
    "mr-IN": "मराठी (Marathi)",
    "ta-IN": "தமிழ் (Tamil)",
    "gu-IN": "ગુજરાતી (Gujarati)",
    "kn-IN": "ಕನ್ನಡ (Kannada)",
    "od-IN": "ଓଡ଼ିଆ (Odia)",
    "pa-IN": "ਪੰਜਾਬੀ (Punjabi)",
    "ml-IN": "മലയാളം (Malayalam)",
    "en-IN": "English (India)",
}

# Best available speaker voice per language (Sarvam bulbul:v1 speaker IDs)
_TTS_SPEAKERS: dict[str, str] = {
    "hi-IN": "meera",
    "bn-IN": "meera",
    "te-IN": "meera",
    "mr-IN": "meera",
    "ta-IN": "meera",
    "gu-IN": "meera",
    "kn-IN": "meera",
    "od-IN": "meera",
    "pa-IN": "meera",
    "ml-IN": "meera",
    "en-IN": "meera",
}


async def transcribe_audio(
    audio_bytes: bytes,
    language_code: str = "hi-IN",
    filename: str = "audio.webm",
) -> dict:
    """
    Convert audio bytes to text using Sarvam saarika:v1.

    Args:
        audio_bytes: Raw audio file bytes (WebM, WAV, MP3, OGG supported).
        language_code: BCP-47 language code from SUPPORTED_LANGUAGES keys.
        filename: Original filename — used to set MIME type hint.

    Returns:
        dict with keys:
          - transcript (str): Recognised text.
          - language_code (str): Language that was used.
          - error (str | None): Error message if failed.
    """
    if not _API_KEY:
        return {"transcript": "", "language_code": language_code, "error": "SARVAM_API_KEY not configured"}

    if language_code not in SUPPORTED_LANGUAGES:
        language_code = "hi-IN"

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{SARVAM_BASE}/speech-to-text",
                headers={"api-subscription-key": _API_KEY},
                files={"file": (filename, audio_bytes, _mime_from_filename(filename))},
                data={"language_code": language_code, "model": "saarika:v1"},
            )
            response.raise_for_status()
            data = response.json()
            return {
                "transcript": data.get("transcript", ""),
                "language_code": language_code,
                "error": None,
            }
    except httpx.HTTPStatusError as e:
        return {"transcript": "", "language_code": language_code, "error": f"Sarvam STT HTTP {e.response.status_code}: {e.response.text[:200]}"}
    except Exception as e:
        return {"transcript": "", "language_code": language_code, "error": str(e)}


async def synthesise_speech(
    text: str,
    language_code: str = "hi-IN",
) -> dict:
    """
    Convert text to speech audio using Sarvam bulbul:v1.

    Args:
        text: The advisory text to speak (max ~500 chars recommended per call).
        language_code: BCP-47 language code.

    Returns:
        dict with keys:
          - audio_base64 (str): Base64-encoded WAV audio.
          - language_code (str): Language used.
          - error (str | None): Error message if failed.
    """
    if not _API_KEY:
        return {"audio_base64": "", "language_code": language_code, "error": "SARVAM_API_KEY not configured"}

    if language_code not in SUPPORTED_LANGUAGES:
        language_code = "hi-IN"

    # Truncate to avoid token limits on very long advisories
    text = text[:500].strip()

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{SARVAM_BASE}/text-to-speech",
                headers={
                    "api-subscription-key": _API_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "inputs": [text],
                    "target_language_code": language_code,
                    "speaker": _TTS_SPEAKERS.get(language_code, "meera"),
                    "model": "bulbul:v1",
                    "enable_preprocessing": True,
                },
            )
            response.raise_for_status()
            data = response.json()
            audios = data.get("audios", [])
            return {
                "audio_base64": audios[0] if audios else "",
                "language_code": language_code,
                "error": None,
            }
    except httpx.HTTPStatusError as e:
        return {"audio_base64": "", "language_code": language_code, "error": f"Sarvam TTS HTTP {e.response.status_code}: {e.response.text[:200]}"}
    except Exception as e:
        return {"audio_base64": "", "language_code": language_code, "error": str(e)}


async def translate_text(
    text: str,
    source_language_code: str,
    target_language_code: str = "en-IN",
) -> dict:
    """
    Translate text between Indian languages using Sarvam mayura:v1.
    Useful for fallback when LLM struggles with a specific script.

    Returns:
        dict with keys:
          - translated_text (str)
          - error (str | None)
    """
    if not _API_KEY:
        return {"translated_text": text, "error": "SARVAM_API_KEY not configured"}

    if source_language_code == target_language_code:
        return {"translated_text": text, "error": None}

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                f"{SARVAM_BASE}/translate",
                headers={
                    "api-subscription-key": _API_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "input": text,
                    "source_language_code": source_language_code,
                    "target_language_code": target_language_code,
                    "model": "mayura:v1",
                    "enable_preprocessing": True,
                },
            )
            response.raise_for_status()
            data = response.json()
            return {"translated_text": data.get("translated_text", text), "error": None}
    except Exception as e:
        return {"translated_text": text, "error": str(e)}


def _mime_from_filename(filename: str) -> str:
    ext = filename.rsplit(".", 1)[-1].lower()
    return {
        "webm": "audio/webm",
        "wav": "audio/wav",
        "mp3": "audio/mpeg",
        "ogg": "audio/ogg",
        "m4a": "audio/mp4",
    }.get(ext, "audio/webm")

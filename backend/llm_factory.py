"""
KrishiMitra AI — LLM factory.
Centralises model instantiation so each agent picks its provider
without importing keys or model strings directly.
"""

from __future__ import annotations
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()


def get_openai_llm(temperature: float = 0.1, model: str | None = None) -> ChatOpenAI:
    """
    Returns an OpenAI LLM instance.
    Default: gpt-4o-mini (low-cost, fast)
    Options: gpt-3.5-turbo (cheapest), gpt-4o-mini (recommended), gpt-4o (expensive)
    
    Args:
        temperature: Model temperature (0.0-1.0)
        model: Model name. If None, uses OPENAI_MODEL env var or defaults to gpt-4o-mini
    """
    api_key = os.getenv("OPENAI_API_KEY", "")
    model_name = model or os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    
    # Validate API key format
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set in .env file")
    if not api_key.startswith("sk-"):
        raise ValueError(
            f"Invalid OpenAI API key format. Key should start with 'sk-'. "
            f"Current key starts with: '{api_key[:8]}...'. "
            "Please use a valid OpenAI API key (get one at https://platform.openai.com/api-keys)"
        )
    
    return ChatOpenAI(
        model=model_name,
        temperature=temperature,
        api_key=api_key,
        base_url=None,  # Use official OpenAI endpoint
    )


def get_gemini_pro_llm(temperature: float = 0.1) -> ChatGoogleGenerativeAI:
    """
    Returns a Gemini Pro instance.
    Used for: crop advisory, farm finance, mandi market analysis.
    """
    return ChatGoogleGenerativeAI(
        model="gemini-pro",
        temperature=temperature,
        google_api_key=os.getenv("GEMINI_API_KEY"),
        convert_system_message_to_human=True,
    )


def get_gemini_flash_llm(temperature: float = 0.1) -> ChatGoogleGenerativeAI:
    """
    Returns a Gemini Flash instance.
    Used for: weather translation, scheme Hindi summary — fast, low-cost tasks.
    """
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash-latest",
        temperature=temperature,
        google_api_key=os.getenv("GEMINI_API_KEY"),
        convert_system_message_to_human=True,
    )

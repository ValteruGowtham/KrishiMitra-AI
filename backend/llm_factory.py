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


def get_openai_llm(temperature: float = 0.1) -> ChatOpenAI:
    """
    Returns a GPT-4o instance (OpenAI).
    Reserved for: vision tasks, soil intelligence, final synthesis.
    """
    return ChatOpenAI(
        model="gpt-4o",
        temperature=temperature,
        api_key=os.getenv("OPENAI_API_KEY"),
    )


def get_gemini_pro_llm(temperature: float = 0.1) -> ChatGoogleGenerativeAI:
    """
    Returns a Gemini 1.5 Pro instance.
    Used for: crop advisory, farm finance, mandi market analysis.
    """
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        temperature=temperature,
        google_api_key=os.getenv("GEMINI_API_KEY"),
        convert_system_message_to_human=True,
    )


def get_gemini_flash_llm(temperature: float = 0.1) -> ChatGoogleGenerativeAI:
    """
    Returns a Gemini 1.5 Flash instance.
    Used for: weather translation, scheme Hindi summary — fast, low-cost tasks.
    """
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=temperature,
        google_api_key=os.getenv("GEMINI_API_KEY"),
        convert_system_message_to_human=True,
    )

"""
KrishiMitra AI — Abstract base class for all specialised agents.
"""

from __future__ import annotations

import os
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

from backend.schemas import AgentMessage, FarmerProfile, FarmerQuery

load_dotenv()


class BaseKrishiAgent(ABC):
    """
    Every KrishiMitra agent inherits from this base.

    Provides:
    - A shared ChatOpenAI (GPT-4o) LLM instance.
    - A helper to construct a standardised AgentMessage.
    - An abstract ``run`` method that subclasses must implement.
    """

    AGENT_ID: str = "base_agent"

    def __init__(self) -> None:
        self.llm = ChatOpenAI(
            model="gpt-4o",
            temperature=0.1,
            api_key=os.getenv("OPENAI_API_KEY"),
        )

    # ------------------------------------------------------------------
    # Abstract interface
    # ------------------------------------------------------------------

    @abstractmethod
    async def run(
        self,
        query: FarmerQuery,
        farmer: FarmerProfile,
        context: Dict[str, Any] | None = None,
    ) -> AgentMessage:
        """Execute the agent's specialised task and return an AgentMessage."""
        ...

    # ------------------------------------------------------------------
    # Helper
    # ------------------------------------------------------------------

    def _build_message(
        self,
        query_id: str,
        output_data: Dict[str, Any],
        confidence: float = 0.8,
        data_sources: List[str] | None = None,
        reasoning_chain: List[str] | None = None,
        compliance_flags: List[str] | None = None,
        fallback_triggered: bool = False,
        error: Optional[str] = None,
    ) -> AgentMessage:
        """Construct a standardised AgentMessage envelope."""
        return AgentMessage(
            agent_id=self.AGENT_ID,
            query_id=query_id,
            output_data=output_data,
            confidence_score=confidence,
            data_sources=data_sources or [],
            reasoning_chain=reasoning_chain or [],
            compliance_flags=compliance_flags or [],
            fallback_triggered=fallback_triggered,
            error=error,
        )

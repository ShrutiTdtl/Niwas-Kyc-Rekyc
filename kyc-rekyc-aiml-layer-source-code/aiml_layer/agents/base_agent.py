from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseAgent(ABC):
    name: str = "base_agent"

    @abstractmethod
    def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError

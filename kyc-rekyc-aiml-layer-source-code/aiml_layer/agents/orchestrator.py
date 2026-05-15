from __future__ import annotations
from typing import Any, Dict
from aiml_layer.agents.kyc_agents import DocumentIntakeAgent, DocumentUnderstandingAgent, IdentityVerificationAgent, RiskScoringAgent, FraudDetectionAgent, ComplianceAuditAgent

class AgenticKYCOrchestrator:
    def __init__(self):
        self.pipeline = [DocumentIntakeAgent(), DocumentUnderstandingAgent(), IdentityVerificationAgent(), RiskScoringAgent(), FraudDetectionAgent(), ComplianceAuditAgent()]

    def run(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        context = dict(payload)
        context.setdefault("profile", {})
        context["profile"].setdefault("customer_id", payload.get("customer_id", "CUST-DEMO-001"))
        context["profile"].setdefault("name", payload.get("name", "Amit Andre"))
        for agent in self.pipeline:
            context = agent.run(context)
        return context

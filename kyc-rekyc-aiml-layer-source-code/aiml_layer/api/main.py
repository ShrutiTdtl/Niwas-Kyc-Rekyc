from __future__ import annotations
from fastapi import FastAPI
from aiml_layer.models.schemas import DocumentExtractionRequest, KYCProfile
from aiml_layer.services.ocr_service import OCRExtractionService
from aiml_layer.services.risk_service import RiskScoringService
from aiml_layer.services.fraud_service import FraudDetectionService
from aiml_layer.agents.orchestrator import AgenticKYCOrchestrator

app = FastAPI(title="Agentic AI KYC/Re-KYC AIML Service", version="1.0.0")
ocr_service = OCRExtractionService()
risk_service = RiskScoringService()
fraud_service = FraudDetectionService()
orchestrator = AgenticKYCOrchestrator()

@app.get("/health")
def health():
    return {"status": "ok", "service": "kyc-rekyc-aiml-layer"}

@app.post("/ai/ocr/extract")
def extract_document(req: DocumentExtractionRequest):
    return ocr_service.extract(req)

@app.post("/ai/risk/score")
def risk_score(profile: KYCProfile):
    return risk_service.score(profile)

@app.post("/ai/fraud/detect")
def fraud_detect(profile: KYCProfile):
    return fraud_service.detect(profile)

@app.post("/ai/agents/kyc-evaluate")
def agentic_kyc_evaluate(payload: dict):
    return orchestrator.run(payload)

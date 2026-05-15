from __future__ import annotations
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

class DocumentExtractionRequest(BaseModel):
    document_type: str = Field(..., examples=["PAN", "AADHAAR", "PASSPORT"])
    file_name: Optional[str] = None
    raw_text: Optional[str] = None
    image_base64: Optional[str] = None

class ExtractedField(BaseModel):
    field: str
    value: Any
    confidence: float

class DocumentExtractionResponse(BaseModel):
    document_type: str
    extracted_fields: List[ExtractedField]
    confidence: float
    quality_flags: List[str] = []

class KYCProfile(BaseModel):
    customer_id: str
    name: str
    dob: Optional[str] = None
    pan: Optional[str] = None
    aadhaar_last4: Optional[str] = None
    address: Optional[str] = None
    age: int = 35
    monthly_income: float = 50000
    loan_amount: float = 2500000
    document_mismatch_count: int = 0
    sanctions_hit: int = 0
    pep_hit: int = 0
    adverse_media_hit: int = 0
    geo_distance_km: float = 0
    rekyc_overdue_days: int = 0
    documents: List[Dict[str, Any]] = []

class RiskScoreResponse(BaseModel):
    customer_id: str
    risk_score: float
    risk_label: str
    drivers: List[str]
    edd_required: bool

class FraudScoreResponse(BaseModel):
    customer_id: str
    fraud_score: float
    fraud_label: str
    anomaly_signals: List[str]

class AgentDecision(BaseModel):
    customer_id: str
    recommended_action: str
    next_workflow_stage: str
    required_tasks: List[str]
    risk: RiskScoreResponse
    fraud: FraudScoreResponse
    audit_summary: str

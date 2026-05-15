from aiml_layer.services.ocr_service import OCRExtractionService
from aiml_layer.services.risk_service import RiskScoringService
from aiml_layer.services.fraud_service import FraudDetectionService
from aiml_layer.models.schemas import DocumentExtractionRequest, KYCProfile


def test_ocr_extracts_pan():
    resp = OCRExtractionService().extract(DocumentExtractionRequest(document_type="PAN", raw_text="Name AMIT ANDRE PAN AABCA1234F DOB 12/08/1980"))
    assert any(f.field == "pan" for f in resp.extracted_fields)


def test_risk_and_fraud_score():
    profile = KYCProfile(customer_id="C1", name="Amit Andre", sanctions_hit=1, document_mismatch_count=2)
    assert RiskScoringService().score(profile).risk_score >= 0
    assert FraudDetectionService().detect(profile).fraud_score >= 0

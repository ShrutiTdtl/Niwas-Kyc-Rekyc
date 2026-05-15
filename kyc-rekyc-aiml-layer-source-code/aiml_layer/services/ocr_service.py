from __future__ import annotations
import re
from typing import List
from rapidfuzz import fuzz
from aiml_layer.models.schemas import DocumentExtractionRequest, DocumentExtractionResponse, ExtractedField

PAN_RE = re.compile(r"[A-Z]{5}[0-9]{4}[A-Z]")
AADHAAR_RE = re.compile(r"(?:\d{4}\s?){3}")
DOB_RE = re.compile(r"\b(?:\d{2}[/-]\d{2}[/-]\d{4}|\d{4}-\d{2}-\d{2})\b")

SAMPLE_TEXT = {
    "PAN": "INCOME TAX DEPARTMENT GOVT OF INDIA Name AMIT ANDRE Permanent Account Number AABCA1234F DOB 12/08/1980",
    "AADHAAR": "Government of India Amit Andre DOB 12/08/1980 Aadhaar Number 1234 5678 9012 Address Pune Maharashtra",
    "PASSPORT": "Republic of India Passport Name AMIT ANDRE Date of Birth 12/08/1980 Passport No Z1234567 Address Pune",
}

def _name_guess(text: str) -> str:
    known = ["AMIT ANDRE", "RAHUL SHARMA", "PRIYA PATIL", "SANA KHAN"]
    best = max(known, key=lambda n: fuzz.partial_ratio(n, text.upper()))
    return best.title() if fuzz.partial_ratio(best, text.upper()) > 65 else "Unknown"

class OCRExtractionService:
    def extract(self, req: DocumentExtractionRequest) -> DocumentExtractionResponse:
        text = req.raw_text or SAMPLE_TEXT.get(req.document_type.upper(), "")
        fields: List[ExtractedField] = []
        pan = PAN_RE.search(text.upper())
        aadhaar = AADHAAR_RE.search(text)
        dob = DOB_RE.search(text)
        name = _name_guess(text)
        if name != "Unknown": fields.append(ExtractedField(field="name", value=name, confidence=0.88))
        if pan: fields.append(ExtractedField(field="pan", value=pan.group(0), confidence=0.94))
        if aadhaar: fields.append(ExtractedField(field="aadhaar_last4", value=aadhaar.group(0).replace(" ", "")[-4:], confidence=0.92))
        if dob: fields.append(ExtractedField(field="dob", value=dob.group(0), confidence=0.90))
        quality_flags = []
        if len(text) < 25: quality_flags.append("LOW_TEXT_DENSITY")
        if not fields: quality_flags.append("NO_KYC_FIELDS_DETECTED")
        confidence = round(sum(f.confidence for f in fields) / max(len(fields), 1), 3)
        return DocumentExtractionResponse(document_type=req.document_type, extracted_fields=fields, confidence=confidence, quality_flags=quality_flags)

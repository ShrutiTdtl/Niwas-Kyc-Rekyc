"""Adapter helpers for integrating this AIML layer with the Django backend.
Place these calls inside Django services/views after document upload, customer save, or workflow transition.
"""
from __future__ import annotations
import os, requests

AIML_BASE_URL = os.getenv("AIML_BASE_URL", "http://localhost:8010")

def evaluate_kyc_case(case_payload: dict) -> dict:
    resp = requests.post(f"{AIML_BASE_URL}/ai/agents/kyc-evaluate", json=case_payload, timeout=30)
    resp.raise_for_status()
    return resp.json()

def score_customer_risk(profile_payload: dict) -> dict:
    resp = requests.post(f"{AIML_BASE_URL}/ai/risk/score", json=profile_payload, timeout=20)
    resp.raise_for_status()
    return resp.json()

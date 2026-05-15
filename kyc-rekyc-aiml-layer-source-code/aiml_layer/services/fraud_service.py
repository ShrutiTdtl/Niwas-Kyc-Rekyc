from __future__ import annotations
import os, joblib
import numpy as np
from sklearn.ensemble import IsolationForest
from aiml_layer.models.schemas import KYCProfile, FraudScoreResponse
from aiml_layer.services.risk_service import FEATURES

class FraudDetectionService:
    def __init__(self, model_path: str = "artifacts/fraud_model.joblib"):
        self.model_path = model_path
        self.model = joblib.load(model_path) if os.path.exists(model_path) else self._fallback_model()

    def _fallback_model(self):
        rng = np.random.default_rng(11)
        x = rng.normal(size=(1000, len(FEATURES)))
        return IsolationForest(contamination=0.08, random_state=42).fit(x)

    def _vector(self, p: KYCProfile):
        return np.array([[getattr(p, f) for f in FEATURES]], dtype=float)

    def detect(self, profile: KYCProfile) -> FraudScoreResponse:
        x = self._vector(profile)
        raw = float(-self.model.decision_function(x)[0])
        score = max(0.0, min(100.0, (raw + 0.25) * 180))
        signals = []
        if profile.document_mismatch_count >= 2: signals.append("Multiple document mismatches")
        if profile.geo_distance_km > 75: signals.append("Address geolocation deviation")
        if profile.monthly_income < 25000 and profile.loan_amount > 5000000: signals.append("Income-loan inconsistency")
        if profile.sanctions_hit or profile.pep_hit: signals.append("Watchlist exposure")
        if not signals: signals.append("No strong anomaly pattern")
        label = "SUSPECT" if score >= 70 else "REVIEW" if score >= 45 else "NORMAL"
        return FraudScoreResponse(customer_id=profile.customer_id, fraud_score=round(score, 2), fraud_label=label, anomaly_signals=signals)

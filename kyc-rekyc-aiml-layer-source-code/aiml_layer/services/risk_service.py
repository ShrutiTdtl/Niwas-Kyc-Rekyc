from __future__ import annotations
import os, joblib
from typing import List
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from aiml_layer.models.schemas import KYCProfile, RiskScoreResponse

FEATURES = ["age","monthly_income","loan_amount","document_mismatch_count","sanctions_hit","pep_hit","adverse_media_hit","geo_distance_km","rekyc_overdue_days"]

class RiskScoringService:
    def __init__(self, model_path: str = "artifacts/risk_model.joblib"):
        self.model_path = model_path
        self.model = joblib.load(model_path) if os.path.exists(model_path) else self._fallback_model()

    def _fallback_model(self):
        rng = np.random.default_rng(7)
        x = rng.normal(size=(800, len(FEATURES)))
        # synthetic labels: 0 low, 1 medium, 2 high, 3 critical
        score = 0.4*x[:,2] + 1.7*(x[:,3] > .8) + 2.2*(x[:,4] > .9) + 2.0*(x[:,5] > .9) + 1.5*(x[:,6] > .9) + .8*(x[:,8] > .7)
        y = np.digitize(score, [0.5, 1.5, 2.7])
        model = RandomForestClassifier(n_estimators=120, random_state=42, class_weight="balanced")
        model.fit(x, y)
        return model

    def _vector(self, p: KYCProfile):
        return np.array([[getattr(p, f) for f in FEATURES]], dtype=float)

    def score(self, profile: KYCProfile) -> RiskScoreResponse:
        x = self._vector(profile)
        proba = self.model.predict_proba(x)[0] if hasattr(self.model, "predict_proba") else [0.7, .2, .08, .02]
        weighted = float(sum(i * p for i, p in enumerate(proba)) / 3.0)
        labels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
        label = labels[int(np.argmax(proba))]
        drivers: List[str] = []
        if profile.document_mismatch_count: drivers.append("Cross-document mismatch detected")
        if profile.sanctions_hit: drivers.append("Sanctions-list match")
        if profile.pep_hit: drivers.append("PEP exposure")
        if profile.adverse_media_hit: drivers.append("Adverse-media signal")
        if profile.rekyc_overdue_days > 0: drivers.append("Re-KYC overdue")
        if profile.loan_amount > 5_000_000: drivers.append("High loan exposure")
        if not drivers: drivers.append("No major risk signal found")
        return RiskScoreResponse(customer_id=profile.customer_id, risk_score=round(weighted * 100, 2), risk_label=label, drivers=drivers, edd_required=label in ["HIGH", "CRITICAL"])

from __future__ import annotations
import os, random
import numpy as np
import pandas as pd

NAMES = ["Amit Andre", "Rahul Sharma", "Priya Patil", "Sana Khan", "Vikram Rao", "Neha Kulkarni"]

def build(n: int = 10000, seed: int = 42):
    rng = np.random.default_rng(seed)
    rows = []
    for i in range(n):
        sanctions = int(rng.random() < 0.015)
        pep = int(rng.random() < 0.025)
        adverse = int(rng.random() < 0.04)
        mismatch = int(rng.poisson(0.25) + (rng.random() < 0.03))
        overdue = max(0, int(rng.normal(20, 60))) if rng.random() < 0.20 else 0
        income = float(max(12000, rng.normal(85000, 55000)))
        loan = float(max(300000, rng.normal(3200000, 1800000)))
        geo = float(max(0, rng.exponential(18)))
        risk_points = mismatch*12 + sanctions*40 + pep*30 + adverse*20 + (overdue>0)*10 + (loan/income > 80)*10 + (geo>75)*10
        label = "CRITICAL" if risk_points >= 55 else "HIGH" if risk_points >= 35 else "MEDIUM" if risk_points >= 15 else "LOW"
        rows.append({
            "customer_id": f"CUST-{i+1:06d}", "name": random.choice(NAMES), "age": int(rng.integers(22, 72)),
            "monthly_income": round(income, 2), "loan_amount": round(loan, 2), "document_mismatch_count": mismatch,
            "sanctions_hit": sanctions, "pep_hit": pep, "adverse_media_hit": adverse, "geo_distance_km": round(geo, 2),
            "rekyc_overdue_days": overdue, "risk_label": label
        })
    return pd.DataFrame(rows)

if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)
    df = build(int(os.getenv("N_ROWS", "100000")))
    df.to_csv("data/synthetic_kyc_100k.csv", index=False)
    print(df.head())
    print("saved data/synthetic_kyc_100k.csv", len(df))

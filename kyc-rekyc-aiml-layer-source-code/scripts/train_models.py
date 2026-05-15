from __future__ import annotations
import os, joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

FEATURES = ["age","monthly_income","loan_amount","document_mismatch_count","sanctions_hit","pep_hit","adverse_media_hit","geo_distance_km","rekyc_overdue_days"]
LABEL_MAP = {"LOW":0,"MEDIUM":1,"HIGH":2,"CRITICAL":3}

if __name__ == "__main__":
    data_path = os.getenv("DATA_PATH", "data/synthetic_kyc_100k.csv")
    if not os.path.exists(data_path):
        import subprocess, sys
        subprocess.check_call([sys.executable, "scripts/generate_synthetic_kyc_data.py"])
    df = pd.read_csv(data_path)
    X = df[FEATURES]
    y = df["risk_label"].map(LABEL_MAP)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=.2, stratify=y, random_state=42)
    risk = RandomForestClassifier(n_estimators=200, random_state=42, class_weight="balanced", max_depth=10)
    risk.fit(X_train, y_train)
    print(classification_report(y_test, risk.predict(X_test)))
    fraud = IsolationForest(contamination=0.08, random_state=42)
    fraud.fit(X_train)
    os.makedirs("artifacts", exist_ok=True)
    joblib.dump(risk, "artifacts/risk_model.joblib")
    joblib.dump(fraud, "artifacts/fraud_model.joblib")
    print("saved artifacts/risk_model.joblib and artifacts/fraud_model.joblib")

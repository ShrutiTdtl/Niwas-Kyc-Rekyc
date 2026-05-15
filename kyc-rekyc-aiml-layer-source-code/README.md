# Agentic AI KYC/Re-KYC AIML Layer

This package provides the AIML layer for the Agentic AI-Based KYC/Re-KYC Automation Platform for Housing Finance.

It is designed to integrate with the existing React UI and Django backend PoC through REST APIs.

## Capabilities

- OCR/document extraction baseline for PAN, Aadhaar, Passport and other KYC documents
- Document understanding and cross-document consistency checks
- Identity verification decision support: PAN/Aadhaar flags, liveness and face-match placeholders
- AML/risk scoring model with Low/Medium/High/Critical classification
- Fraud anomaly detection model using Isolation Forest
- Agentic KYC orchestration pipeline
- Compliance and maker-checker decision recommendations
- Django integration adapter
- Jupyter notebooks for training, testing and demonstration
- Synthetic 1 lakh record generator for PoC training/demo

## Project Structure

```text
aiml_layer/
  agents/          Agentic AI orchestration classes
  api/             FastAPI REST service
  models/          Pydantic schemas
  services/        OCR, risk, fraud, Django adapter services
  utils/           Utility helpers
notebooks/         Jupyter notebooks for AIML development
scripts/           Synthetic data and model training scripts
data/              Sample payloads and generated demo datasets
configs/           Model/agent configuration
artifacts/         Trained model files generated locally
```

## Setup

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env
```

## Generate 1 Lakh Synthetic KYC Records

```bash
python scripts/generate_synthetic_kyc_data.py
```

## Train Models

```bash
python scripts/train_models.py
```

This creates:

```text
artifacts/risk_model.joblib
artifacts/fraud_model.joblib
```

## Run AIML API Service

```bash
python run_service.py
```

Open API docs:

```text
http://localhost:8010/docs
```

## Key Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /health` | Health check |
| `POST /ai/ocr/extract` | Extract KYC fields from document text/image payload |
| `POST /ai/risk/score` | Score AML/KYC customer risk |
| `POST /ai/fraud/detect` | Detect anomaly/fraud indicators |
| `POST /ai/agents/kyc-evaluate` | Run complete agentic KYC pipeline |

## Sample Agentic Evaluation

```bash
curl -X POST http://localhost:8010/ai/agents/kyc-evaluate \
  -H "Content-Type: application/json" \
  -d @data/sample_agent_payload.json
```

## Django Backend Integration

Use `aiml_layer/services/django_adapter.py` from your Django backend service layer.

Example:

```python
from aiml_layer.services.django_adapter import evaluate_kyc_case

result = evaluate_kyc_case(case_payload)
# Save result['risk'], result['fraud'], result['agent_decision'] into Django DB.
```

Recommended Django workflow hooks:

1. After document upload: call `/ai/ocr/extract`
2. After customer profile completion: call `/ai/agents/kyc-evaluate`
3. On maker-checker submit: persist `agent_decision`, `risk`, `fraud`, and audit trail
4. On dashboard refresh: expose latest AI scores via existing Django APIs

## PoC Note

External APIs such as Aadhaar, PAN, CKYC, DigiLocker, sanctions, PEP, adverse media and face-liveness providers are represented through mockable interfaces/placeholders in this package. For production, replace the mock services with licensed/approved provider integrations and add model governance, consent, data-retention and audit controls.

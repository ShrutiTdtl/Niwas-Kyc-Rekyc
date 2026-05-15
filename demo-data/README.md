# KYC / Re-KYC Synthetic Dataset Package

This package contains a complete synthetic demonstration dataset for the Agentic AI-Based KYC / Re-KYC Automation Platform for Housing Finance.

## Files
- `kyc_cases_100000.csv` — primary 1 lakh KYC/Re-KYC case dataset.
- `kyc_documents_sample.csv` — document OCR, verification and deficiency dataset.
- `workflow_events_sample.csv` — workflow, maker-checker and stage transition events.
- `audit_logs_sample.csv` — tamper-evident regulatory audit trail sample.
- `communications_sample.csv` — SMS, email, WhatsApp, IVR and in-app notification logs.
- `field_verification_sample.csv` — geo-tagged field verification dataset.
- `data_dictionary.csv` — field-level data dictionary.
- `dataset_summary.json` — row counts and package metadata.

## Integration Notes
Use `case_id` as the main join key across all files.
Use `customer_id` to build a customer 360 view.
Use risk, fraud, OCR, workflow, audit and communication fields to demonstrate AI dashboards and end-to-end automation.

## Privacy
This dataset is fully synthetic and contains no real customer information.

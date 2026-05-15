import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { v4 as uuid } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json({limit:'10mb'}));
app.use(morgan('dev'));

const cases = [
  { id: 'KYC-24001', customer: 'Rohan Mehta', status: 'Checker Review', risk: 'Low' },
  { id: 'KYC-24002', customer: 'Sara Khan', status: 'Document Deficiency', risk: 'Medium' },
  { id: 'KYC-24003', customer: 'Vikram Iyer', status: 'EDD Required', risk: 'High' }
];

app.get('/api/health', (_, res) => res.json({ ok: true, service: 'agentic-kyc-ui-mock-api' }));
app.get('/api/cases', (_, res) => res.json(cases));
app.post('/api/onboarding', (req, res) => {
  const record = { id: `KYC-${uuid().slice(0,8).toUpperCase()}`, status: 'AI KYC Started', risk: 'Pending', ...req.body };
  cases.unshift(record);
  res.status(201).json(record);
});
app.post('/api/ocr/simulate', (req, res) => res.json({ confidence: 94.2, fields: { name: 'Sample Customer', pan: 'ABCDE1234F', dob: '1990-04-12', addressMatch: true }, documentType: req.body.documentType || 'PAN' }));
app.post('/api/risk/score', (req, res) => {
  const score = Math.floor(30 + Math.random()*65);
  res.json({ score, grade: score > 80 ? 'High' : score > 55 ? 'Medium' : 'Low', explainability: ['Document consistency', 'PEP/sanctions screening', 'Geo-risk', 'Duplicate identity signals'] });
});
app.post('/api/workflow/action', (req, res) => res.json({ actionId: uuid(), status: 'accepted', nextStep: 'Checker Approval', payload: req.body }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Mock API running on ${PORT}`));

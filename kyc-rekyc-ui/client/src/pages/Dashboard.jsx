import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, LineChart, Line, CartesianGrid } from 'recharts';
import { kpiCards, monthlyTrend, riskDistribution, cases } from '../data/mockData.js';
import { Badge, Card, PageTitle } from '../components/UI.jsx';
export default function Dashboard({role}) { return <>
  <PageTitle title="CXO & Operations Command Center" subtitle={`Live view personalized for ${role}: KYC completion, compliance, risk, fraud and operational SLA.`}/>
  <div className="kpi-grid">{kpiCards.map(k => <Card key={k.label}><span className="muted">{k.label}</span><h3>{k.value}</h3><Badge tone={k.tone}>{k.trend}</Badge></Card>)}</div>
  <div className="grid two">
    <Card><h3>KYC / Re-KYC Throughput</h3><ResponsiveContainer width="100%" height={260}><BarChart data={monthlyTrend}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis/><Tooltip/><Bar dataKey="onboarded"/><Bar dataKey="rekyc"/></BarChart></ResponsiveContainer></Card>
    <Card><h3>Risk Distribution</h3><ResponsiveContainer width="100%" height={260}><PieChart><Pie dataKey="value" data={riskDistribution} outerRadius={92} label /></PieChart></ResponsiveContainer></Card>
  </div>
  <Card><h3>Priority Work Queue</h3><div className="table"><table><thead><tr><th>Case</th><th>Customer</th><th>Stage</th><th>Risk</th><th>Status</th><th>TAT</th></tr></thead><tbody>{cases.map(c => <tr key={c.id}><td>{c.id}</td><td>{c.customer}</td><td>{c.stage}</td><td><Badge tone={c.risk === 'Low' ? 'success' : c.risk === 'Medium' ? 'warning' : 'danger'}>{c.risk}</Badge></td><td>{c.status}</td><td>{c.tat}</td></tr>)}</tbody></table></div></Card>
  <Card><h3>Fraud Trend</h3><ResponsiveContainer width="100%" height={220}><LineChart data={monthlyTrend}><XAxis dataKey="month"/><YAxis/><Tooltip/><Line dataKey="fraud" strokeWidth={3}/></LineChart></ResponsiveContainer></Card>
</>; }

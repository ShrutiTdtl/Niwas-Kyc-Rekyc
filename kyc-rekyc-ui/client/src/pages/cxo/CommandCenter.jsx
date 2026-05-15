import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, PageTitle, Badge, Button } from '../../components/UI';
import { kpiCards, monthlyTrend, riskDistribution } from '../../data/mockData';
import API from '../../api/client';

const COLORS = ['#16a34a', '#d97706', '#dc2626', '#9333ea'];

export default function CommandCenter() {
  const [data, setData] = useState({ kpi: kpiCards, trend: monthlyTrend, risk: riskDistribution });
  const [loading, setLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const res = await API.get('/dashboards/cxo/');
      if (res.data && Object.keys(res.data).length > 0) {
        setData({
          kpi: res.data.kpi || kpiCards,
          trend: res.data.trend || monthlyTrend,
          risk: res.data.risk || riskDistribution
        });
      } else {
        setIsDemo(true);
      }
    } catch (err) {
      console.log("Using mock data for dashboard");
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isDemo && <div style={{ background: '#fef3c7', color: '#92400e', padding: '10px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', borderRadius: '8px', marginBottom: '15px' }}>Using demo data</div>}
      <div className="space" style={{ marginBottom: '20px' }}>
        <PageTitle title="CXO Command Centre" subtitle="Enterprise-wide KYC performance and compliance monitoring" />
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" onClick={refreshData} loading={loading}>Refresh Data</Button>
          <Button onClick={() => alert('Report generated')}>Download Board Report</Button>
        </div>
      </div>

      <div className="kpi-grid">
        {data.kpi.map((kpi, i) => (
          <Card key={i} style={{ padding: '20px' }}>
            <div className="muted" style={{ fontSize: '13px' }}>{kpi.label}</div>
            <h3>{kpi.value}</h3>
            <div className="space">
              <Badge tone={kpi.tone}>{kpi.trend}</Badge>
              <span className="muted" style={{ fontSize: '11px' }}>vs last month</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid two" style={{ marginTop: '20px' }}>
        <Card style={{ padding: '25px', height: '400px' }}>
          <h4>Monthly KYC Throughput</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="onboarded" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Onboarded" />
              <Bar dataKey="rekyc" fill="#93c5fd" radius={[4, 4, 0, 0]} name="Re-KYC" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid">
          <Card style={{ padding: '25px', height: '190px' }}>
            <h4>Risk Distribution</h4>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '150px', height: '150px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.risk} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                      {data.risk.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid" style={{ gap: '8px', flex: 1, marginLeft: '20px' }}>
                {data.risk.map((r, i) => (
                  <div key={i} className="space" style={{ fontSize: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }}></div>
                      <span>{r.name}</span>
                    </div>
                    <b>{r.value}</b>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card style={{ padding: '25px', height: '190px' }}>
            <h4>Fraud Trend (6m)</h4>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={data.trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="fraud" stroke="var(--danger)" strokeWidth={3} dot={{ fill: 'var(--danger)' }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}

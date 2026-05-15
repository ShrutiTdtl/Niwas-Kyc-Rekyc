import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, PageTitle, Badge, Button } from '../../components/UI';
import API from '../../api/client';
import { cases as mockCases } from '../../data/mockData';

export default function CaseQueue() {
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await API.get('/cases/queue/');
      setCases(res.data.length > 0 ? res.data : mockCases);
      if (res.data.length === 0) setIsDemo(true);
    } catch (err) {
      setCases(mockCases);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Case ID', 'Customer', 'Type', 'Risk', 'Status'];
    const rows = cases.map(c => [c.id, c.customer, c.type, c.risk, c.status]);
    let csvContent = headers.join(',') + '\n' + rows.map(e => e.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `case_queue_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const getRiskTone = (risk) => {
    if (risk === 'Low') return 'success';
    if (risk === 'Medium') return 'warning';
    if (risk === 'High') return 'danger';
    if (risk === 'EDD') return 'purple';
    return 'neutral';
  };

  const filteredCases = cases.filter(c => 
    c.id.toLowerCase().includes(search.toLowerCase()) || 
    c.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {isDemo && <div style={{ background: '#fef3c7', color: '#92400e', padding: '10px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', borderRadius: '8px', marginBottom: '15px' }}>Using demo data</div>}
      <PageTitle title="Case Management" subtitle="Manage and process KYC applications from all channels" />

      <div className="card toolbar" style={{ padding: '15px 25px' }}>
        <input 
          type="text" 
          placeholder="Search by Case ID or Customer Name..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select><option>All Risk Levels</option><option>Low</option><option>Medium</option><option>High</option><option>EDD</option></select>
        <select><option>All Stages</option></select>
        <Button onClick={exportCSV} variant="secondary">Export CSV</Button>
        <Button onClick={() => alert('AI Auto-assign triggered')}>Auto-assign</Button>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Customer</th>
                <th>Loan Type</th>
                <th>Segment</th>
                <th>Risk</th>
                <th>Stage</th>
                <th>Owner</th>
                <th>TAT</th>
                <th>Flags</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>Loading cases...</td></tr>
              ) : filteredCases.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 'bold' }}>{c.id}</td>
                  <td>{c.customer}</td>
                  <td>{c.type}</td>
                  <td><Badge>{c.segment}</Badge></td>
                  <td><Badge tone={getRiskTone(c.risk)}>{c.risk}</Badge></td>
                  <td>{c.status}</td>
                  <td>{c.owner}</td>
                  <td style={{ color: c.tat?.includes('h') ? 'var(--warning)' : 'inherit' }}>{c.tat}</td>
                  <td>
                    {c.flags > 0 && <span style={{ background: 'var(--danger)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>{c.flags}</span>}
                  </td>
                  <td>
                    <button className="linkbtn" onClick={() => navigate(`/ops/cases/${c.id}`)}>Open</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

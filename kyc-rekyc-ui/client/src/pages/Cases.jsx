import React, { useMemo, useState } from 'react';
import { cases, agents } from '../data/mockData.js';
import { Badge, Button, Card, PageTitle, Modal } from '../components/UI.jsx';

export default function Cases({ role, showToast }) {
  const [q, setQ] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [assignMode, setAssignMode] = useState(false);
  const [selectedCases, setSelectedCases] = useState(new Set());
  const [assignAgent, setAssignAgent] = useState('');

  const rows = useMemo(() => cases.filter(c => {
    if (role === 'Field Agent' && c.owner !== 'Field Team') return false;
    return JSON.stringify(c).toLowerCase().includes(q.toLowerCase());
  }), [q, role]);

  const handleExport = () => {
    const headers = ['Case ID', 'Customer', 'Loan Type', 'Segment', 'Risk', 'Stage', 'Owner', 'Flags'];
    const csvRows = rows.map(r => [r.id, r.customer, r.type, r.segment, r.risk, r.stage, r.owner, r.flags].join(','));
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'kyc_queue_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Queue exported successfully');
  };

  const handleAssignClick = () => {
    if (assignMode) {
      if (assignAgent && selectedCases.size > 0) {
        showToast(`${selectedCases.size} case(s) assigned to ${assignAgent}`);
      }
      setAssignMode(false);
      setSelectedCases(new Set());
      setAssignAgent('');
    } else {
      setAssignMode(true);
    }
  };

  const toggleCaseSelection = (id) => {
    const newSet = new Set(selectedCases);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedCases(newSet);
  };

  return <>
    <PageTitle title="KYC Case Management" subtitle="Maker-checker queues for new onboarding, Re-KYC, deficiency handling, EDD, CKYC upload and field verification."/>
    <Card>
      <div className="toolbar">
        <input placeholder="Search case/customer/status" value={q} onChange={e=>setQ(e.target.value)}/>
        
        {assignMode && (
          <select value={assignAgent} onChange={e => setAssignAgent(e.target.value)}>
            <option value="">Select Agent...</option>
            {agents.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
          </select>
        )}
        <Button onClick={handleAssignClick}>
          {assignMode ? 'Confirm Assign' : 'Assign Selected'}
        </Button>
        <Button variant="secondary" onClick={handleExport}>Export Queue</Button>
      </div>
      <div className="table">
        <table>
          <thead>
            <tr>
              {assignMode && <th>Select</th>}
              <th>Case ID</th><th>Customer</th><th>Loan Type</th><th>Segment</th><th>Risk</th><th>Stage</th><th>Owner</th><th>Flags</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(c=><tr key={c.id}>
              {assignMode && <td><input type="checkbox" checked={selectedCases.has(c.id)} onChange={() => toggleCaseSelection(c.id)} /></td>}
              <td>{c.id}</td><td>{c.customer}</td><td>{c.type}</td><td>{c.segment}</td><td><Badge tone={c.risk==='Low'?'success':c.risk==='Medium'?'warning':'danger'}>{c.risk}</Badge></td><td>{c.stage}</td><td>{c.owner}</td><td>{c.flags}</td>
              <td><button className="linkbtn" onClick={() => setSelectedCase(c)}>Open</button></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </Card>
    <Card><h3>Case Detail UX Components</h3><div className="feature-grid"><div>360° customer profile</div><div>Document confidence panel</div><div>Cross-document mismatch view</div><div>AML explainability timeline</div><div>Maker-checker decision panel</div><div>CKYC evidence pack</div></div></Card>

    <Modal open={!!selectedCase} onClose={() => setSelectedCase(null)} title={`Case Details: ${selectedCase?.id}`}>
      {selectedCase && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div><strong>Customer:</strong> {selectedCase.customer}</div>
            <div><strong>Loan Type:</strong> {selectedCase.type}</div>
            <div><strong>Segment:</strong> {selectedCase.segment}</div>
            <div><strong>Risk:</strong> <Badge tone={selectedCase.risk==='Low'?'success':selectedCase.risk==='Medium'?'warning':'danger'}>{selectedCase.risk}</Badge></div>
            <div><strong>Status:</strong> {selectedCase.status}</div>
            <div><strong>Stage:</strong> {selectedCase.stage}</div>
            <div><strong>Owner:</strong> {selectedCase.owner}</div>
            <div><strong>TAT:</strong> {selectedCase.tat}</div>
            <div><strong>Flags:</strong> {selectedCase.flags}</div>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '15px' }}>
            {role === 'Maker' && <Button onClick={() => { showToast('Submitted for Review'); setSelectedCase(null); }}>Submit for Review</Button>}
            {role === 'Checker' && (
              <>
                <Button variant="secondary" onClick={() => { showToast('Case Rejected'); setSelectedCase(null); }}>Reject</Button>
                <Button onClick={() => { showToast('Case Approved'); setSelectedCase(null); }}>Approve</Button>
              </>
            )}
            {['CXO', 'Compliance Officer'].includes(role) && (
              <span style={{color: '#666', fontStyle: 'italic', display: 'flex', alignItems: 'center'}}>Read-only view</span>
            )}
          </div>
        </div>
      )}
    </Modal>
  </>
}


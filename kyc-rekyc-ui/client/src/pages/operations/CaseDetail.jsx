import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, PageTitle, Badge, Button, Avatar, Modal, Toast } from '../../components/UI';
import API from '../../api/client';

export default function CaseDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Documents');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleAction = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      await API.patch(`/cases/${id}/status/`, { action: modalType });
    } catch (err) {}
    setToast({ message: `Case ${id} ${modalType} successfully`, type: 'success' });
    setShowModal(false);
    setTimeout(() => navigate('/ops/cases'), 1500);
  };

  return (
    <div>
      <div className="space" style={{ marginBottom: '20px' }}>
        <PageTitle title={`Case Detail: ${id}`} subtitle="360° view of customer application and AI insights" />
        <Badge tone="warning">MAKER REVIEW</Badge>
      </div>

      <div className="grid two" style={{ gridTemplateColumns: '400px 1fr' }}>
        {/* Left Panel: Profile */}
        <div className="grid">
          <Card style={{ padding: '25px', textAlign: 'center' }}>
            <Avatar name="Rohan Mehta" size="80px" />
            <h3 style={{ marginTop: '15px', marginBottom: '5px' }}>Rohan Mehta</h3>
            <Badge tone="info">Salaried Professional</Badge>
            
            <div className="grid" style={{ gap: '15px', marginTop: '25px', textAlign: 'left' }}>
              <div className="space"><span className="muted">PAN</span><b>ABCDE1234F</b></div>
              <div className="space"><span className="muted">Aadhaar</span><b>•••• 5678</b></div>
              <div className="space"><span className="muted">Mobile</span><b>+91 98765 43210</b></div>
              <div className="space"><span className="muted">Email</span><b>rohan@example.com</b></div>
              <hr style={{ border: 0, borderTop: '1px solid var(--line)', width: '100%' }} />
              <div className="space"><span className="muted">Loan Type</span><b>Home Loan</b></div>
              <div className="space"><span className="muted">Amount</span><b>₹ 35,00,000</b></div>
              <div className="space"><span className="muted">Income</span><b>₹ 80,000 / mo</b></div>
            </div>
          </Card>

          <Card style={{ padding: '25px' }}>
            <h4>Property Details</h4>
            <p className="muted" style={{ fontSize: '13px' }}>A-402, Sunshine Heights, Mumbai - 400053</p>
            <div className="grid" style={{ gap: '10px', marginTop: '15px' }}>
              <div className="space"><span className="muted">Builder</span><b>Godrej Properties</b></div>
              <div className="space"><span className="muted">Value</span><b>₹ 85,00,000</b></div>
            </div>
          </Card>
        </div>

        {/* Right Panel: Tabs */}
        <div>
          <Card style={{ padding: 0 }}>
            <div className="toolbar" style={{ borderBottom: '1px solid var(--line)', padding: '0 20px', gap: '30px' }}>
              {['Documents', 'AI Results', 'Workflow', 'Compliance'].map(tab => (
                <button 
                  key={tab}
                  className="linkbtn" 
                  style={{ 
                    background: 'none', 
                    borderRadius: 0, 
                    borderBottom: activeTab === tab ? '3px solid var(--primary)' : '0',
                    color: activeTab === tab ? 'var(--primary)' : 'var(--muted)',
                    padding: '20px 0'
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ padding: '25px' }}>
              {activeTab === 'Documents' && (
                <div className="grid">
                  {[
                    { name: 'PAN Card', score: 98.2, status: 'Matched' },
                    { name: 'Aadhaar Card', score: 94.5, status: 'Matched' },
                    { name: 'Salary Slip', score: 91.0, status: 'Manual Check' }
                  ].map(doc => (
                    <div key={doc.name} className="card space" style={{ background: '#f8fafc', padding: '15px 20px' }}>
                      <div>
                        <b>{doc.name}</b>
                        <div className="muted" style={{ fontSize: '12px' }}>Confidence Score: {doc.score}%</div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Badge tone={doc.status === 'Matched' ? 'success' : 'warning'}>{doc.status}</Badge>
                        <button className="linkbtn" style={{ fontSize: '12px' }}>View</button>
                      </div>
                    </div>
                  ))}
                  <div className="card" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                    <b>Cross-document Consistency</b>
                    <div className="grid three" style={{ marginTop: '10px' }}>
                      <div className="space"><span>Name</span><span style={{ color: 'var(--success)' }}>✓ Match</span></div>
                      <div className="space"><span>DOB</span><span style={{ color: 'var(--success)' }}>✓ Match</span></div>
                      <div className="space"><span>Address</span><span style={{ color: 'var(--danger)' }}>✗ Deviation</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'AI Results' && (
                <div className="grid">
                  <div className="score-box" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                    <div>
                      <div className="muted" style={{ color: '#166534' }}>Aggregate Risk Score</div>
                      <div className="big" style={{ color: '#15803d' }}>12.4</div>
                    </div>
                    <Badge tone="success" style={{ height: 'fit-content' }}>LOW RISK</Badge>
                  </div>
                  
                  <div className="grid" style={{ gap: '12px' }}>
                    {[
                      { agent: "Document Intake", status: "SUCCESS", thought: "OCR extracted 98.2% fields. Aadhaar and PAN numbers detected.", log: "No redaction needed." },
                      { agent: "Consistency Agent", status: "SUCCESS", thought: "Name and DOB match across PAN and Aadhaar records.", log: "Address deviation of 8.2km noted but within tolerance." },
                      { agent: "Identity Verify", status: "SUCCESS", thought: "Face match score 94% vs Aadhaar photo. Liveness confirmed.", log: "API verification successful." },
                      { agent: "AML Risk Agent", status: "SUCCESS", thought: "Screened against 14 global sanctions lists. Zero hits found.", log: "PEP status: Negative." },
                      { agent: "Fraud Sentinel", status: "SUCCESS", thought: "Device fingerprinting shows no anomalies. Mobile age > 2 years.", log: "Velocity check: Normal." },
                      { agent: "Compliance Agent", status: "FINALIZED", thought: "All core indicators are green. Eligible for auto-approval.", log: "Recommended: APPROVE" }
                    ].map((trace, i) => (
                      <div key={i} className="card" style={{ padding: '15px', marginBottom: '0', background: '#f8fafc' }}>
                        <div className="space">
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: trace.status === 'SUCCESS' || trace.status === 'FINALIZED' ? 'var(--success)' : 'var(--warning)' }}></div>
                            <b style={{ fontSize: '14px' }}>{trace.agent}</b>
                          </div>
                          <Badge tone={trace.status === 'FINALIZED' ? 'purple' : 'success'} style={{ fontSize: '10px' }}>{trace.status}</Badge>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px', fontStyle: 'italic' }}>
                          "{trace.thought}"
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--success)', marginTop: '4px' }}>
                          ● {trace.log}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Workflow' && (
                <div className="grid">
                  {[
                    { actor: 'System', action: 'OCR Extraction', time: '10:02 AM', result: 'Success' },
                    { actor: 'AI Agent', action: 'AML Screening', time: '10:05 AM', result: 'Low Risk' },
                    { actor: 'Maker', action: 'Assigned to Case', time: '10:15 AM', result: 'Pending' }
                  ].map((w, i) => (
                    <div key={i} className="space" style={{ padding: '12px', borderLeft: '4px solid var(--primary)', background: '#f8fafc' }}>
                      <div>
                        <b>{w.action}</b>
                        <div className="muted" style={{ fontSize: '12px' }}>By {w.actor} at {w.time}</div>
                      </div>
                      <Badge>{w.result}</Badge>
                    </div>
                  ))}
                  <textarea placeholder="Add a private note to this case..." />
                  <Button variant="secondary" style={{ width: 'fit-content' }}>Add Note</Button>
                </div>
              )}
            </div>
          </Card>

          {/* Action Bar */}
          <Card style={{ padding: '20px', display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button variant="secondary" onClick={() => handleAction('returned')}>Request Documents</Button>
            <Button variant="secondary" style={{ background: '#fef3c7', color: '#92400e' }} onClick={() => handleAction('escalated')}>Escalate to EDD</Button>
            <Button style={{ background: 'var(--success)', padding: '12px 40px' }} onClick={() => handleAction('approved')}>Approve Case</Button>
          </Card>
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Confirm Action">
        <p>Are you sure you want to <b>{modalType}</b> this case? This action will be logged in the audit trail.</p>
        <div className="grid" style={{ marginTop: '30px' }}>
          <textarea placeholder="Optional comment for the audit log..." />
          <div className="space" style={{ marginTop: '10px' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={confirmAction}>Confirm {modalType}</Button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

import React from 'react';
import { Card, PageTitle, Badge, Button, Progress } from '../../components/UI';

export default function StatusTracker() {
  const steps = [
    { label: 'Application submitted', date: 'Oct 12, 2024', status: 'complete' },
    { label: 'Documents uploaded', date: 'Oct 12, 2024', status: 'complete' },
    { label: 'AI verification complete', date: 'Oct 12, 2024', status: 'complete' },
    { label: 'Under review', date: 'Estimated: 24h', status: 'active' },
    { label: 'CKYC update', date: '', status: 'pending' },
    { label: 'Approved', date: '', status: 'pending' },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="grid two" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Left Side: Timeline */}
        <Card style={{ padding: '40px', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '40px', fontFamily: 'Outfit' }}>Application Timeline</h2>
          <div style={{ display: 'grid', gap: '0', position: 'relative' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '24px', paddingBottom: '40px', position: 'relative' }}>
                {/* Vertical Line */}
                {i !== steps.length - 1 && (
                  <div style={{ 
                    position: 'absolute', left: '11px', top: '24px', bottom: '-24px', 
                    width: '2px', background: i < 3 ? '#10b981' : '#f1f5f9' 
                  }}></div>
                )}
                
                {/* Dot */}
                <div style={{ 
                  width: '24px', height: '24px', borderRadius: '50%', zIndex: 1,
                  background: step.status === 'complete' ? '#10b981' : (step.status === 'active' ? '#2563eb' : 'white'),
                  border: step.status === 'pending' ? '2px solid #f1f5f9' : 'none',
                  display: 'grid', placeItems: 'center'
                }}>
                  {step.status === 'complete' && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
                </div>

                {/* Content */}
                <div>
                  <div style={{ 
                    fontWeight: '700', fontSize: '18px', 
                    color: step.status === 'pending' ? '#94a3b8' : '#0f172a' 
                  }}>
                    {step.label}
                  </div>
                  {step.date && (
                    <div className="muted" style={{ fontSize: '14px', marginTop: '4px' }}>
                      {step.date}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Side: Actions & Activity */}
        <div className="grid" style={{ gap: '30px' }}>
          
          {/* Case Card */}
          <Card style={{ padding: '30px', borderRadius: '24px' }}>
            <div className="space" style={{ marginBottom: '20px' }}>
              <div>
                <div className="muted" style={{ fontSize: '13px' }}>Case ID</div>
                <h2 style={{ color: '#2563eb', margin: 0, fontSize: '24px', fontFamily: 'monospace' }}>KYC-24001</h2>
              </div>
              <Badge tone="warning" style={{ padding: '8px 16px', borderRadius: '12px' }}>IN REVIEW</Badge>
            </div>
            
            <div className="grid" style={{ gap: '12px' }}>
              <Button style={{ width: '100%', padding: '16px', borderRadius: '14px' }}>Download Acknowledgement Letter</Button>
              <Button variant="secondary" style={{ width: '100%', padding: '16px', borderRadius: '14px', background: '#f8fafc' }}>Upload Additional Document</Button>
            </div>
          </Card>

          {/* Activity Card */}
          <Card style={{ padding: '30px', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '24px', fontFamily: 'Outfit' }}>Recent Activity</h3>
            <div className="grid" style={{ gap: '20px' }}>
              {[
                { label: 'Selfie capture completed', time: '10:42 AM' },
                { label: 'PAN verification success', time: '10:38 AM' },
                { label: 'Documents uploaded (6/7)', time: '10:35 AM' }
              ].map((act, i) => (
                <div key={i} className="space" style={{ fontSize: '15px' }}>
                  <span>{act.label}</span>
                  <span className="muted" style={{ fontSize: '13px' }}>{act.time}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Footer Note */}
          <div style={{ textAlign: 'center' }}>
            <p className="muted" style={{ fontSize: '12px' }}>
              Notification sent to +91 98765 43210 • last updated 10:42 AM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

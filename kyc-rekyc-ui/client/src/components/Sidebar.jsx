import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge, Button } from './UI';

export default function Sidebar() {
  const { role, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = {
    'Customer': [
      { path: '/app/onboarding', label: 'KYC Onboarding', icon: '📝' },
      { path: '/app/status', label: 'Status Tracker', icon: '📋' }
    ],
    'Maker': [
      { path: '/ops/cases', label: 'Cases Queue', icon: '📥' },
      { path: '/ops/review/1', label: 'My Reviews', icon: '✍️' }
    ],
    'Checker': [
      { path: '/ops/cases', label: 'Cases Queue', icon: '📥' },
      { path: '/ops/cases?stage=checker', label: 'Pending Approvals', icon: '✅' }
    ],
    'Field Agent': [
      { path: '/ops/field', label: 'Field Verification', icon: '📍' }
    ],
    'Operations Manager': [
      { path: '/ops/cases', label: 'Cases Queue', icon: '📥' },
      { path: '/ops/cases?all=true', label: 'All Cases', icon: '📊' },
      { path: '/ops/field', label: 'Field', icon: '📍' }
    ],
    'CXO': [
      { path: '/cxo/dashboard', label: 'Command Centre', icon: '🏢' },
      { path: '/cxo/risk', label: 'Risk & Fraud', icon: '🛡️' },
      { path: '/cxo/compliance', label: 'Compliance & Audit', icon: '⚖️' },
      { path: '/cxo/admin', label: 'Admin', icon: '⚙️' }
    ],
    'Compliance Officer': [
      { path: '/cxo/dashboard', label: 'Command Centre', icon: '🏢' },
      { path: '/cxo/compliance', label: 'Compliance & Audit', icon: '⚖️' }
    ]
  };

  const links = menuItems[role] || [];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="brand">
        <div style={{ fontSize: '24px' }}>🛡️</div>
        <div>
          <b style={{ display: 'block', fontSize: '18px' }}>KYC Shield</b>
          <span>Enterprise KYC</span>
        </div>
      </div>

      <button 
        className="ghost" 
        onClick={() => setCollapsed(!collapsed)}
        style={{ cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {collapsed ? '→' : '← Collapse'}
      </button>

      <nav>
        {links.map(link => (
          <NavLink key={link.path} to={link.path} className={({ isActive }) => isActive ? 'active' : ''}>
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
        {!collapsed && (
          <div style={{ marginBottom: '12px' }}>
            <Badge tone="purple">{role}</Badge>
          </div>
        )}
        <Button variant="secondary" onClick={logout} style={{ width: '100%', padding: '10px' }}>
          {collapsed ? '🚪' : 'Logout'}
        </Button>
      </div>
    </aside>
  );
}

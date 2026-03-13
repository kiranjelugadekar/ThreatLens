import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Activity, QrCode } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="container">
      <nav className="navbar">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div className="logo cursor-pointer flex items-center gap-2">
            <ShieldAlert size={40} color="var(--accent-primary)" />
            <span style={{ fontSize: '3rem', fontWeight: 700, color: 'white' }}>ThreatLens &nbsp; &nbsp;</span>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '16px' }}>
          {location.pathname !== '/qr-scanner' && (
            <Link to="/qr-scanner" className="btn-secondary animate-fade-in-up" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
              <QrCode size={20} />
              Scan QR
            </Link>
          )}
          {location.pathname !== '/scan' && (
            <Link to="/scan" className="btn-primary animate-fade-in-up" style={{ textDecoration: 'none' }}>
              <Activity size={20} />
              New Scan
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

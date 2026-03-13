import React, { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, Crosshair, Zap, ArrowRight, Activity, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ResultsCard from '../components/ResultsCard';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center' }}>
      
      <div className="animate-fade-in-up" style={{ marginBottom: '40px', maxWidth: '800px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 16px', borderRadius: '20px', color: 'var(--accent-primary)', marginBottom: '24px', fontSize: '0.9rem', fontWeight: 600 }}>
          <ShieldCheck size={18} />
          <span>Advanced API Security Engine</span>
        </div>
        
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Secure Your APIs <br />Before They Deploy
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Automated vulnerability scanning, rate limit testing, and data exposure detection. Discover weaknesses instantly with our advanced scanner.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate('/scan')}
            className="btn-primary" 
            style={{ padding: '16px 32px', fontSize: '1.1rem' }}
          >
            <Crosshair size={22} />
            Start Scanning
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', width: '100%', marginTop: '40px' }}>
        
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--accent-primary)' }}>
            <Zap size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', fontWeight: 600 }}>Lightning Fast</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Run comprehensive security checks against your API endpoints in seconds, not hours.</p>
        </div>

        <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--success-color)' }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', fontWeight: 600 }}>Deep Analysis</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Detect missing authentication, broken authorization, and sensitive data exposure.</p>
        </div>

        <div className="glass-panel" style={{ padding: '32px', textAlign: 'left' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--warning-color)' }}>
            <Activity size={24} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', fontWeight: 600 }}>Rate Limits</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Automatically test endpoint resiliency against rapid burst requests and DoS vectors.</p>
        </div>

      </div>
    </div>
  );
};

export default Home;
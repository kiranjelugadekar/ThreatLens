import React from 'react';
import VulnerabilityItem from './VulnerabilityItem';

const ResultsCard = ({ result }) => {
  if (!result) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success-color)';
    if (score >= 60) return 'var(--warning-color)';
    if (score >= 40) return '#ff5500';
    return 'var(--danger-color)';
  };

  const score = result.securityScore ?? result.score ?? 100;
  const riskLevel = result.riskLevel ?? 'Unknown';
  const breakdown = result.breakdown ?? {};
  const vulnerabilities = result.vulnerabilities ?? [];

  return (
    <div className="glass-panel animate-fade-in-up" style={{ padding: '32px', borderTop: `4px solid ${getScoreColor(score)}`, marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Scan Report</span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginTop: '4px' }}>{result.apiUrl || result.targetUrl}</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: getScoreColor(score), lineHeight: 1 }}>
            {score}<span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/100</span>
          </div>
          <span style={{ fontSize: '0.9rem', color: getScoreColor(score), fontWeight: 600 }}>{riskLevel}</span>
        </div>
      </div>

      {Object.keys(breakdown).length > 0 && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[['Critical', breakdown.critical, 'var(--danger-color)'], ['High', breakdown.high, '#ff5500'], ['Medium', breakdown.medium, 'var(--warning-color)'], ['Low', breakdown.low, 'var(--info-color)']].map(([label, count, color]) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}40`, borderRadius: '8px', padding: '12px 20px', textAlign: 'center', minWidth: '80px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color }}>{count ?? 0}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '24px 0' }}></div>

      <div>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 600 }}>
          {vulnerabilities.length === 0 ? '✅ No vulnerabilities detected!' : `${vulnerabilities.length} Issue(s) Detected`}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {vulnerabilities.map((vuln, index) => (
            <VulnerabilityItem key={index} vulnerability={vuln} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;
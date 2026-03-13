const calculateSecurityScore = (vulnerabilities) => {
  const maxScore = 100;
  let deductions = 0;

  // Critical vulnerabilities (25 points each)
  const critical = vulnerabilities.filter(v => (v.severity || '').toLowerCase() === 'critical').length;
  deductions += critical * 25;

  // High vulnerabilities (15 points each)
  const high = vulnerabilities.filter(v => (v.severity || '').toLowerCase() === 'high').length;
  deductions += high * 15;

  // Medium vulnerabilities (10 points each)
  const medium = vulnerabilities.filter(v => (v.severity || '').toLowerCase() === 'medium').length;
  deductions += medium * 10;

  // Low vulnerabilities (5 points each)
  const low = vulnerabilities.filter(v => (v.severity || '').toLowerCase() === 'low').length;
  deductions += low * 5;

  const score = Math.max(0, maxScore - deductions);

  return {
    score: Math.round(score),
    riskLevel: getRiskLevel(score),
    breakdown: { critical, high, medium, low }
  };
};

const getRiskLevel = (score) => {
  if (score >= 80) return 'Low Risk';
  if (score >= 60) return 'Medium Risk';
  if (score >= 40) return 'High Risk';
  return 'Critical Risk';
};

module.exports = { calculateSecurityScore, getRiskLevel };

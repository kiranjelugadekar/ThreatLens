const mongoose = require('mongoose');

const ScanReportSchema = new mongoose.Schema({
  apiUrl: {
    type: String,
    required: true,
  },
  scanType: {
    type: String,
    required: false,
    default: 'all'
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  vulnerabilities: [
    {
      name: String,
      severity: String,
      description: String,
      remediation: String
    }
  ],
  securityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  score: {
    type: Number, // Legacy support if needed
  },
  targetUrl: {
    type: String, // Legacy support for dashboard
  },
  riskLevel: {
    type: String
  },
  breakdown: {
    critical: Number,
    high: Number,
    medium: Number,
    low: Number
  }
});

module.exports = mongoose.model('ScanReport', ScanReportSchema);

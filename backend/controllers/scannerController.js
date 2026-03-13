const ScanReport = require('../models/ScanReport');
const scanner = require('../utils/scanner');
const { calculateSecurityScore } = require('../utils/scoreCalculator');

// Start a new scan
exports.startScan = async (req, res) => {
  try {
    const { apiUrl, scanType } = req.body;

    // Validate input
    if (!apiUrl || !scanType) {
      return res.status(400).json({ error: 'apiUrl and scanType are required' });
    }

    // Run security checks
    const vulnerabilities = await scanner.scan(apiUrl, scanType);

    // Calculate security score
    const { score, riskLevel, breakdown } = calculateSecurityScore(vulnerabilities);

    // Save to database
    const report = new ScanReport({
      apiUrl,
      scanType,
      vulnerabilities,
      securityScore: score,
      riskLevel,
      breakdown,
      timestamp: new Date()
    });

    await report.save();

    res.status(201).json({
      success: true,
      report: {
        id: report._id,
        apiUrl,
        scanType,
        securityScore: score,
        riskLevel,
        vulnerabilities,
        breakdown,
        timestamp: report.timestamp
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all scans
exports.getAllScans = async (req, res) => {
  try {
    const reports = await ScanReport.find().sort({ timestamp: -1 });
    res.status(200).json({
      success: true,
      total: reports.length,
      reports
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get scan by ID
exports.getScanById = async (req, res) => {
  try {
    const report = await ScanReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ success: false, error: 'Scan report not found' });
    }

    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete scan
exports.deleteScan = async (req, res) => {
  try {
    await ScanReport.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Scan deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
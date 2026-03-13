const express = require('express');
const { startScan, getAllScans, getScanById, deleteScan } = require('../controllers/scannerController');

const router = express.Router();

// POST - Start a new scan
router.post('/scan', startScan);

// GET - Get all scans
router.get('/scans', getAllScans);

// GET - Get scan by ID
router.get('/scan/:id', getScanById);

// DELETE - Delete scan
router.delete('/scan/:id', deleteScan);

module.exports = router;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Loader, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ResultsCard from '../components/ResultsCard';

const ScannerDashboard = () => {
  const location = useLocation();
  const [targetUrl, setTargetUrl] = useState('');

  // Prefill URL if passed from QR Scanner
  useEffect(() => {
    if (location.state?.targetUrl) {
      setTargetUrl(location.state.targetUrl);
    }
  }, [location.state]);

  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const removeHeader = (index) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!targetUrl) return;

    setIsLoading(true);
    setReport(null);
    setError(null);

    // The backend now expects { apiUrl, scanType }
    try {
      const response = await axios.post('http://localhost:5001/api/scan', {
        apiUrl: targetUrl,
        scanType: 'all' // We default to 'all' on this dashboard page.
      });

      // The new backend returns response.data.report
      setReport(response.data.report || response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during the scan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '24px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Search size={28} color="var(--accent-primary)" />
          New API Scan
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Enter the target API endpoint and optional headers to begin automated security analysis.
        </p>

        <form onSubmit={handleScan} className="glass-panel animate-fade-in-up" style={{ padding: '32px', marginBottom: '40px' }}>
          <div style={{ marginBottom: '32px' }}>
            <label className="label">Target URL</label>
            <input 
              type="url" 
              className="input-field" 
              placeholder="https://api.example.com/v1/users" 
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '200px' }}>
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Scanning...
                </>
              ) : (
                'Start Scan'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="glass-panel animate-fade-in-up" style={{ padding: '24px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '40px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <AlertTriangle color="var(--danger-color)" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ color: 'var(--danger-color)', marginBottom: '4px', fontWeight: 600 }}>Scan Failed</h4>
              <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
            </div>
          </div>
        )}

        {report && <ResultsCard result={report} />}
      </div>
    </div>
  );
};

export default ScannerDashboard;

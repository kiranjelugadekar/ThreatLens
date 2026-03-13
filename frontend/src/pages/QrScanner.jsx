import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { QrCode, AlertTriangle } from 'lucide-react';

const QrScanner = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Create an instance of the scanner
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    // This callback is triggered when a QR code is successfully scanned
    const onScanSuccess = (decodedText, decodedResult) => {
      // Basic validation to check if the scanned text looks like a URL
      try {
        const url = new URL(decodedText);
        // Clean up the scanner
        html5QrcodeScanner.clear();
        
        // Navigate to the scanner dashboard and pass the URL
        navigate('/scan', { state: { targetUrl: url.href } });
      } catch (e) {
        // Handle case where QR is not a valid URL
        setError(`Scanned value is not a valid URL: ${decodedText}`);
      }
    };

    // Callback for scan errors (frequent, when no QR is present in frame)
    const onScanFailure = (error) => {
      // typically we ignore these since it scans continuously
    };

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);

    // Cleanup function when component unmounts
    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [navigate]);

  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '24px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <QrCode size={28} color="var(--accent-primary)" />
          Scan QR Code
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Scan a QR code containing an API endpoint or website link to analyze it instantly.
        </p>

        <div className="glass-panel animate-fade-in-up" style={{ padding: '32px', marginBottom: '40px' }}>
          {error && (
            <div style={{ padding: '16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '24px', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <AlertTriangle color="var(--danger-color)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ color: 'var(--danger-color)', margin: 0 }}>{error}</p>
            </div>
          )}
          
          <div id="qr-reader" style={{ width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default QrScanner;

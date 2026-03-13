import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ScannerDashboard from './pages/ScannerDashboard';
import QrScanner from './pages/QrScanner';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<ScannerDashboard />} />
            <Route path="/qr-scanner" element={<QrScanner />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

// src/pages/ScanClaim.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from "html5-qrcode";
import api from '../api';

export default function ScanClaim() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const config = { fps: 10, qrbox: 250 };
    const html5QrCodeScanner = new Html5QrcodeScanner(
      "qr-reader", config, /* verbose= */ false
    );

    // Callback when a QR code is successfully detected
    const successCallback = async (decodedText, decodedResult) => {
      // Clear scanning so it stops processing duplicates
      html5QrCodeScanner.clear();
      try {
        const claimData = JSON.parse(decodedText);
        const res = await api.post('/reward/claim', claimData);
        // You can display a modal or use a toast instead of alert:
        alert(res.data.message); 
        navigate('/claim');
      } catch (err) {
        console.error('Error confirming claim:', err);
        setError('Invalid QR Code data or error processing claim.');
      }
    };

    // Error callback: ignore "NotFoundException"
    const errorCallback = (err) => {
      // If error message indicates no QR detected, then simply ignore or log
      if (err && err.name === "NotFoundException") {
        // Typically, nothing needs to be done as this is expected when no QR is present
        return;
      }
      console.error("QR Scan Error:", err);
      setError("Error scanning QR Code: " + err.message);
    };

    html5QrCodeScanner.render(successCallback, errorCallback);

    // Cleanup on unmount
    return () => {
      html5QrCodeScanner.clear().catch((err) => {
        console.error("Failed to clear html5QrCodeScanner.", err);
      });
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4 text-white">
      <motion.h1
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Scan QR Code to Confirm Claim
      </motion.h1>
      
      {error && <p className="text-red-300 mb-4">{error}</p>}
      
      {/* QR Reader Container */}
      <div id="qr-reader" className="w-80 h-80 mb-6" />
      
      <motion.button
        onClick={() => navigate('/claim')}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Cancel
      </motion.button>
    </div>
  );
}

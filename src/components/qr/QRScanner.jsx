import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion } from 'framer-motion';
import { X, Camera } from 'lucide-react';

export default function QRScanner({ onScanSuccess, onClose }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    // Create element to host scanner UI
    const scannerId = 'qr-reader-element';
    
    // Configuration
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    };

    const html5QrcodeScanner = new Html5QrcodeScanner(scannerId, config, false);
    
    html5QrcodeScanner.render(
      (decodedText) => {
        try {
          const parsed = JSON.parse(decodedText);
          html5QrcodeScanner.clear().then(() => {
            onScanSuccess(parsed);
          }).catch(err => {
            console.error("Scanner clear failed:", err);
            onScanSuccess(parsed);
          });
        } catch (e) {
          console.error("Invalid QR text format:", decodedText);
        }
      },
      (error) => {
        // Quietly fail scan frame errors
      }
    );

    scannerRef.current = html5QrcodeScanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => {
          console.error("Clean up scanner failed:", err);
        });
      }
    };
  }, [onScanSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-3xl w-full max-w-md p-6 overflow-hidden relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-4">
          <div className="inline-flex p-3 bg-emerald-50 rounded-2xl text-emerald-600 mb-2 border border-emerald-100">
            <Camera size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Scan Campus Location QR</h3>
          <p className="text-xs text-slate-500 mt-1">
            Point camera at a printed location QR code to verify your habit.
          </p>
        </div>

        {/* Scanner container element */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div id="qr-reader-element" className="w-full" />
        </div>

        <p className="text-[10px] text-center text-slate-400 mt-4">
          Camera permission required · Scanning automatically logs habits with +15 Integrity score bonus
        </p>
      </div>
    </motion.div>
  );
}

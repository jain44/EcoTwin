import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { QR_LOCATIONS } from '../data/qrLocations';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, AlertCircle } from 'lucide-react';

export default function QRLocations() {
  const navigate = useNavigate();
  const [qrCodes, setQrCodes] = useState({});

  useEffect(() => {
    const generateQRs = async () => {
      const urls = {};
      for (const loc of QR_LOCATIONS) {
        try {
          // Convert the verification payload to JSON string
          const payloadStr = JSON.stringify(loc.payload);
          const dataUrl = await QRCode.toDataURL(payloadStr, {
            margin: 2,
            width: 250,
            color: {
              dark: '#064e3b',  // Forest Green
              light: '#fdfbf7', // Off-white cream
            }
          });
          urls[loc.id] = dataUrl;
        } catch (err) {
          console.error(`Failed to generate QR for ${loc.id}:`, err);
        }
      }
      setQrCodes(urls);
    };

    generateQRs();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-content pt-4 pb-12 print:p-0 print:bg-white print:text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
        <div>
          <button 
            onClick={() => navigate('/admin')} 
            className="btn-ghost text-xs mb-2 -ml-1 flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            <span>Back to Admin</span>
          </button>
          <h1 className="text-2xl font-display font-bold text-forest-900">
            📍 Campus QR Code Generators
          </h1>
          <p className="text-sm text-moss-400 mt-0.5">
            Static QR codes to print and mount at real campus locations.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="btn-primary flex items-center justify-center gap-2 py-3 px-5 text-sm"
        >
          <Printer size={16} />
          <span>Print QR Signs</span>
        </button>
      </div>

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 print:hidden text-amber-800">
        <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
        <div className="text-xs font-semibold leading-relaxed">
          <p className="font-bold mb-0.5">How to Test this Demo:</p>
          <p>
            Scan these QR codes using the in-app "Scan QR" button on the Log Habit page. 
            They instantly log habits with a verified source tag, skipping manual input checks and boosting the Trust Score.
          </p>
        </div>
      </div>

      {/* Grid of Printable Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
        {QR_LOCATIONS.map((loc) => (
          <motion.div
            key={loc.id}
            className="bg-cream-50 border-2 border-forest-150 rounded-3xl p-6 flex flex-col items-center text-center shadow-xs print:border-black print:bg-white print:shadow-none"
            whileHover={{ y: -4 }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{loc.icon}</span>
              <span className="text-xs uppercase font-extrabold tracking-wider text-forest-800 bg-forest-50 px-2.5 py-1 rounded-full border border-forest-100 print:text-black print:border-black">
                EcoTwin verified
              </span>
            </div>
            
            <h2 className="text-base font-display font-extrabold text-forest-900 mt-1 print:text-black">
              {loc.name}
            </h2>
            
            <p className="text-xs text-moss-500 max-w-[200px] mt-1 mb-4 print:text-black print:mb-2">
              {loc.description}
            </p>

            {/* QR Rendered Canvas */}
            <div className="bg-white border-4 border-forest-800/10 p-3 rounded-2xl print:border-black print:p-1">
              {qrCodes[loc.id] ? (
                <img 
                  src={qrCodes[loc.id]} 
                  alt={`${loc.name} QR Code`} 
                  className="w-48 h-48 object-contain print:w-40 print:h-40" 
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-xs text-moss-400 italic">
                  Generating QR...
                </div>
              )}
            </div>

            <span className="text-[10px] font-extrabold text-forest-600 uppercase tracking-widest mt-4 print:text-black">
              Scan with EcoTwin App 🌿
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

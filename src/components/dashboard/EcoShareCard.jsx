import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Download, Share2, X } from 'lucide-react';
import TwinRenderer from '../twin/TwinRenderer';

export default function EcoShareCard({ userProfile, twinState, rollingAverage, greenCoinsBalance, habitLog, onClose }) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [shared, setShared] = useState(false);

  const firstName = userProfile?.name?.split(' ')[0] ?? 'Student';
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const totalDays = habitLog.length;
  const totalKgSaved = +(totalDays * 5.5 - habitLog.reduce((s, e) => s + (e.computedFootprintKg ?? 0), 0)).toFixed(1);
  const treesEquiv = Math.max(0, +(totalKgSaved / 21).toFixed(1));

  const stateLabels = { thriving: 'Thriving 🌿', neutral: 'Neutral 🌾', wilting: 'Wilting 🥀' };
  const stateColors = {
    thriving: 'from-emerald-400 to-green-600',
    neutral:  'from-amber-400 to-orange-500',
    wilting:  'from-rose-400 to-red-600',
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `ecotwin-${firstName.toLowerCase()}-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Share card error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'ecotwin-card.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'My EcoTwin Card 🌿', files: [file] });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } else {
        handleDownload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        className="w-full max-w-sm relative"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-moss-500 hover:text-rose-500 transition-colors"
        >
          <X size={16} />
        </button>

        {/* The actual card that gets captured */}
        <div
          ref={cardRef}
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #1a2e17 0%, #2f5828 40%, #3d7235 100%)',
            padding: '28px',
            fontFamily: 'Outfit, Inter, sans-serif',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <p style={{ color: '#9ab88a', fontSize: '11px', fontWeight: 600, marginBottom: 2 }}>EcoTwin 🌿</p>
              <p style={{ color: 'white', fontSize: '22px', fontWeight: 800 }}>{firstName}'s Card</p>
              <p style={{ color: '#7aab68', fontSize: '11px', marginTop: 2 }}>{today}</p>
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderRadius: '14px',
                padding: '8px 14px',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <p style={{ color: '#fbbf24', fontSize: '20px', fontWeight: 900 }}>{greenCoinsBalance}</p>
              <p style={{ color: '#f3e6a3', fontSize: '10px', fontWeight: 700 }}>🪙 Coins</p>
            </div>
          </div>

          {/* Twin + State */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ flexShrink: 0 }}>
              <TwinRenderer state={twinState} size="md" />
            </div>
            <div>
              <div
                style={{
                  background: twinState === 'thriving' ? 'rgba(74,222,128,0.2)' : twinState === 'neutral' ? 'rgba(251,191,36,0.2)' : 'rgba(251,113,133,0.2)',
                  border: `1px solid ${twinState === 'thriving' ? '#4ade80' : twinState === 'neutral' ? '#fbbf24' : '#fb7185'}`,
                  borderRadius: '999px',
                  padding: '4px 12px',
                  display: 'inline-block',
                  marginBottom: '8px',
                }}
              >
                <p style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>{stateLabels[twinState]}</p>
              </div>
              <p style={{ color: 'white', fontSize: '26px', fontWeight: 900, lineHeight: 1 }}>
                {rollingAverage > 0 ? rollingAverage.toFixed(2) : '—'} kg
              </p>
              <p style={{ color: '#9ab88a', fontSize: '11px', fontWeight: 600 }}>CO₂e / day (7-day avg)</p>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: 'Days Logged', value: totalDays },
              { label: 'kg CO₂ Saved', value: totalKgSaved > 0 ? `+${totalKgSaved}` : '—' },
              { label: 'Trees Equiv.', value: treesEquiv > 0 ? `🌳 ${treesEquiv}` : '—' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '10px 8px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <p style={{ color: 'white', fontSize: '18px', fontWeight: 800 }}>{stat.value}</p>
                <p style={{ color: '#7aab68', fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color: '#7aab68', fontSize: '10px', fontWeight: 600 }}>
              ecotwin.app · Built for TCET 🌱 PixxelHack 2.0
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-forest-800 font-bold py-3 rounded-2xl shadow-sm hover:bg-cream-50 transition-colors text-sm disabled:opacity-60"
          >
            <Download size={16} />
            {downloading ? 'Saving...' : 'Save PNG'}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 bg-forest-600 text-white font-bold py-3 rounded-2xl shadow-sm hover:bg-forest-700 transition-colors text-sm"
          >
            <Share2 size={16} />
            {shared ? 'Shared! ✅' : 'Share'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Thriving State — Bioluminescent plant-spirit, lush, vibrant, glowing emerald
 * Rich with leaves, bright eyes, strong vines
 */
export default function TwinThriving() {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* Sparkle particles */}
      <div className="sparkle-container" style={{ width: 280, height: 280 }}>
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
        <div className="sparkle" />
      </div>

      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 240,
          height: 240,
          background: 'radial-gradient(circle, rgba(74,222,128,0.2) 0%, rgba(74,222,128,0.05) 60%, transparent 80%)',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Twin SVG */}
      <motion.svg
        width="200"
        height="220"
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 16px rgba(74,222,128,0.5))' }}
      >
        {/* ── VINES / ROOT SYSTEM ── */}
        {/* Left base vine */}
        <motion.path
          d="M70 195 Q55 180 50 160 Q45 140 55 130"
          stroke="#16a34a"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          animate={{ pathLength: [0.9, 1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {/* Right base vine */}
        <motion.path
          d="M130 195 Q145 180 150 160 Q155 140 145 130"
          stroke="#16a34a"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          animate={{ pathLength: [0.9, 1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />

        {/* ── BODY — organic blob shape ── */}
        <motion.ellipse
          cx="100"
          cy="155"
          rx="42"
          ry="48"
          fill="url(#thrivingBodyGrad)"
          animate={{ ry: [48, 50, 48] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Body sheen */}
        <ellipse cx="88" cy="135" rx="10" ry="14" fill="rgba(255,255,255,0.15)" />

        {/* ── HEAD / TOP SPHERE ── */}
        <motion.circle
          cx="100"
          cy="105"
          r="40"
          fill="url(#thrivingHeadGrad)"
          animate={{ r: [40, 41, 40] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        {/* Head sheen */}
        <ellipse cx="88" cy="90" rx="10" ry="12" fill="rgba(255,255,255,0.2)" />

        {/* ── FACE ── */}
        {/* Left eye */}
        <motion.ellipse
          cx="87"
          cy="105"
          rx="7"
          ry="8"
          fill="#0f172a"
          animate={{ ry: [8, 1, 8] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
        />
        <circle cx="89" cy="103" r="2.5" fill="white" />
        <circle cx="84.5" cy="107" r="1.2" fill="rgba(255,255,255,0.6)" />

        {/* Right eye */}
        <motion.ellipse
          cx="113"
          cy="105"
          rx="7"
          ry="8"
          fill="#0f172a"
          animate={{ ry: [8, 1, 8] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
        />
        <circle cx="115" cy="103" r="2.5" fill="white" />
        <circle cx="110.5" cy="107" r="1.2" fill="rgba(255,255,255,0.6)" />

        {/* Smile */}
        <path
          d="M91 118 Q100 126 109 118"
          stroke="#0f172a"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Rosy cheeks */}
        <ellipse cx="79" cy="116" rx="7" ry="4" fill="rgba(248, 113, 113, 0.25)" />
        <ellipse cx="121" cy="116" rx="7" ry="4" fill="rgba(248, 113, 113, 0.25)" />

        {/* ── LEAF CROWN ── */}
        {/* Center leaf */}
        <motion.path
          d="M100 65 Q95 45 100 30 Q105 45 100 65Z"
          fill="url(#leafGrad1)"
          animate={{ rotate: [0, 3, -3, 0], originX: '100px', originY: '65px' }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 65px' }}
        />
        {/* Left leaf */}
        <motion.path
          d="M82 72 Q65 55 62 38 Q78 50 82 72Z"
          fill="url(#leafGrad2)"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{ transformOrigin: '82px 72px' }}
        />
        {/* Right leaf */}
        <motion.path
          d="M118 72 Q135 55 138 38 Q122 50 118 72Z"
          fill="url(#leafGrad2)"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ transformOrigin: '118px 72px' }}
        />
        {/* Small side leaves */}
        <path d="M90 75 Q78 62 76 50 Q88 60 90 75Z" fill="#16a34a" opacity="0.7" />
        <path d="M110 75 Q122 62 124 50 Q112 60 110 75Z" fill="#16a34a" opacity="0.7" />

        {/* ── BIOLUMINESCENT DOTS on body ── */}
        <motion.circle cx="90" cy="150" r="3" fill="#86efac"
          animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity }} />
        <motion.circle cx="110" cy="165" r="2.5" fill="#86efac"
          animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }} />
        <motion.circle cx="95" cy="175" r="2" fill="#4ade80"
          animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.8, repeat: Infinity, delay: 1.2 }} />

        {/* ── GRADIENTS ── */}
        <defs>
          <radialGradient id="thrivingBodyGrad" cx="40%" cy="30%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="60%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </radialGradient>
          <radialGradient id="thrivingHeadGrad" cx="40%" cy="30%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="50%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#22c55e" />
          </radialGradient>
          <linearGradient id="leafGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
          <linearGradient id="leafGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* State label */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <span className="eco-badge bg-thriving-100 text-thriving-700 border border-thriving-200 shadow-sm">
          ✦ Thriving
        </span>
      </motion.div>
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Neutral State — Warm amber/ochre plant-spirit, balanced but cautious
 * Leaves less lush, expression more serious/concerned
 */
export default function TwinNeutral() {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* Outer glow ring — warm amber */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 220,
          height: 220,
          background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.04) 60%, transparent 80%)',
        }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.svg
        width="200"
        height="220"
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 12px rgba(251,191,36,0.35))' }}
      >
        {/* ── VINES / ROOTS — smaller, thinner ── */}
        <path
          d="M75 195 Q62 182 58 165 Q55 148 63 138"
          stroke="#d97706"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M125 195 Q138 182 142 165 Q145 148 137 138"
          stroke="#d97706"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />

        {/* ── BODY ── */}
        <motion.ellipse
          cx="100"
          cy="157"
          rx="40"
          ry="46"
          fill="url(#neutralBodyGrad)"
          animate={{ ry: [46, 47.5, 46] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <ellipse cx="88" cy="138" rx="9" ry="12" fill="rgba(255,255,255,0.12)" />

        {/* ── HEAD ── */}
        <motion.circle
          cx="100"
          cy="107"
          r="39"
          fill="url(#neutralHeadGrad)"
          animate={{ r: [39, 40, 39] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        <ellipse cx="88" cy="93" rx="9" ry="11" fill="rgba(255,255,255,0.15)" />

        {/* ── FACE — slightly concerned expression ── */}
        {/* Left eye */}
        <motion.ellipse
          cx="87"
          cy="107"
          rx="6.5"
          ry="7.5"
          fill="#1c1c1c"
          animate={{ ry: [7.5, 1, 7.5] }}
          transition={{ duration: 5, repeat: Infinity, repeatDelay: 3 }}
        />
        <circle cx="89" cy="105" r="2.2" fill="white" />

        {/* Right eye */}
        <motion.ellipse
          cx="113"
          cy="107"
          rx="6.5"
          ry="7.5"
          fill="#1c1c1c"
          animate={{ ry: [7.5, 1, 7.5] }}
          transition={{ duration: 5, repeat: Infinity, repeatDelay: 3 }}
        />
        <circle cx="115" cy="105" r="2.2" fill="white" />

        {/* Neutral / slightly concerned mouth */}
        <path
          d="M91 120 Q100 123 109 120"
          stroke="#1c1c1c"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Slight worry lines above eyes */}
        <path d="M82 99 Q87 96 92 99" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M108 99 Q113 96 118 99" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />

        {/* ── LEAF CROWN — sparser, yellowing ── */}
        {/* Center leaf — slightly wilted */}
        <motion.path
          d="M100 68 Q94 50 100 35 Q106 50 100 68Z"
          fill="url(#neutralLeafGrad1)"
          animate={{ rotate: [0, 2, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 68px' }}
        />
        {/* Left leaf — partial */}
        <motion.path
          d="M85 76 Q70 62 70 48 Q83 57 85 76Z"
          fill="url(#neutralLeafGrad2)"
          animate={{ rotate: [0, -3, 2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
          style={{ transformOrigin: '85px 76px' }}
        />
        {/* Right leaf — partial */}
        <motion.path
          d="M115 76 Q130 62 130 48 Q117 57 115 76Z"
          fill="url(#neutralLeafGrad2)"
          animate={{ rotate: [0, 3, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
          style={{ transformOrigin: '115px 76px' }}
        />

        {/* ── SUBTLE AMBER DOTS ── */}
        <motion.circle cx="92" cy="152" r="2.5" fill="#fbbf24"
          animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.2, repeat: Infinity }} />
        <motion.circle cx="110" cy="168" r="2" fill="#fbbf24"
          animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.8 }} />

        <defs>
          <radialGradient id="neutralBodyGrad" cx="40%" cy="30%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="55%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </radialGradient>
          <radialGradient id="neutralHeadGrad" cx="40%" cy="30%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
          <linearGradient id="neutralLeafGrad1" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="neutralLeafGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#f59e0b" />
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
        <span className="eco-badge bg-amber-100 text-amber-700 border border-amber-200 shadow-sm">
          ◈ Neutral
        </span>
      </motion.div>
    </motion.div>
  );
}

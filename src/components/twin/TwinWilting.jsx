import React from 'react';
import { motion } from 'framer-motion';

/**
 * Wilting State — Grey-brown plant-spirit, drooping, barely glowing
 * Leaves shriveled, eyes downcast, body dimmer
 */
export default function TwinWilting() {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* Outer glow ring — muted rose */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 210,
          height: 210,
          background: 'radial-gradient(circle, rgba(251,113,133,0.1) 0%, rgba(251,113,133,0.03) 60%, transparent 80%)',
        }}
        animate={{ scale: [1, 1.03, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.svg
        width="200"
        height="230"
        viewBox="0 0 200 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 8px rgba(251,113,133,0.2))' }}
      >
        {/* ── WILTED VINES / ROOTS — drooping ── */}
        <motion.path
          d="M78 200 Q68 192 65 178 Q62 162 68 155"
          stroke="#92400e"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
          animate={{ d: ["M78 200 Q68 192 65 178 Q62 162 68 155", "M78 203 Q66 194 63 180 Q60 164 66 157", "M78 200 Q68 192 65 178 Q62 162 68 155"] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M122 200 Q132 192 135 178 Q138 162 132 155"
          stroke="#92400e"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
          animate={{ d: ["M122 200 Q132 192 135 178 Q138 162 132 155", "M122 203 Q134 194 137 180 Q140 164 134 157", "M122 200 Q132 192 135 178 Q138 162 132 155"] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />

        {/* ── BODY — slightly sunken ── */}
        <motion.ellipse
          cx="100"
          cy="160"
          rx="38"
          ry="44"
          fill="url(#wiltingBodyGrad)"
          animate={{ ry: [44, 45, 44], cy: [160, 161, 160] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <ellipse cx="88" cy="143" rx="8" ry="10" fill="rgba(255,255,255,0.07)" />

        {/* ── HEAD — slightly drooped ── */}
        <motion.circle
          cx="100"
          cy="110"
          r="38"
          fill="url(#wiltingHeadGrad)"
          animate={{ cy: [110, 111.5, 110] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <ellipse cx="88" cy="97" rx="8" ry="9" fill="rgba(255,255,255,0.08)" />

        {/* ── FACE — sad, tired ── */}
        {/* Left eye — half-closed, drooping */}
        <ellipse cx="87" cy="111" rx="6" ry="5" fill="#2d2d2d" />
        <circle cx="89" cy="109" r="1.8" fill="white" opacity="0.7" />
        {/* Drooping eyelid */}
        <path d="M81 109 Q87 107 93 109" stroke="#5c3d2e" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Right eye — half-closed, drooping */}
        <ellipse cx="113" cy="111" rx="6" ry="5" fill="#2d2d2d" />
        <circle cx="115" cy="109" r="1.8" fill="white" opacity="0.7" />
        {/* Drooping eyelid */}
        <path d="M107 109 Q113 107 119 109" stroke="#5c3d2e" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Sad mouth */}
        <path
          d="M91 125 Q100 120 109 125"
          stroke="#2d2d2d"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tired teardrop */}
        <motion.ellipse
          cx="83"
          cy="119"
          rx="1.5"
          ry="2"
          fill="#93c5fd"
          animate={{ cy: [119, 122, 119], opacity: [0, 0.8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
        />

        {/* ── WILTED LEAF CROWN — drooping downward ── */}
        {/* Center leaf — drooping */}
        <motion.path
          d="M100 72 Q93 58 97 44 Q103 55 100 72Z"
          fill="url(#wiltingLeafGrad)"
          animate={{ rotate: [-5, -8, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 72px', opacity: 0.7 }}
        />
        {/* Left leaf — heavily drooped */}
        <motion.path
          d="M84 80 Q68 73 68 60 Q80 66 84 80Z"
          fill="url(#wiltingLeafGrad)"
          animate={{ rotate: [-8, -12, -8] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          style={{ transformOrigin: '84px 80px', opacity: 0.6 }}
        />
        {/* Right leaf — heavily drooped */}
        <motion.path
          d="M116 80 Q132 73 132 60 Q120 66 116 80Z"
          fill="url(#wiltingLeafGrad)"
          animate={{ rotate: [8, 12, 8] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ transformOrigin: '116px 80px', opacity: 0.6 }}
        />
        {/* Fallen leaf — on body */}
        <motion.path
          d="M78 155 Q72 148 76 142 Q80 148 78 155Z"
          fill="#78350f"
          opacity="0.4"
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '78px 155px' }}
        />

        {/* ── DIM spots instead of glow ── */}
        <circle cx="92" cy="158" r="2" fill="#fda4af" opacity="0.2" />
        <circle cx="110" cy="172" r="1.5" fill="#fda4af" opacity="0.15" />

        <defs>
          <radialGradient id="wiltingBodyGrad" cx="40%" cy="30%">
            <stop offset="0%" stopColor="#d1a683" />
            <stop offset="60%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>
          <radialGradient id="wiltingHeadGrad" cx="40%" cy="30%">
            <stop offset="0%" stopColor="#e5b896" />
            <stop offset="50%" stopColor="#c4803a" />
            <stop offset="100%" stopColor="#92400e" />
          </radialGradient>
          <linearGradient id="wiltingLeafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#92400e" />
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
        <span className="eco-badge bg-rose-100 text-rose-700 border border-rose-200 shadow-sm">
          ✦ Wilting
        </span>
      </motion.div>
    </motion.div>
  );
}

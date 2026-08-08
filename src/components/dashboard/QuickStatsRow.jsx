import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Zap, Coins } from 'lucide-react';
import { formatFootprint } from '../../engine/carbonCalc';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

function StatCard({ icon: Icon, label, value, unit, color, bgColor, index }) {
  return (
    <motion.div
      className="stat-card flex-1 min-w-0"
      variants={cardVariants}
      custom={index}
      initial="hidden"
      animate="visible"
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
        style={{ background: bgColor }}
      >
        <Icon size={16} style={{ color }} strokeWidth={2.5} />
      </div>
      <div className="text-lg font-bold font-display leading-none" style={{ color }}>
        {value}
        {unit && <span className="text-xs font-medium text-moss-400 ml-0.5">{unit}</span>}
      </div>
      <div className="text-xs text-moss-400 font-medium mt-0.5 leading-tight">{label}</div>
    </motion.div>
  );
}

export default function QuickStatsRow({ currentScore, rollingAverage, greenCoinsBalance, twinState }) {
  const stateColors = {
    thriving: { color: '#16a34a', bg: '#dcfce7' },
    neutral:  { color: '#d97706', bg: '#fef3c7' },
    wilting:  { color: '#e11d48', bg: '#ffe4e6' },
  };
  const sc = stateColors[twinState] ?? stateColors.neutral;

  return (
    <div className="flex gap-3">
      <StatCard
        icon={Leaf}
        label="Today's CO₂"
        value={currentScore > 0 ? currentScore.toFixed(1) : '—'}
        unit="kg"
        color={sc.color}
        bgColor={sc.bg}
        index={0}
      />
      <StatCard
        icon={Zap}
        label="7-day avg"
        value={rollingAverage > 0 ? rollingAverage.toFixed(1) : '—'}
        unit="kg/day"
        color="#558f49"
        bgColor="#eef2e8"
        index={1}
      />
      <StatCard
        icon={Coins}
        label="Green Coins"
        value={greenCoinsBalance}
        unit=""
        color="#b45309"
        bgColor="#fef3c7"
        index={2}
      />
    </div>
  );
}

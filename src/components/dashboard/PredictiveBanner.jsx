import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Sparkles, TrendingDown, Info, ShieldAlert } from 'lucide-react';
import { predictMoodChange } from '../../engine/emissionForecast';

export default function PredictiveBanner({ habitLog, twinState }) {
  const forecast = predictMoodChange(habitLog, twinState);
  if (!forecast) return null;

  const config = {
    insufficient_data: {
      bg: 'bg-slate-50 border-slate-200 text-slate-700',
      icon: <Info size={16} className="text-slate-500" />,
    },
    stable_good: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <Sparkles size={16} className="text-emerald-600 animate-pulse" />,
    },
    stable_neutral: {
      bg: 'bg-amber-50/70 border-amber-200 text-amber-800',
      icon: <Info size={16} className="text-amber-500" />,
    },
    stable_bad: {
      bg: 'bg-rose-50/70 border-rose-200 text-rose-800',
      icon: <AlertTriangle size={16} className="text-rose-500" />,
    },
    warning_neutral: {
      bg: 'bg-amber-50 border-amber-300 text-amber-800',
      icon: <ShieldAlert size={16} className="text-amber-600 animate-bounce" />,
    },
    warning_wilting: {
      bg: 'bg-rose-50 border-rose-350 text-rose-800',
      icon: <AlertTriangle size={16} className="text-rose-600 animate-bounce" />,
    },
    critical_wilting: {
      bg: 'bg-red-50 border-red-300 text-red-800',
      icon: <AlertTriangle size={16} className="text-red-600 animate-pulse" />,
    },
    recovery_neutral: {
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      icon: <TrendingDown size={16} className="text-indigo-650" />,
    },
    recovery_thriving: {
      bg: 'bg-emerald-50 border-emerald-250 text-emerald-850',
      icon: <TrendingDown size={16} className="text-emerald-700" />,
    },
    peak_thriving: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <Sparkles size={16} className="text-emerald-600" />,
    },
  };

  const currentCfg = config[forecast.status] ?? config.insufficient_data;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-2xl p-3.5 flex items-start gap-3 shadow-xs ${currentCfg.bg}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {currentCfg.icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold leading-relaxed">
          {forecast.message}
        </p>
      </div>
    </motion.div>
  );
}

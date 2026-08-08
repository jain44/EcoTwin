import React from 'react';
import { Globe } from 'lucide-react';

// Static CO₂ per capita per day (kg) — sourced from World Bank / IEA 2023
const GLOBAL_DATA = [
  { label: 'India Avg',  value: 1.9, color: 'bg-blue-400',    textColor: 'text-blue-700'    },
  { label: 'World Avg',  value: 4.7, color: 'bg-purple-400',  textColor: 'text-purple-700'  },
  { label: 'Mumbai Avg', value: 5.5, color: 'bg-amber-400',   textColor: 'text-amber-700'   },
  { label: 'USA Avg',    value: 14.7, color: 'bg-rose-400',   textColor: 'text-rose-700'    },
];

const MAX_VAL = 16; // cap for bar display

export default function GlobalComparison({ rollingAverage }) {
  const userVal = rollingAverage > 0 ? rollingAverage : null;

  const allBars = [
    ...(userVal !== null ? [{ label: 'You 🌱', value: userVal, color: 'bg-forest-500', textColor: 'text-forest-700', isYou: true }] : []),
    ...GLOBAL_DATA,
  ];

  return (
    <div className="eco-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Globe size={16} className="text-forest-700" />
        <h2 className="section-title">How You Compare Globally</h2>
      </div>

      <div className="flex flex-col gap-3">
        {allBars.map(({ label, value, color, textColor, isYou }) => {
          const pct = Math.min(100, (value / MAX_VAL) * 100);
          return (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-semibold ${isYou ? 'text-forest-700 font-bold' : 'text-moss-600'}`}>
                  {label}
                </span>
                <span className={`text-xs font-bold ${textColor}`}>{value.toFixed(1)} kg/day</span>
              </div>
              <div className="w-full h-2.5 bg-cream-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${color} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-moss-400 mt-3 leading-relaxed">
        Source: IEA / World Bank per-capita CO₂ 2023. Mumbai estimate based on WRI India urban transport data.
      </p>
    </div>
  );
}

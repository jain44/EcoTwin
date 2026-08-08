import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getEmissionBreakdown } from '../../engine/carbonCalc';

ChartJS.register(ArcElement, Tooltip, Legend);

const SOURCES = [
  { key: 'commute', label: 'Commute', color: '#3d7235', bg: 'rgba(61,114,53,0.82)' },
  { key: 'diet',    label: 'Diet',    color: '#d97706', bg: 'rgba(217,119,6,0.82)' },
  { key: 'energy',  label: 'Energy',  color: '#e11d48', bg: 'rgba(225,29,72,0.82)' },
];

export default function EmissionSourcesChart({ habitLog }) {
  const last7 = habitLog.slice(-7);
  const totals = { commute: 0, diet: 0, energy: 0 };
  last7.forEach((entry) => {
    const bd = getEmissionBreakdown(entry);
    totals.commute += bd.commute;
    totals.diet    += bd.diet;
    totals.energy  += bd.energy;
  });

  const total = totals.commute + totals.diet + totals.energy;
  const pct = (v) => (total > 0 ? Math.round((v / total) * 100) : 0);

  const chartData = {
    labels: SOURCES.map((s) => s.label),
    datasets: [
      {
        data: SOURCES.map((s) => totals[s.key]),
        backgroundColor: SOURCES.map((s) => s.bg),
        borderColor: SOURCES.map((s) => s.color),
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255,255,255,0.97)',
        titleColor: '#1a2e17',
        bodyColor: '#4d7a42',
        borderColor: 'rgba(61,114,53,0.2)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.toFixed(2)} kg CO₂e`,
        },
      },
    },
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Donut Chart */}
      <div className="relative flex-shrink-0" style={{ width: 120, height: 120 }}>
        <Doughnut data={chartData} options={options} />
        {/* Center label — absolutely positioned inside the donut hole */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
            lineHeight: 1.2,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1a3d14' }}>
            {total.toFixed(1)}
          </div>
          <div style={{ fontSize: 9, color: '#6b8f5a', fontWeight: 500 }}>kg CO₂e</div>
        </div>
      </div>

      {/* Legend & breakdown */}
      <div className="flex flex-col gap-3 flex-1 w-full min-w-0">
        {SOURCES.map(({ key, label, color }) => {
          const value = totals[key];
          const percentage = pct(value);
          const barWidth = `${Math.max(percentage, 2)}%`;
          return (
            <div key={key} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="text-xs text-moss-600 font-medium flex-1">{label}</span>
                <span className="text-xs font-bold" style={{ color }}>
                  {value.toFixed(1)} kg
                </span>
                <span className="text-xs text-moss-300 w-8 text-right font-medium">{percentage}%</span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-cream-100 rounded-full overflow-hidden ml-4">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: barWidth, background: color, opacity: 0.75 }}
                />
              </div>
            </div>
          );
        })}
        <p className="text-[10px] text-moss-300 mt-1 ml-4">
          Based on last {last7.length} day{last7.length !== 1 ? 's' : ''} of logged habits
        </p>
      </div>
    </div>
  );
}

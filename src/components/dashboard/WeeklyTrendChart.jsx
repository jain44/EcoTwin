import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function getBarColor(value) {
  if (value < 3) return 'rgba(74, 222, 128, 0.85)';
  if (value <= 6) return 'rgba(251, 191, 36, 0.85)';
  return 'rgba(251, 113, 133, 0.85)';
}

function formatDayLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'short' });
}

export default function WeeklyTrendChart({ habitLog }) {
  const last7 = habitLog.slice(-7);

  const labels = last7.map((e) => formatDayLabel(e.date));
  const values = last7.map((e) => e.computedFootprintKg ?? 0);
  const colors = values.map(getBarColor);
  const borderColors = values.map((v) =>
    v < 3 ? 'rgba(34,197,94,1)' : v <= 6 ? 'rgba(245,158,11,1)' : 'rgba(244,63,94,1)'
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'kg CO₂e',
        data: values,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1.5,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        titleColor: '#1a2e17',
        bodyColor: '#4d7a42',
        borderColor: 'rgba(61,114,53,0.15)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y.toFixed(2)} kg CO₂e`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: '#7aab68',
          font: { family: 'Inter', size: 11, weight: '500' },
        },
      },
      y: {
        grid: {
          color: 'rgba(61,114,53,0.08)',
          drawBorder: false,
        },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: '#7aab68',
          font: { family: 'Inter', size: 10 },
          maxTicksLimit: 5,
          callback: (v) => `${v}kg`,
        },
        // Threshold lines as annotations... simulated via zero line
        min: 0,
      },
    },
    animation: {
      duration: 800,
      easing: 'easeInOutQuart',
    },
  };

  if (last7.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-moss-300 text-sm">
        No habit data yet — log your first day!
      </div>
    );
  }

  return (
    <div style={{ height: 160, position: 'relative' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { MOCK_USERS } from '../data/seedData';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js';
import { Lock, Users, TreePine, TrendingUp, Building2 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'tcet2026';

const DEPT_NAMES = [
  'Information Technology', 'Civil Engineering', 'Computer Engineering',
  'Electronics & TC', 'Mechanical Engineering', 'AIDS',
  'Chemical Engineering', 'Production Engineering'
];

export default function Admin() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('ecotwin_admin') === 'true');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [allUsers, setAllUsers] = useState(MOCK_USERS);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('ecotwin_admin', 'true');
      setAuthed(true);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  useEffect(() => {
    if (!authed) return;
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = [];
      snapshot.forEach((doc) => usersList.push(doc.data()));
      if (usersList.length > 0) setAllUsers(usersList);
    }, (err) => console.error("Admin Firestore error:", err));
    return unsubscribe;
  }, [authed]);

  // --- Aggregate calculations ---
  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter(u => u.lastActive).length;
  const avgFootprint = allUsers.length
    ? (allUsers.reduce((s, u) => s + (u.rollingAverage ?? 5.5), 0) / allUsers.length).toFixed(2)
    : 0;
  const baselinePerUser = 5.5; // kg/day Mumbai baseline
  const co2PreventedKg = +(allUsers.reduce((s, u) => {
    const prevented = baselinePerUser - (u.rollingAverage ?? 5.5);
    return s + Math.max(0, prevented);
  }, 0) * 7).toFixed(1); // 7-day estimate

  // Department aggregation
  const deptMap = {};
  DEPT_NAMES.forEach(d => { deptMap[d] = { count: 0, totalScore: 0 }; });
  allUsers.forEach(u => {
    const dept = u.department || 'Computer Engineering';
    if (deptMap[dept]) {
      deptMap[dept].count++;
      deptMap[dept].totalScore += (u.rollingAverage ?? 5.5);
    }
  });
  const deptEntries = Object.entries(deptMap).map(([name, d]) => ({
    name,
    avgScore: d.count > 0 ? +(d.totalScore / d.count).toFixed(2) : 5.5,
    adoption: d.count,
  })).sort((a, b) => a.avgScore - b.avgScore);

  // Adoption %
  const adoptionPct = totalUsers > 0 ? Math.min(100, Math.round((activeUsers / totalUsers) * 100)) : 0;

  const chartData = {
    labels: deptEntries.map(d => d.name.replace(' Engineering', '\nEng.')),
    datasets: [
      {
        label: 'Avg CO₂ (kg/day)',
        data: deptEntries.map(d => d.avgScore),
        backgroundColor: deptEntries.map(d =>
          d.avgScore < 3 ? 'rgba(16,185,129,0.7)' :
          d.avgScore <= 6 ? 'rgba(245,158,11,0.7)' : 'rgba(239,68,68,0.7)'
        ),
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} kg CO₂/day avg`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 9,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      }
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-slate-800/80 border border-slate-700/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center mb-6">
            <div className="inline-flex p-4 bg-slate-700 rounded-2xl mb-3">
              <Lock size={24} className="text-slate-300" />
            </div>
            <h1 className="text-xl font-display font-bold text-white">EcoTwin Admin</h1>
            <p className="text-xs text-slate-400 mt-1">Faculty & Judge Access Panel</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              id="admin-password-input"
              className={`w-full bg-slate-900/60 border ${passwordError ? 'border-red-500' : 'border-slate-700'} text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600`}
              placeholder="Enter admin password..."
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              autoFocus
            />
            {passwordError && (
              <p className="text-xs text-red-400 text-center font-semibold">Incorrect password. Try again.</p>
            )}
            <button
              type="submit"
              id="admin-login-btn"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              Access Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-xs text-slate-500 hover:text-slate-300 text-center transition-colors"
            >
              ← Back to Student App
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Building2 size={18} />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">Faculty Dashboard</h1>
          </div>
          <p className="text-sm text-slate-400">EcoTwin Campus Sustainability Analytics · TCET</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { sessionStorage.removeItem('ecotwin_admin'); setAuthed(false); }}
            className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded-xl font-bold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Twins', value: totalUsers, unit: 'students', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
          { label: 'CO₂ Prevented', value: co2PreventedKg, unit: 'kg this week', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Avg Footprint', value: `${avgFootprint}`, unit: 'kg CO₂/day', icon: TreePine, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'App Adoption', value: `${adoptionPct}%`, unit: 'active users', icon: Building2, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
        ].map(({ label, value, unit, icon: Icon, color, bg }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border ${bg} rounded-2xl p-5 backdrop-blur-sm`}
          >
            <Icon size={20} className={`${color} mb-2`} />
            <p className="text-2xl font-display font-extrabold text-white">{value}</p>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{unit}</p>
          </motion.div>
        ))}
      </div>

      {/* Department Performance Chart */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h2 className="text-sm font-bold text-white mb-4">Department Sustainability Rankings</h2>
          <Bar data={chartData} options={chartOptions} height={220} />
        </motion.div>

        {/* Top Performers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h2 className="text-sm font-bold text-white mb-4">🏆 Top Students</h2>
          <div className="flex flex-col gap-2">
            {[...allUsers].sort((a, b) => (a.rollingAverage ?? 99) - (b.rollingAverage ?? 99)).slice(0, 8).map((user, idx) => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}</span>
                  <div>
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[10px] text-slate-400">{user.department ?? 'TCET'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-400">{(user.rollingAverage ?? 5.5).toFixed(2)} kg/d</p>
                  <p className="text-[10px] text-amber-400">🪙 {user.greenCoinsBalance ?? 0}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Department adoption breakdown */}
      <div className="max-w-6xl mx-auto mt-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h2 className="text-sm font-bold text-white mb-4">Department Adoption Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {deptEntries.map(dept => (
              <div key={dept.name} className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/40">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {dept.name.replace(' Engineering', ' Eng.')}
                </p>
                <p className="text-lg font-extrabold text-white">{dept.adoption}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-slate-500">members</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    dept.avgScore < 3 ? 'bg-emerald-500/20 text-emerald-400' :
                    dept.avgScore <= 6 ? 'bg-amber-500/20 text-amber-400' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    {dept.avgScore.toFixed(1)} kg
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

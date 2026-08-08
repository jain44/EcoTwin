import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus, Users, Building2, Home, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_USERS } from '../data/seedData';
import TwinRenderer from '../components/twin/TwinRenderer';
import { getTwinState } from '../engine/carbonCalc';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

const RANK_ICONS = ['🥇', '🥈', '🥉'];

const trendIcon = (trend) => {
  if (trend === 'up') return <TrendingUp size={14} className="text-thriving-600" />;
  if (trend === 'down') return <TrendingDown size={14} className="text-wilting-600" />;
  return <Minus size={14} className="text-moss-400" />;
};

function ScoreBadge({ score }) {
  const state = getTwinState(score);
  const colors = {
    thriving: 'bg-thriving-100 text-thriving-700 border-thriving-200',
    neutral:  'bg-amber-100 text-amber-700 border-amber-200',
    wilting:  'bg-rose-100 text-rose-700 border-rose-200',
  };
  return (
    <span className={`eco-badge border ${colors[state]}`}>
      {score.toFixed(1)} kg/day
    </span>
  );
}

export default function EcoBattles() {
  const { rollingAverage, userProfile, greenCoinsBalance, uid } = useApp();
  const [activeTab, setActiveTab] = useState('dept'); // 'dept' | 'hostel' | 'individual'
  const [allUsers, setAllUsers] = useState(MOCK_USERS); // Default to mock users

  // Firestore Real-time Listener for Leaderboard
  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = [];
      snapshot.forEach((docSnap) => {
        usersList.push(docSnap.data());
      });
      if (usersList.length > 0) {
        setAllUsers(usersList);
      }
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
    });
    return unsubscribe;
  }, []);

  const userName = userProfile?.name ?? 'Student';
  const userScore = rollingAverage > 0 ? +rollingAverage.toFixed(2) : 2.2;

  // Initialize standard departments and hostels to ensure they show up even with 0 members
  const DEPT_NAMES = [
    'Information Technology',
    'Civil Engineering',
    'Computer Engineering',
    'Electronics & TC',
    'Mechanical Engineering',
    'AIDS',
    'Chemical Engineering',
    'Production Engineering'
  ];
  
  const HOSTEL_NAMES = [
    'Hostel A (Ground Block)',
    'Day Scholars (Suburban Mumbai)',
    'Hostel B (Wing East)',
    'Hostel C (Wing West)'
  ];

  const deptsMap = {};
  DEPT_NAMES.forEach(name => {
    deptsMap[name] = { name, category: 'Department', totalScore: 0, count: 0, coins: 0 };
  });

  const hostelsMap = {};
  HOSTEL_NAMES.forEach(name => {
    hostelsMap[name] = { name, category: 'Hostel', totalScore: 0, count: 0, coins: 0 };
  });

  // Aggregate stats from all users
  allUsers.forEach(user => {
    const dept = user.department || 'Computer Engineering';
    const hostel = user.hostel || 'Day Scholars (Suburban Mumbai)';
    const score = user.rollingAverage ?? 5.5;
    const coins = user.greenCoinsBalance ?? 0;

    if (deptsMap[dept]) {
      deptsMap[dept].totalScore += score;
      deptsMap[dept].count += 1;
      deptsMap[dept].coins += coins;
    }
    if (hostelsMap[hostel]) {
      hostelsMap[hostel].totalScore += score;
      hostelsMap[hostel].count += 1;
      hostelsMap[hostel].coins += coins;
    }
  });

  const userDept = userProfile?.department || 'Information Technology';
  const userHostel = userProfile?.hostel || 'Day Scholars (Suburban Mumbai)';

  // 1. Department Leaderboard
  const deptEntries = Object.values(deptsMap).map((d, index) => {
    const avgScore = d.count > 0 ? +(d.totalScore / d.count).toFixed(2) : 5.5;
    return {
      id: `dept-${index}`,
      name: d.name,
      category: d.category,
      avgScore,
      members: d.count,
      coins: d.coins,
      trend: 'same',
      isUser: d.name === userDept,
    };
  }).sort((a, b) => a.avgScore - b.avgScore).map((e, idx) => ({ ...e, rank: idx + 1 }));

  // 2. Hostel Leaderboard
  const hostelEntries = Object.values(hostelsMap).map((h, index) => {
    const avgScore = h.count > 0 ? +(h.totalScore / h.count).toFixed(2) : 5.5;
    return {
      id: `hostel-${index}`,
      name: h.name,
      category: h.category,
      avgScore,
      members: h.count,
      coins: h.coins,
      trend: 'same',
      isUser: h.name === userHostel,
    };
  }).sort((a, b) => a.avgScore - b.avgScore).map((e, idx) => ({ ...e, rank: idx + 1 }));

  // 3. Individual Leaderboard
  const individualEntries = allUsers.map(user => {
    const isCurrentUser = user.id === uid;
    return {
      id: user.id,
      name: isCurrentUser ? userName : user.name,
      branch: user.hostelOrBranch,
      avgScore: isCurrentUser ? userScore : (user.rollingAverage ?? 5.5),
      coins: isCurrentUser ? greenCoinsBalance : (user.greenCoinsBalance ?? 0),
      trend: 'same',
      isUser: isCurrentUser,
    };
  }).sort((a, b) => a.avgScore - b.avgScore).map((e, idx) => ({ ...e, rank: idx + 1 }));

  const activeEntries =
    activeTab === 'dept' ? deptEntries :
    activeTab === 'hostel' ? hostelEntries :
    individualEntries;

  const userDeptEntry = deptEntries.find((e) => e.isUser) ?? deptEntries[0];


  return (
    <div className="page-content pt-4">
      {/* Header */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-forest-900">⚔️ Eco Battles</h1>
        <p className="text-sm text-moss-400 mt-0.5">TCET Department, Hostel & Individual Sustainability Rankings</p>
      </motion.div>

      {/* ── Main EcoBattles Responsive Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* ── Left Column: User Rank & Insights ── */}
        <div className="md:col-span-4 flex flex-col gap-4">
          {/* User rank card */}
          <motion.div
            className="eco-card p-5 border-2 border-forest-300 shadow-sm"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <TwinRenderer state={getTwinState(userScore)} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-moss-400 mb-0.5 font-medium">Your Standing ({userName})</p>
                <p className="text-3xl font-display font-bold text-forest-900">
                  #{userDeptEntry.rank}
                  <span className="text-xs font-normal text-moss-400 ml-1.5">in Departments</span>
                </p>
                <p className="text-xs text-moss-500 truncate mt-0.5">
                  {userProfile?.hostelOrBranch ?? userDeptEntry.name} · {userScore.toFixed(2)} kg/day
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-forest-100 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-forest-700">Department Coin Pool</span>
                <span className="font-extrabold text-amber-600">🪙 {userDeptEntry.coins}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-moss-600">Your Personal Balance</span>
                <span className="font-extrabold text-emerald-700">🪙 {greenCoinsBalance}</span>
              </div>
            </div>
          </motion.div>

          {/* Battle Rules & Info */}
          <motion.div
            className="eco-card p-5 bg-gradient-to-br from-cream-50 to-cream-100"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="section-title mb-2">⚔️ How EcoBattles Work</h3>
            <ul className="text-xs text-moss-600 flex flex-col gap-2 list-disc pl-4 leading-relaxed">
              <li>Separate leaderboards for <strong>Departments</strong>, <strong>Hostels</strong>, and <strong>Individual Students</strong>.</li>
              <li>Lower footprint (kg CO₂e/day) propels your rank to #1!</li>
              <li>Winning branches earn exclusive GreenCoins multipliers and TCET campus perks.</li>
            </ul>
          </motion.div>
        </div>

        {/* ── Right Column: 3-Tab Segmented Leaderboard Table ── */}
        <div className="md:col-span-8 flex flex-col gap-4">
          <div className="eco-card overflow-hidden">
            {/* Header & Tab Selector */}
            <div className="px-5 pt-4 pb-3 border-b border-forest-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="section-title">TCET Sustainability Leaderboards</h2>
                <p className="text-xs text-moss-400 mt-0.5">Lower footprint = higher rank</p>
              </div>

              {/* Segmented Tab Buttons */}
              <div className="flex items-center bg-cream-100 p-1 rounded-2xl border border-forest-100">
                <button
                  id="tab-dept"
                  onClick={() => setActiveTab('dept')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'dept'
                      ? 'bg-white text-forest-900 shadow-xs border border-forest-100'
                      : 'text-moss-500 hover:text-forest-700'
                  }`}
                >
                  <Building2 size={14} />
                  <span>Departments</span>
                </button>
                <button
                  id="tab-hostel"
                  onClick={() => setActiveTab('hostel')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'hostel'
                      ? 'bg-white text-forest-900 shadow-xs border border-forest-100'
                      : 'text-moss-500 hover:text-forest-700'
                  }`}
                >
                  <Home size={14} />
                  <span>Hostels</span>
                </button>
                <button
                  id="tab-individual"
                  onClick={() => setActiveTab('individual')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'individual'
                      ? 'bg-white text-forest-900 shadow-xs border border-forest-100'
                      : 'text-moss-500 hover:text-forest-700'
                  }`}
                >
                  <User size={14} />
                  <span>Individuals</span>
                </button>
              </div>
            </div>

            {/* Leaderboard Entries List */}
            <div className="divide-y divide-forest-50">
              <AnimatePresence mode="wait">
                {activeEntries.map((entry, idx) => (
                  <motion.div
                    key={entry.id}
                    className={`px-5 py-3.5 flex items-center gap-4 transition-colors ${
                      entry.isUser ? 'bg-thriving-50/90 font-bold' : 'hover:bg-cream-50'
                    }`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    {/* Rank */}
                    <div className="w-8 text-center flex-shrink-0">
                      {entry.rank <= 3
                        ? <span className="text-2xl">{RANK_ICONS[entry.rank - 1]}</span>
                        : <span className="text-sm font-bold text-moss-400">#{entry.rank}</span>
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold truncate ${entry.isUser ? 'text-forest-900 font-extrabold' : 'text-forest-900'}`}>
                          {entry.name}
                          {entry.isUser && (
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full ml-1.5">
                              (you)
                            </span>
                          )}
                        </p>
                        {trendIcon(entry.trend)}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <p className="text-xs text-moss-400 truncate">{entry.branch ?? entry.category ?? 'TCET'}</p>
                        {entry.members > 1 && (
                          <span className="flex items-center gap-1 text-xs text-moss-400">
                            <Users size={12} />
                            {entry.members} members
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Score + coins */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <ScoreBadge score={entry.avgScore} />
                      <span className="text-xs text-amber-600 font-bold w-16 text-right">🪙 {entry.coins}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <p className="text-[11px] text-moss-400 text-center">
            🏆 Leaderboards update daily · Lower kg CO₂e/day = higher rank
          </p>
        </div>
      </div>
    </div>
  );
}


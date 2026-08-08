import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { MOCK_USERS } from '../data/seedData';
import TwinRenderer from '../components/twin/TwinRenderer';
import { TreePine, Users, Eye } from 'lucide-react';

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

export default function CampusForest() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList = [];
      snapshot.forEach((doc) => {
        usersList.push(doc.data());
      });
      if (usersList.length > 0) {
        setUsers(usersList);
      }
      setLoading(false);
    }, (error) => {
      console.error("Failed to fetch forest data:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Group users by department
  const groupedUsers = {};
  DEPT_NAMES.forEach(dept => {
    groupedUsers[dept] = [];
  });

  users.forEach(user => {
    const dept = user.department || 'Computer Engineering';
    if (groupedUsers[dept]) {
      groupedUsers[dept].push(user);
    } else {
      // Fallback fallback
      groupedUsers['Computer Engineering'].push(user);
    }
  });

  // Calculate totals
  const totalPlants = users.length;
  const thrivingCount = users.filter(u => (u.rollingAverage ?? 5.5) < 3.0).length;
  const neutralCount = users.filter(u => {
    const avg = u.rollingAverage ?? 5.5;
    return avg >= 3.0 && avg <= 6.0;
  }).length;
  const wiltingCount = users.filter(u => (u.rollingAverage ?? 5.5) > 6.0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-950 via-forest-900 to-emerald-950 text-white p-6 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TreePine size={24} className="text-emerald-400" />
            <h1 className="text-3xl font-display font-extrabold text-white tracking-wide">
              TCET Campus Forest
            </h1>
          </div>
          <p className="text-sm text-emerald-300/80">
            Real-time collective visualization of all college students' digital twin plants.
          </p>
        </div>

        {/* Forest Status Board */}
        <div className="flex flex-wrap gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3">
          <div className="px-3 py-1 bg-white/5 rounded-xl text-center">
            <span className="text-lg font-extrabold text-emerald-300">{totalPlants}</span>
            <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Total Twins</p>
          </div>
          <div className="px-3 py-1 bg-emerald-500/10 rounded-xl text-center">
            <span className="text-lg font-extrabold text-emerald-400">🌳 {thrivingCount}</span>
            <p className="text-[10px] text-emerald-400/80 uppercase font-bold tracking-wider">Thriving</p>
          </div>
          <div className="px-3 py-1 bg-amber-500/10 rounded-xl text-center">
            <span className="text-lg font-extrabold text-amber-400">🌱 {neutralCount}</span>
            <p className="text-[10px] text-amber-400/80 uppercase font-bold tracking-wider">Neutral</p>
          </div>
          <div className="px-3 py-1 bg-rose-500/10 rounded-xl text-center">
            <span className="text-lg font-extrabold text-rose-400">🍂 {wiltingCount}</span>
            <p className="text-[10px] text-rose-400/80 uppercase font-bold tracking-wider">Wilting</p>
          </div>
          <div className="hidden lg:flex px-3 py-1 items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl">
            <Eye size={14} className="text-indigo-400 animate-pulse" />
            <span className="text-xs text-indigo-300 font-bold">Public View</span>
          </div>
        </div>
      </div>

      {/* Grid of Department Plots */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {DEPT_NAMES.map((dept, deptIdx) => {
          const deptUsers = groupedUsers[dept] || [];
          const averageScore = deptUsers.length > 0
            ? (deptUsers.reduce((sum, u) => sum + (u.rollingAverage ?? 5.5), 0) / deptUsers.length).toFixed(2)
            : '5.50';

          return (
            <motion.div
              key={dept}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: deptIdx * 0.08 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-5 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300 group hover:shadow-[0_8px_30px_rgb(16,185,129,0.05)]"
            >
              <div>
                {/* Department Info Header */}
                <div className="flex justify-between items-start mb-3 border-b border-white/5 pb-2">
                  <div>
                    <h2 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {dept}
                    </h2>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-white/50">
                      <Users size={12} />
                      <span>{deptUsers.length} members</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Avg Score</span>
                    <span className="text-xs font-extrabold text-emerald-400">{averageScore} kg/d</span>
                  </div>
                </div>

                {/* organic layout grid of plant twins */}
                {deptUsers.length === 0 ? (
                  <div className="h-40 flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                    <span className="text-xs text-white/30 italic">No plants sprouted yet</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-y-6 gap-x-2 items-center justify-center p-2 min-h-40 bg-white/[0.01] rounded-2xl border border-white/5">
                    {deptUsers.map((user, idx) => {
                      const score = user.rollingAverage ?? 5.5;
                      const mood = score < 3.0 ? 'thriving' : score <= 6.0 ? 'neutral' : 'wilting';

                      return (
                        <motion.div
                          key={user.id}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 20,
                            delay: idx * 0.05 + 0.1
                          }}
                          className="flex flex-col items-center justify-center relative group/plant cursor-pointer"
                        >
                          <div className="scale-90 -my-6 transition-transform group-hover/plant:scale-105 duration-200">
                            <TwinRenderer state={mood} size="xs" />
                          </div>

                          {/* Name label below */}
                          <span className="text-[8px] text-white/40 font-semibold mt-7 truncate max-w-[56px] text-center leading-tight">
                            {user.name.split(' ')[0]}
                          </span>

                          {/* Hover Tooltip — fixed position via group-hover, above the plant */}
                          <div className="absolute bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2 bg-slate-900/95 border border-emerald-500/40 text-white px-3 py-2 rounded-xl shadow-2xl text-[10px] whitespace-nowrap opacity-0 group-hover/plant:opacity-100 pointer-events-none transition-all duration-150 z-[200]">
                            <p className="font-bold text-white mb-0.5">{user.name}</p>
                            <p className="text-emerald-300">{score.toFixed(2)} kg CO₂/day</p>
                            <p className="text-amber-400">🪙 {user.greenCoinsBalance ?? 0} coins</p>
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900/95" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Card Footer Status indicator */}
              {deptUsers.length > 0 && (
                <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-white/50">
                  <span>Plot Health</span>
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Thriving" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Neutral" />
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Wilting" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

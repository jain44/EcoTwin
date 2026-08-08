import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Trophy, Flame, Leaf, ArrowLeft, CheckCircle2, Clock, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getWeekStart() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function dateStr(d) {
  return d.toISOString().split('T')[0];
}

function getThisWeekLogs(habitLog) {
  const weekStart = dateStr(getWeekStart());
  return habitLog.filter((e) => e.date >= weekStart);
}

function getDaysLeftInWeek() {
  const day = new Date().getDay();
  return day === 0 ? 0 : 7 - day; // Sunday = 0 left
}

// ── Challenge Definitions ─────────────────────────────────────────────────────

const CHALLENGES = [
  {
    id: 'no_meat_week',
    title: 'No-Meat Week',
    description: 'Log vegan or vegetarian meals every day this week. Switching just 1 meal saves ~2.4 kg CO₂!',
    icon: '🥦',
    reward: 500,
    gradientBar: 'from-emerald-400 to-green-500',
    gradientCard: 'from-emerald-50 to-green-50',
    border: 'border-emerald-200',
    textColor: 'text-emerald-700',
    check: (logs) => {
      const done = logs.filter((e) => e.dietType === 'vegan' || e.dietType === 'veg').length;
      return { done: Math.min(done, 7), total: 7 };
    },
  },
  {
    id: 'zero_car_week',
    title: 'Zero-Car Week',
    description: 'Only use train, bus, walk or cycle this week. No car or petrol bike allowed!',
    icon: '🚆',
    reward: 400,
    gradientBar: 'from-blue-400 to-indigo-500',
    gradientCard: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    textColor: 'text-blue-700',
    check: (logs) => {
      const done = logs.filter((e) =>
        ['train', 'bus', 'walk', 'cycle'].includes(e.commuteMode)
      ).length;
      return { done: Math.min(done, 7), total: 7 };
    },
  },
  {
    id: 'low_energy_week',
    title: 'Low-Energy Week',
    description: 'Keep appliance/AC usage under 3 hours every day this week. Every kWh counts!',
    icon: '💡',
    reward: 300,
    gradientBar: 'from-amber-400 to-yellow-500',
    gradientCard: 'from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    textColor: 'text-amber-700',
    check: (logs) => {
      const done = logs.filter((e) => (e.energyUsageHours ?? 0) < 3).length;
      return { done: Math.min(done, 7), total: 7 };
    },
  },
  {
    id: 'green_streak',
    title: 'Log Every Day',
    description: 'Open the app and log your habits 7 days in a row. Consistency is the real superpower.',
    icon: '🔥',
    reward: 350,
    gradientBar: 'from-rose-400 to-pink-500',
    gradientCard: 'from-rose-50 to-pink-50',
    border: 'border-rose-200',
    textColor: 'text-rose-700',
    check: (logs) => {
      const uniqueDays = new Set(logs.map((e) => e.date)).size;
      return { done: Math.min(uniqueDays, 7), total: 7 };
    },
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Challenges() {
  const navigate = useNavigate();
  const { habitLog } = useApp();

  const weekLogs = useMemo(() => getThisWeekLogs(habitLog), [habitLog]);
  const daysLeft = getDaysLeftInWeek();
  const weekStart = getWeekStart();
  const weekLabel = weekStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  const totalReward = CHALLENGES.reduce((s, c) => s + c.reward, 0);
  const completedCount = CHALLENGES.filter((c) => {
    const { done, total } = c.check(weekLogs);
    return done >= total;
  }).length;

  return (
    <div className="page-content pt-4 pb-12">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-ghost text-sm -ml-1 flex items-center gap-1 mb-3"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-display font-bold text-forest-900 flex items-center gap-2">
              <Target size={24} className="text-forest-600" />
              Weekly Challenges
            </h1>
            <p className="text-sm text-moss-400 mt-0.5">
              Week of {weekLabel} · <span className="font-semibold text-forest-600">{daysLeft} days left this week</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
              <Trophy size={14} className="text-amber-500" />
              <span className="text-xs font-bold text-amber-800">🪙 {totalReward + 200} coins at stake</span>
            </div>
            <span className="text-[10px] text-moss-400 font-medium">{completedCount}/4 completed</span>
          </div>
        </div>
      </motion.div>

      {/* ── All-complete banner ── */}
      {completedCount === 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-5 flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-forest-600 text-white rounded-2xl p-4 shadow-md"
        >
          <Star size={22} className="fill-yellow-300 text-yellow-300 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">Perfect Week! All 4 challenges completed 🎉</p>
            <p className="text-xs opacity-85 mt-0.5">+200 bonus coins awarded at end of week on top of individual rewards.</p>
          </div>
        </motion.div>
      )}

      {/* ── Challenge Cards ── */}
      <div className="flex flex-col gap-4">
        {CHALLENGES.map((challenge, i) => {
          const { done, total } = challenge.check(weekLogs);
          const pct = Math.min(100, Math.round((done / total) * 100));
          const completed = done >= total;

          return (
            <motion.div
              key={challenge.id}
              className={`eco-card overflow-hidden border ${challenge.border}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {/* Top accent bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${challenge.gradientBar}`} />

              <div className="p-5">
                {/* Title row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${challenge.gradientCard} border ${challenge.border} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {challenge.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-forest-900 text-base leading-tight">{challenge.title}</h3>
                        {completed && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 size={10} /> DONE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-moss-500 mt-0.5 leading-relaxed">{challenge.description}</p>
                    </div>
                  </div>

                  {/* Reward */}
                  <div className="flex items-center gap-1 bg-forest-50 border border-forest-200 rounded-full px-2.5 py-1 flex-shrink-0">
                    <span className="text-sm">🪙</span>
                    <span className="text-xs font-bold text-forest-700">+{challenge.reward}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-moss-500 font-medium">Progress this week</span>
                    <span className="text-xs font-bold text-forest-700">{done} / {total} days</span>
                  </div>
                  <div className="w-full h-3 bg-cream-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${challenge.gradientBar}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 + i * 0.08 }}
                    />
                  </div>
                </div>

                {/* Status pill */}
                {completed ? (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-3 py-2">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    <span className="text-xs font-bold">Challenge completed! Coins will be credited at week end. 🎉</span>
                  </div>
                ) : weekLogs.length === 0 ? (
                  <div className="flex items-center gap-2 bg-cream-50 border border-forest-100 text-moss-600 rounded-xl px-3 py-2">
                    <Clock size={14} className="flex-shrink-0" />
                    <span className="text-xs font-medium">Log today's habits to start tracking this challenge.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-forest-50 border border-forest-100 text-forest-700 rounded-xl px-3 py-2">
                    <Flame size={14} className="text-amber-500 flex-shrink-0" />
                    <span className="text-xs font-medium">
                      {total - done} more qualifying {total - done === 1 ? 'day' : 'days'} needed — keep it up!
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── How it works ── */}
      <motion.div
        className="mt-6 eco-card p-4 bg-forest-50 border border-forest-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-start gap-2">
          <Leaf size={14} className="text-forest-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-forest-700 leading-relaxed">
            <strong>How it works:</strong> Challenges reset every Monday. Your habit logs from Mon–Sun count automatically — no extra steps needed. Complete all 4 challenges in a single week to earn a <strong>+200 bonus coin jackpot</strong> on top of individual rewards!
          </p>
        </div>
      </motion.div>
    </div>
  );
}

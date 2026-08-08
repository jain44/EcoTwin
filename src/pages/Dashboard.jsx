import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Info, ShieldCheck, ShieldAlert, ShieldX, ChevronDown, ChevronUp, Share2, Target, TreePine, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TwinRenderer from '../components/twin/TwinRenderer';
import QuickStatsRow from '../components/dashboard/QuickStatsRow';
import WeeklyTrendChart from '../components/dashboard/WeeklyTrendChart';
import EmissionSourcesChart from '../components/dashboard/EmissionSourcesChart';
import AchievementBadges from '../components/dashboard/AchievementBadges';
import EcoShareCard from '../components/dashboard/EcoShareCard';
import { EMISSION_SOURCES } from '../engine/carbonCalc';
import TwinSpeechBubble from '../components/twin/TwinSpeechBubble';
import { generateTwinMessage } from '../services/twinAI';
import PredictiveBanner from '../components/dashboard/PredictiveBanner';

export default function Dashboard() {
  const navigate = useNavigate();
  const [trustOpen, setTrustOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [twinMessage, setTwinMessage] = useState('');
  const [isAI, setIsAI] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const {
    uid,
    userProfile,
    habitLog,
    twinState,
    dominantTrait,
    rollingAverage,
    currentScore,
    greenCoinsBalance,
    todayEntry,
    trustData,
  } = useApp();

  useEffect(() => {
    let active = true;
    const fetchTwinMessage = async () => {
      if (!uid) return;
      setAiLoading(true);
      const res = await generateTwinMessage(uid, habitLog, twinState, dominantTrait);
      if (active) {
        setTwinMessage(res.message);
        setIsAI(res.isAI);
        setAiLoading(false);
      }
    };
    fetchTwinMessage();
    return () => {
      active = false;
    };
  }, [uid, twinState, dominantTrait, habitLog]);

  const firstName = userProfile?.name?.split(' ')[0] ?? 'Student';
  const hasToday = !!todayEntry;
  const dayStreak = Math.min(habitLog.length, 7);

  // Cumulative impact calculations
  const totalDays = habitLog.length;
  const baselineEmissions = totalDays * 5.5; // Avg Mumbai student baseline 5.5 kg/day
  const userTotalEmissions = habitLog.reduce((s, e) => s + (e.computedFootprintKg ?? 0), 0);
  const co2PreventedKg = Math.max(0, +(baselineEmissions - userTotalEmissions).toFixed(1));
  const treesPlantedEquiv = +(co2PreventedKg / 21).toFixed(1); // 1 tree absorbs ~21kg CO2/yr

  // Dynamic Personalized Tip based on dominant trait
  const DYNAMIC_TIPS = {
    commute: {
      title: '🚲 Commute Insight',
      tip: 'Taking the Mumbai Local train or cycling saves up to 2.4 kg CO₂ daily compared to cabs or petrol bikes.',
    },
    diet: {
      title: '🥗 Diet Insight',
      tip: 'Swapping 1 non-veg meal for a plant-based meal saves ~2.6 kg CO₂e — the biggest single-meal impact you can make!',
    },
    energy: {
      title: '💡 Energy Insight',
      tip: 'Switching off hostel AC/heater 2 hours earlier saves ~0.5 kWh, cutting your daily footprint by ~0.4 kg CO₂e.',
    },
  };
  const activeTip = DYNAMIC_TIPS[dominantTrait] ?? DYNAMIC_TIPS.diet;

  return (
    <div className="page-content pt-4">
      {/* ── Mobile/Tablet Top Greeting Banner ── */}
      <motion.div
        className="flex items-center justify-between mb-5 md:mb-6"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <p className="text-xs text-moss-400 font-medium mb-0.5">Welcome back,</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-forest-900">{firstName} 👋</h1>
          <p className="text-xs text-moss-400 mt-0.5">{userProfile?.hostelOrBranch}</p>
        </div>
        <div className="flex items-center gap-2">
          {dayStreak > 0 && (
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
              <span className="text-sm">🔥</span>
              <span className="text-xs font-bold text-amber-700">{dayStreak} day streak</span>
            </div>
          )}

          <button
            onClick={() => setShareOpen(true)}
            className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs hover:bg-emerald-100 transition-colors shadow-sm"
            aria-label="Share Eco Card"
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>

          <button
            onClick={() => navigate('/about')}
            className="text-moss-400 hover:text-forest-600 transition-colors p-1"
            aria-label="About EcoTwin"
          >
            <Info size={18} />
          </button>
        </div>
      </motion.div>

      {/* ── Main Dashboard Responsive Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* ── Left Column: Twin Avatar & Quick Stats ── */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {/* Twin Visualization */}
          <motion.div
            className="eco-card overflow-hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="pt-5 pb-2 flex flex-col items-center">
              <TwinSpeechBubble message={twinMessage} isAI={isAI} isLoading={aiLoading} />
              <TwinRenderer state={twinState} dominantTrait={dominantTrait} size="lg" />
            </div>

            {/* Score bar */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-moss-500">7-day rolling avg</span>
                <span className="text-xs font-bold text-forest-700">
                  {rollingAverage > 0 ? `${rollingAverage.toFixed(2)} kg CO₂e/day` : 'No data yet'}
                </span>
              </div>
              <div className="w-full bg-cream-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: twinState === 'thriving'
                      ? 'linear-gradient(90deg, #16a34a, #4ade80)'
                      : twinState === 'neutral'
                      ? 'linear-gradient(90deg, #d97706, #fbbf24)'
                      : 'linear-gradient(90deg, #e11d48, #fb7185)',
                    maxWidth: '100%',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((rollingAverage / 9) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-thriving-600 font-medium">Thriving &lt;3kg</span>
                <span className="text-[10px] text-neutral-600 font-medium">Neutral 3–6kg</span>
                <span className="text-[10px] text-wilting-600 font-medium">Wilting &gt;6kg</span>
              </div>
            </div>
          </motion.div>

          <PredictiveBanner habitLog={habitLog} twinState={twinState} />

          {/* Quick Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <QuickStatsRow
              currentScore={currentScore}
              rollingAverage={rollingAverage}
              greenCoinsBalance={greenCoinsBalance}
              twinState={twinState}
            />
          </motion.div>

          {/* Log Today CTA */}
          <motion.button
            className="w-full btn-primary flex items-center justify-center gap-2 py-4"
            onClick={() => navigate('/log')}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileTap={{ scale: 0.97 }}
            id="log-habits-btn"
          >
            <Plus size={20} strokeWidth={2.5} />
            {hasToday ? 'Update Today\'s Habits' : 'Log Today\'s Habits'}
            {!hasToday && (
              <span className="ml-1 w-2 h-2 rounded-full bg-thriving-300 animate-pulse" />
            )}
          </motion.button>

          {/* ── Real Cumulative Impact Counter Card ── */}
          <motion.div
            className="eco-card p-5 bg-gradient-to-br from-emerald-500/10 via-forest-50 to-cream-50 border border-emerald-200"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <TreePine size={18} className="text-emerald-700" />
              <h3 className="section-title text-emerald-800">Your Real Environmental Impact</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100 text-center">
                <p className="text-2xl font-display font-extrabold text-emerald-700">
                  {co2PreventedKg} <span className="text-xs font-normal">kg</span>
                </p>
                <p className="text-[10px] text-moss-500 font-semibold uppercase mt-0.5">CO₂ Prevented</p>
              </div>
              <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100 text-center">
                <p className="text-2xl font-display font-extrabold text-forest-800">
                  🌳 {treesPlantedEquiv}
                </p>
                <p className="text-[10px] text-moss-500 font-semibold uppercase mt-0.5">Tree Equiv.</p>
              </div>
            </div>
          </motion.div>

          {/* ── Trust / Integrity Score Badge ── */}
          {habitLog.length >= 3 && (() => {
            const statusConfig = {
              trusted:    { Icon: ShieldCheck, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', label: 'Trusted', bar: 'bg-emerald-500' },
              caution:    { Icon: ShieldAlert, bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   label: 'Caution',  bar: 'bg-amber-400' },
              suspicious: { Icon: ShieldX,     bg: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-700',    label: 'Flagged',  bar: 'bg-rose-500' },
            };
            const cfg = statusConfig[trustData.status] ?? statusConfig.trusted;
            const { Icon } = cfg;
            return (
              <motion.div
                className={`eco-card border ${cfg.border} ${cfg.bg} overflow-hidden`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                <button
                  className="w-full flex items-center justify-between gap-3 p-3.5 text-left"
                  onClick={() => setTrustOpen((v) => !v)}
                  aria-expanded={trustOpen}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={18} className={cfg.text} />
                    <div>
                      <p className={`text-xs font-extrabold ${cfg.text} leading-tight`}>
                        Integrity Score — {cfg.label}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-24 h-1.5 bg-white/70 rounded-full overflow-hidden border border-white">
                          <motion.div
                            className={`h-full rounded-full ${cfg.bar}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${trustData.score}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                        <span className={`text-[11px] font-bold ${cfg.text}`}>{trustData.score}/100</span>
                        <span className={`text-[10px] ${cfg.text} opacity-70`}>· {(trustData.multiplier * 100).toFixed(0)}% coin rate</span>
                      </div>
                    </div>
                  </div>
                  {trustOpen ? <ChevronUp size={14} className={cfg.text} /> : <ChevronDown size={14} className={cfg.text} />}
                </button>

                <AnimatePresence>
                  {trustOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3.5 pt-0 flex flex-col gap-2 border-t border-white/60">
                        {trustData.flags.length === 0 ? (
                          <p className="text-[11px] text-emerald-700 font-medium pt-2">
                            ✅ No suspicious patterns detected. Keep it real!
                          </p>
                        ) : (
                          trustData.flags.map((flag) => (
                            <div key={flag.code} className="flex items-start gap-2 pt-2">
                              <span className="text-xs mt-0.5">{flag.severity === 'high' ? '🔴' : flag.severity === 'medium' ? '🟡' : '🟢'}</span>
                              <p className="text-[11px] text-rose-700 font-medium leading-tight">{flag.message}</p>
                            </div>
                          ))
                        )}
                        <p className="text-[10px] text-moss-400 mt-1 leading-relaxed">
                          Coin earnings are automatically adjusted based on your integrity score. Consistent realistic variation improves your rate.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })()}
        </div>

        {/* ── Right Column: Charts, Achievements & Analytics ── */}
        <div className="md:col-span-7 flex flex-col gap-4">
          {/* Personalized Eco Tip */}
          <motion.div
            className="eco-card p-4 bg-gradient-to-r from-forest-700 to-forest-800 text-white"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-1 text-emerald-300 font-bold text-xs">
              <Sparkles size={14} />
              <span>{activeTip.title}</span>
            </div>
            <p className="text-xs text-forest-100 leading-relaxed font-medium">
              {activeTip.tip}
            </p>
          </motion.div>

          {/* Achievement Badges Section */}
          <motion.div
            className="eco-card p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.32 }}
          >
            <AchievementBadges habitLog={habitLog} />
          </motion.div>

          {/* Weekly Trend */}
          {habitLog.length > 0 && (
            <motion.div
              className="eco-card p-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <h2 className="section-title mb-3">Weekly Carbon Emission Trend</h2>
              <WeeklyTrendChart habitLog={habitLog} />
            </motion.div>
          )}

          {/* Emission Sources */}
          {habitLog.length > 0 && (
            <motion.div
              className="eco-card p-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <h2 className="section-title mb-3">Emission Sources (7-day Breakdown)</h2>
              <EmissionSourcesChart habitLog={habitLog} />
            </motion.div>
          )}

          {/* Data Sources Citation */}
          <motion.div
            className="eco-card p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <h2 className="section-title mb-3">📊 Verified Emission Factors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(EMISSION_SOURCES).map(([key, src]) => (
                <div key={key} className="flex items-start gap-2 bg-cream-50 p-2.5 rounded-xl border border-forest-50">
                  <span className="text-[10px] font-bold text-forest-700 uppercase bg-forest-100 border border-forest-200 rounded px-1.5 py-0.5 flex-shrink-0 mt-0.5">
                    {key}
                  </span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-moss-600 hover:text-forest-800 hover:underline transition-colors font-medium"
                  >
                    {src.label}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Share Card Modal */}
      <AnimatePresence>
        {shareOpen && (
          <EcoShareCard
            userProfile={userProfile}
            twinState={twinState}
            rollingAverage={rollingAverage}
            greenCoinsBalance={greenCoinsBalance}
            habitLog={habitLog}
            onClose={() => setShareOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useApp } from '../context/AppContext';
import TwinRenderer from '../components/twin/TwinRenderer';
import { Leaf, Swords, Coins, TreePine, QrCode, Zap, ArrowRight, ShieldCheck, ChevronDown } from 'lucide-react';

const FEATURES = [
  {
    icon: <Leaf size={20} className="text-emerald-600" />,
    title: 'Living Eco-Twin',
    desc: 'Your avatar evolves in real-time — from a wilting sprout to a thriving guardian — based on your daily habits.',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-100',
  },
  {
    icon: <Swords size={20} className="text-violet-600" />,
    title: 'EcoBattles',
    desc: 'Compete with your department on a live sustainability leaderboard. Lower carbon = higher rank.',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    iconBg: 'bg-violet-100',
  },
  {
    icon: <Coins size={20} className="text-amber-600" />,
    title: 'GreenCoins Rewards',
    desc: 'Earn coins for eco-habits. Redeem for real campus perks — canteen discounts, library passes & more.',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconBg: 'bg-amber-100',
  },
  {
    icon: <TreePine size={20} className="text-green-700" />,
    title: 'Campus Forest',
    desc: 'A shared real-time garden that grows as the entire student body logs green habits together.',
    bg: 'bg-green-50',
    border: 'border-green-100',
    iconBg: 'bg-green-100',
  },
  {
    icon: <QrCode size={20} className="text-sky-600" />,
    title: 'QR Verified Logging',
    desc: 'Scan physical QR codes at campus stations to verify habits and earn bonus coins.',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    iconBg: 'bg-sky-100',
  },
  {
    icon: <ShieldCheck size={20} className="text-rose-600" />,
    title: 'Integrity Engine',
    desc: 'Built-in anomaly detection prevents gaming the system — only authentic habits earn rewards.',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    iconBg: 'bg-rose-100',
  },
];

const STATS = [
  { value: '5+', label: 'Twin Stages' },
  { value: '15+', label: 'Rewards' },
  { value: '8', label: 'Departments' },
  { value: '100%', label: 'Real Data' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { hasOnboarded, authReady } = useApp();
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, -40]);

  useEffect(() => {
    if (authReady && hasOnboarded) {
      navigate('/dashboard', { replace: true });
    }
  }, [authReady, hasOnboarded, navigate]);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
            <Leaf size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <p className="text-emerald-600 text-xs font-bold tracking-widest uppercase">Loading…</p>
        </motion.div>
      </div>
    );
  }

  if (hasOnboarded) return null;

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* Top Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm">
            <Leaf size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-extrabold text-lg text-gray-900 tracking-tight">
            Eco<span className="text-emerald-500">Twin</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/campus-forest')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-600 transition-colors px-3 py-1.5"
          >
            <TreePine size={14} />
            <span>Live Forest</span>
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-200"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative flex flex-col items-center text-center px-4 pt-16 pb-10">
        {/* Green gradient bg blob */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-white to-white pointer-events-none" />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative flex flex-col items-center gap-5 max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full"
          >
            <Zap size={12} />
            PixxelHack 2.0 · TCET Mumbai Hackathon
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold leading-tight tracking-tight text-gray-900"
          >
            Your Campus
            <br />
            <span className="text-emerald-500">Carbon Twin</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl"
          >
            EcoTwin turns every commute, meal, and energy choice into a living digital creature.
            Log habits, earn GreenCoins, and compete with your department — all in real time.
          </motion.p>

          {/* Twin showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, type: 'spring', damping: 14 }}
            className="flex items-end justify-center gap-8 my-2"
          >
            {['wilting', 'neutral', 'thriving'].map((state, i) => (
              <motion.div
                key={state}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`flex flex-col items-center gap-1.5 ${i === 1 ? 'scale-125 z-10' : 'opacity-50 scale-90'}`}
              >
                <TwinRenderer state={state} size={i === 1 ? 'lg' : 'sm'} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  state === 'thriving' ? 'text-emerald-600' :
                  state === 'wilting' ? 'text-rose-500' : 'text-amber-500'
                }`}>
                  {state}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-3 mt-2"
          >
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-200 hover:-translate-y-0.5"
            >
              <span>Start for Free</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/campus-forest')}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3.5 rounded-2xl text-sm transition-all"
            >
              <TreePine size={16} className="text-emerald-500" />
              <span>View Live Campus Forest</span>
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative mt-10 text-gray-300"
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="py-10 px-4 border-y border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-3xl font-display font-extrabold text-emerald-500">{value}</p>
              <p className="text-xs text-gray-400 font-semibold mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-3 block">How it Works</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-gray-900">Log once. Watch your twin evolve.</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', icon: '📝', title: 'Log Daily Habits', desc: 'Tell EcoTwin your commute, meals, and energy use each day — takes under 60 seconds.' },
              { step: '02', icon: '🌱', title: 'Your Twin Reacts', desc: 'Your avatar changes in real-time — thrive with green choices or wilt under heavy emissions.' },
              { step: '03', icon: '🏆', title: 'Compete & Earn', desc: 'Climb the EcoBattles leaderboard and redeem GreenCoins for real campus perks.' },
            ].map(({ step, icon, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-white border border-gray-100 rounded-3xl p-6 text-center hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all group shadow-sm"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
                <span className="absolute top-4 right-4 text-[10px] font-bold text-gray-200">{step}</span>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-3 block">Features</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-gray-900">Built for TCET. Powered by real data.</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon, title, desc, bg, border, iconBg }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`${bg} border ${border} rounded-3xl p-5 hover:-translate-y-1 transition-all duration-300 shadow-sm`}
              >
                <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
                  {icon}
                </div>
                <h3 className="font-bold text-gray-800 text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-emerald-500 rounded-3xl p-10 shadow-xl shadow-emerald-200"
        >
          <div className="text-5xl mb-4">🌱</div>
          <h2 className="text-3xl font-display font-extrabold text-white mb-3">Ready to meet your Twin?</h2>
          <p className="text-sm text-emerald-100 mb-6 leading-relaxed">
            Join TCET students making sustainability personal, gamified, and actually fun.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 bg-white text-emerald-600 font-extrabold py-4 px-8 rounded-2xl text-sm transition-all hover:bg-emerald-50 shadow-sm"
          >
            <span>Create Your EcoTwin — It's Free</span>
            <ArrowRight size={16} />
          </button>
          <p className="text-[11px] text-emerald-200 mt-3">No credit card · No questionnaire · Just sign in</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Leaf size={12} className="text-emerald-600" />
          </div>
          <span className="text-sm font-bold text-gray-400">EcoTwin</span>
        </div>
        <p className="text-xs text-gray-300">Built with ❤️ for a Greener Planet · PixxelHack 2.0 · TCET Mumbai</p>
      </footer>
    </div>
  );
}

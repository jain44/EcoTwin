import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useApp } from '../context/AppContext';
import TwinRenderer from '../components/twin/TwinRenderer';
import { Leaf, Swords, Coins, TreePine, QrCode, Zap, ArrowRight, ShieldCheck, ChevronDown } from 'lucide-react';

const FEATURES = [
  {
    icon: <Leaf size={22} className="text-emerald-400" />,
    title: 'Living Eco-Twin',
    desc: 'Your digital avatar evolves in real-time — from a wilting sprout to a thriving guardian tree — based on your daily habits.',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: <Swords size={22} className="text-violet-400" />,
    title: 'EcoBattles',
    desc: 'Compete with your department and hostel on a live sustainability leaderboard. Lower your carbon = higher your rank.',
    gradient: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: <Coins size={22} className="text-amber-400" />,
    title: 'GreenCoins Rewards',
    desc: 'Earn coins every day for eco habits. Redeem them for real campus perks — canteen discounts, library passes & more.',
    gradient: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: <TreePine size={22} className="text-green-400" />,
    title: 'Campus Forest',
    desc: 'A shared real-time garden that grows as the entire student body logs green habits together.',
    gradient: 'from-green-500/20 to-emerald-500/10',
    border: 'border-green-500/20',
  },
  {
    icon: <QrCode size={22} className="text-sky-400" />,
    title: 'QR Verified Logging',
    desc: 'Scan physical QR codes at campus sustainability stations to verify and earn bonus coins.',
    gradient: 'from-sky-500/20 to-blue-500/10',
    border: 'border-sky-500/20',
  },
  {
    icon: <ShieldCheck size={22} className="text-rose-400" />,
    title: 'Integrity Engine',
    desc: 'Built-in anomaly detection prevents gaming the system — only authentic habits earn rewards.',
    gradient: 'from-rose-500/20 to-pink-500/10',
    border: 'border-rose-500/20',
  },
];

const STATS = [
  { value: '5', suffix: '+', label: 'Twin Stages' },
  { value: '15', suffix: '+', label: 'Rewards to Redeem' },
  { value: '8', suffix: '', label: 'Departments Racing' },
  { value: '100', suffix: '%', label: 'Real Emission Data' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { hasOnboarded, authReady } = useApp();
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, -60]);

  // Wait for auth, then redirect if already signed in
  useEffect(() => {
    if (authReady && hasOnboarded) {
      navigate('/dashboard', { replace: true });
    }
  }, [authReady, hasOnboarded, navigate]);

  // Full-screen auth loading — prevents landing page flash for logged-in users
  if (!authReady) {
    return (
      <div className="min-h-screen bg-forest-950 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Leaf size={24} className="text-forest-950" strokeWidth={2.5} />
          </div>
          <p className="text-emerald-400/60 text-xs font-bold tracking-widest uppercase">Loading EcoTwin…</p>
        </motion.div>
      </div>
    );
  }

  if (hasOnboarded) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 via-[#071a0f] to-forest-950 text-white overflow-x-hidden">
      {/* Animated ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-teal-600/15 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-forest-500/15 rounded-full blur-[100px]"
        />
      </div>

      {/* Top Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-forest-950/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Leaf size={18} className="text-forest-950" strokeWidth={2.5} />
          </div>
          <span className="font-display font-extrabold text-lg text-white tracking-tight">
            Eco<span className="text-emerald-400">Twin</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/campus-forest')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-300/80 hover:text-emerald-300 transition-colors px-3 py-1.5"
          >
            <TreePine size={14} />
            <span>Live Forest</span>
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-bold text-forest-950 bg-emerald-400 hover:bg-emerald-300 px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-10">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="flex flex-col items-center gap-6 max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-4 py-1.5 rounded-full"
          >
            <Zap size={12} className="text-emerald-400" />
            PixxelHack 2.0 · TCET Mumbai Hackathon Project
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold leading-tight tracking-tight"
          >
            Your Campus
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
              Carbon Twin
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg text-emerald-100/60 leading-relaxed max-w-xl"
          >
            EcoTwin turns every commute, meal, and energy choice into a living digital creature.
            Log habits, earn GreenCoins, and compete with your department — all in real time.
          </motion.p>

          {/* Twin Avatar Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, type: 'spring', damping: 14 }}
            className="flex items-end justify-center gap-6 my-2"
          >
            {['wilting', 'neutral', 'thriving'].map((state, i) => (
              <motion.div
                key={state}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`flex flex-col items-center gap-1 ${i === 1 ? 'scale-125 z-10' : 'opacity-60 scale-90'}`}
              >
                <TwinRenderer state={state} size={i === 1 ? 'lg' : 'sm'} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  state === 'thriving' ? 'text-emerald-400' :
                  state === 'wilting' ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {state}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-3 mt-2"
          >
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-extrabold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-400/30 hover:-translate-y-0.5"
            >
              <span>Start for Free</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/campus-forest')}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold px-6 py-3.5 rounded-2xl text-sm transition-all"
            >
              <TreePine size={16} className="text-emerald-400" />
              <span>View Live Campus Forest</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30"
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="relative z-10 py-10 px-4 border-y border-white/5 bg-white/3 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(({ value, suffix, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-3xl font-display font-extrabold text-emerald-400">
                {value}<span className="text-emerald-300/70">{suffix}</span>
              </p>
              <p className="text-xs text-white/50 font-semibold mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3 block">How it Works</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              Log once. Watch your twin evolve.
            </h2>
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
                className="relative bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-white/8 hover:border-emerald-500/30 transition-all group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
                <span className="absolute top-4 right-4 text-[10px] font-bold text-white/20">{step}</span>
                <h3 className="font-bold text-white text-base mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3 block">Features</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              Built for TCET. Powered by real data.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon, title, desc, gradient, border }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`bg-gradient-to-br ${gradient} border ${border} rounded-3xl p-5 hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="font-bold text-white text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-10"
        >
          <div className="text-5xl mb-4">🌱</div>
          <h2 className="text-3xl font-display font-extrabold text-white mb-3">
            Ready to meet your Twin?
          </h2>
          <p className="text-sm text-white/60 mb-6 leading-relaxed">
            Join TCET students making sustainability personal, gamified, and actually fun.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-extrabold py-4 px-8 rounded-2xl text-sm transition-all shadow-xl shadow-emerald-500/20"
          >
            <span>Create Your EcoTwin — It's Free</span>
            <ArrowRight size={16} />
          </button>
          <p className="text-[11px] text-white/30 mt-3">No credit card · No questionnaire · Just sign in</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Leaf size={12} className="text-emerald-400" />
          </div>
          <span className="text-sm font-bold text-white/50">EcoTwin</span>
        </div>
        <p className="text-xs text-white/25">Built with ❤️ for a Greener Planet · PixxelHack 2.0 · TCET Mumbai</p>
      </footer>
    </div>
  );
}

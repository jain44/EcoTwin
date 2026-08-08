import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useApp } from '../context/AppContext';
import TwinRenderer from '../components/twin/TwinRenderer';
import { Leaf, Swords, Coins, QrCode, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

const FEATURES = [
  { icon: <Leaf size={20} className="text-emerald-600" />, title: 'Living Eco-Twin', desc: 'Your avatar evolves in real-time — wilting sprout to thriving guardian — based on your daily habits.', bg: 'bg-emerald-50', border: 'border-emerald-100', iconBg: 'bg-emerald-100' },
  { icon: <Swords size={20} className="text-violet-600" />, title: 'EcoBattles', desc: 'Compete with your department on a live leaderboard. Lower carbon = higher rank.', bg: 'bg-violet-50', border: 'border-violet-100', iconBg: 'bg-violet-100' },
  { icon: <Coins size={20} className="text-amber-600" />, title: 'GreenCoins Rewards', desc: 'Earn coins daily for eco habits. Redeem for real campus perks — canteen, library & more.', bg: 'bg-amber-50', border: 'border-amber-100', iconBg: 'bg-amber-100' },
  { icon: <QrCode size={20} className="text-sky-600" />, title: 'QR Verified Logging', desc: 'Scan QR codes at campus stations to verify habits and earn bonus coins.', bg: 'bg-sky-50', border: 'border-sky-100', iconBg: 'bg-sky-100' },
  { icon: <ShieldCheck size={20} className="text-rose-600" />, title: 'Integrity Engine', desc: 'Built-in anomaly detection — only authentic habits earn rewards.', bg: 'bg-rose-50', border: 'border-rose-100', iconBg: 'bg-rose-100' },
];

const STATS = [
  { value: '5+', label: 'Twin Stages' },
  { value: '15+', label: 'Campus Rewards' },
  { value: '8', label: 'Departments' },
  { value: '100%', label: 'Real Data' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { hasOnboarded, authReady } = useApp();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // While Firebase is restoring session, show spinner
  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' }}>
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Leaf size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <p className="text-white/70 text-xs font-bold tracking-widest uppercase">Loading…</p>
        </motion.div>
      </div>
    );
  }

  // Always render landing — logged-in users see a "Dashboard" button in nav
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ── Sticky Nav ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm">
            <Leaf size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-extrabold text-lg tracking-tight">Eco<span className="text-emerald-500">Twin</span></span>
        </div>
        <div className="flex items-center gap-3">
          {hasOnboarded ? (
            <button onClick={() => navigate('/dashboard')} className="text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 rounded-xl transition-all shadow-sm">
              Go to Dashboard →
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 rounded-xl transition-all shadow-sm">
              Get Started
            </button>
          )}
        </div>
      </nav>

      {/* ── HERO (gradient bg) ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #064e3b 0%, #065f46 30%, #0f766e 65%, #115e59 100%)' }}>
        {/* Animated mesh blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #34d399 0%, transparent 70%)' }} />
          <motion.div animate={{ scale: [1.2, 1, 1.2], rotate: [0, -10, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #2dd4bf 0%, transparent 70%)' }} />
          <motion.div animate={{ y: [0, -20, 0], x: [0, 15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-10" style={{ background: 'radial-gradient(ellipse, #a7f3d0 0%, transparent 70%)' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 flex flex-col items-center text-center px-4 pt-20 pb-24 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-emerald-200 text-xs font-bold px-4 py-1.5 rounded-full mb-6 backdrop-blur">
            <Zap size={12} className="text-emerald-300" />
            PixxelHack 2.0 · TCET Mumbai Hackathon
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold leading-tight tracking-tight text-white mb-5">
            Your Campus
            <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #6ee7b7, #34d399, #a7f3d0)' }}>
              Carbon Twin
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-base sm:text-lg text-emerald-100/70 leading-relaxed max-w-xl mb-8">
            EcoTwin turns every commute, meal, and energy choice into a living digital creature.
            Log habits, earn GreenCoins, and compete — all in real time.
          </motion.p>

          {/* Twin trio */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, type: 'spring', damping: 14 }}
            className="flex items-end justify-center gap-8 mb-8">
            {['wilting', 'neutral', 'thriving'].map((state, i) => (
              <motion.div key={state} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                className={`flex flex-col items-center gap-1.5 ${i === 1 ? 'scale-125 z-10' : 'opacity-50 scale-90'}`}>
                <TwinRenderer state={state} size={i === 1 ? 'lg' : 'sm'} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${state === 'thriving' ? 'text-emerald-300' : state === 'wilting' ? 'text-rose-300' : 'text-amber-300'}`}>
                  {state}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-white text-emerald-700 font-extrabold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-xl hover:-translate-y-0.5 hover:shadow-2xl">
              <span>Start for Free</span><ArrowRight size={15} />
            </button>
          </motion.div>
        </motion.div>

        {/* Bottom wave */}
        <div className="relative z-10">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none" style={{ height: 60, display: 'block' }}>
            <path d="M0,80 C360,0 1080,80 1440,0 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 px-4 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(({ value, label }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
              <p className="text-3xl font-display font-extrabold text-emerald-600">{value}</p>
              <p className="text-xs text-gray-400 font-semibold mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-3 block">How it Works</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-gray-900">Log once. Watch your twin evolve.</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', icon: '📝', title: 'Log Daily Habits', desc: 'Tell EcoTwin your commute, meals, and energy use — takes under 60 seconds.' },
              { step: '02', icon: '🌱', title: 'Your Twin Reacts', desc: 'Your avatar changes in real-time — thrive with green choices or wilt under heavy emissions.' },
              { step: '03', icon: '🏆', title: 'Compete & Earn', desc: 'Climb the EcoBattles leaderboard and redeem GreenCoins for real campus perks.' },
            ].map(({ step, icon, title, desc }, i) => (
              <motion.div key={step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative bg-white border border-gray-100 rounded-3xl p-6 text-center hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-50 transition-all group shadow-sm">
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
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-3 block">Features</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-gray-900">Built for TCET. Powered by real data.</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon, title, desc, bg, border, iconBg }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className={`${bg} border ${border} rounded-3xl p-5 hover:-translate-y-1 transition-all duration-300 shadow-sm`}>
                <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>{icon}</div>
                <h3 className="font-bold text-gray-800 text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA (gradient bg again) ── */}
      <section className="py-24 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #064e3b 0%, #065f46 40%, #0f766e 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="relative z-10 max-w-xl mx-auto text-center">
          <div className="text-5xl mb-4">🌱</div>
          <h2 className="text-3xl font-display font-extrabold text-white mb-3">Ready to meet your Twin?</h2>
          <p className="text-sm text-emerald-200/70 mb-6 leading-relaxed">
            Join TCET students making sustainability personal, gamified, and actually fun.
          </p>
          <button onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 bg-white text-emerald-700 font-extrabold py-4 px-8 rounded-2xl text-sm transition-all hover:bg-emerald-50 shadow-xl">
            <span>Create Your EcoTwin — It's Free</span><ArrowRight size={16} />
          </button>
          <p className="text-[11px] text-emerald-400/70 mt-3">No credit card · No questionnaire · Just sign in</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100 text-center bg-white">
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

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, BarChart2, Swords, Coins, ShieldCheck, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    icon: '🌱',
    title: 'Virtual Eco-Twin',
    description: 'Your living digital avatar evolves through 5 stages — from Sprout to Ancient Eco-Guardian — based on your real carbon footprint.',
  },
  {
    icon: '📊',
    title: 'Carbon Calculator',
    description: 'Scientifically-grounded emission factors from WRI India, CEA 2023, and Our World in Data, tailored to Mumbai student lifestyles.',
  },
  {
    icon: '⚔️',
    title: 'EcoBattles',
    description: 'Compete with TCET departments and hostels in a live sustainability leaderboard. Lower your footprint to climb the ranks.',
  },
  {
    icon: '🪙',
    title: 'GreenCoins',
    description: 'Earn coins for eco-friendly habits and redeem them for real campus perks — canteen discounts, library passes, and more.',
  },
  {
    icon: '🛡️',
    title: 'Integrity Engine',
    description: 'A built-in anomaly detection system flags suspicious patterns and automatically adjusts coin rewards to discourage gaming.',
  },
  {
    icon: '📸',
    title: 'Meal Verification',
    description: 'Optionally snap a photo of your meal when logging diet to create a verifiable, trusted record of your habits.',
  },
];

const TECH_STACK = [
  { label: 'React 19', icon: '⚛️' },
  { label: 'Vite', icon: '⚡' },
  { label: 'Tailwind CSS v3', icon: '🎨' },
  { label: 'Framer Motion', icon: '✨' },
  { label: 'Chart.js', icon: '📈' },
  { label: 'Lucide Icons', icon: '🎯' },
];

const DATA_SOURCES = [
  { key: 'Commute', label: 'WRI India — Transport Emission Factors (2022)', url: 'https://www.wri.org/data/india-greenhouse-gas-emissions' },
  { key: 'Diet', label: 'Our World in Data — Food Carbon Footprint', url: 'https://ourworldindata.org/food-choice-vs-eating-local' },
  { key: 'Energy', label: 'CEA — CO₂ Baseline Database v18 (2023)', url: 'https://cea.nic.in/co2-baseline-database/' },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="page-content pt-6">
      {/* Hero */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-forest-700 to-thriving-500 shadow-nature mb-4">
          <Leaf size={32} className="text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-extrabold text-forest-900 mb-2">
          About <span className="text-gradient-green">EcoTwin</span>
        </h1>
        <p className="text-moss-500 text-sm max-w-xl mx-auto leading-relaxed">
          EcoTwin is a Next-Gen Sustainable Living Dashboard built for college students.
          It turns your daily habits into a living, evolving digital creature — making sustainability personal, gamified, and fun.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-forest-50 border border-forest-200 rounded-full px-4 py-2">
          <span className="text-xs font-bold text-forest-700">🏆 PixxelHack 2.0</span>
          <span className="text-[10px] text-moss-500">Round 2 — Development Sprint</span>
        </div>
      </motion.div>

      {/* Features grid */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="section-title mb-4">✨ Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="eco-card p-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-bold text-forest-900 mb-1.5">{f.title}</h3>
              <p className="text-xs text-moss-500 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div
        className="eco-card p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="section-title mb-5">⚙️ How It Works</h2>
        <div className="flex flex-col gap-4">
          {[
            { step: '01', title: 'Set Up Your Profile', desc: 'Tell EcoTwin your commute mode, diet, and energy usage during onboarding.' },
            { step: '02', title: 'Log Daily Habits', desc: 'Each day, log your commute, meals, and appliance hours. Optionally snap a meal photo.' },
            { step: '03', title: 'Watch Your Twin Evolve', desc: "Your Eco-Twin's appearance and mood change in real time based on your 7-day average footprint." },
            { step: '04', title: 'Compete & Earn', desc: 'Climb the EcoBattles leaderboard and redeem GreenCoins for real campus perks.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-forest-100 text-forest-700 font-extrabold flex items-center justify-center text-sm flex-shrink-0 border border-forest-200">
                {step}
              </div>
              <div>
                <p className="text-sm font-bold text-forest-900">{title}</p>
                <p className="text-xs text-moss-500 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Twin Evolution stages */}
      <motion.div
        className="eco-card p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="section-title mb-4">🌱 Twin Evolution Stages</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { stage: 'Sprout', range: '> 7 kg/day', color: 'text-rose-600 bg-rose-50 border-rose-200' },
            { stage: 'Sapling', range: '5–7 kg/day', color: 'text-amber-600 bg-amber-50 border-amber-200' },
            { stage: 'Bush', range: '3–5 kg/day', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
            { stage: 'Guardian Tree', range: '1–3 kg/day', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
            { stage: 'Eco-Guardian', range: '< 1 kg/day', color: 'text-forest-800 bg-forest-100 border-forest-300' },
          ].map(({ stage, range, color }) => (
            <div key={stage} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${color}`}>
              <span>{stage}</span>
              <span className="opacity-60 font-normal">{range}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Data Sources */}
      <motion.div
        className="eco-card p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="section-title mb-4">📊 Verified Data Sources</h2>
        <div className="flex flex-col gap-3">
          {DATA_SOURCES.map((src) => (
            <div key={src.key} className="flex items-start gap-3">
              <span className="text-[10px] font-bold text-forest-700 uppercase bg-forest-50 border border-forest-200 rounded px-1.5 py-0.5 flex-shrink-0 mt-0.5">
                {src.key}
              </span>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-moss-600 hover:text-forest-800 hover:underline flex items-center gap-1 group"
              >
                {src.label}
                <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        className="eco-card p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="section-title mb-4">🛠️ Tech Stack</h2>
        <div className="flex flex-wrap gap-2.5">
          {TECH_STACK.map(({ label, icon }) => (
            <div key={label} className="flex items-center gap-1.5 bg-cream-50 border border-forest-100 rounded-full px-3 py-1.5">
              <span>{icon}</span>
              <span className="text-xs font-bold text-forest-800">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="text-center pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button onClick={() => navigate('/dashboard')} className="btn-primary px-8">
          ← Back to Dashboard
        </button>
        <p className="text-xs text-moss-400 mt-4">
          Built with ❤️ for a Greener Planet · PixxelHack 2.0 · TCET Mumbai
        </p>
      </motion.div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { GREEN_COINS_REWARDS } from '../data/seedData';

const CATEGORY_LABELS = {
  all: '✨ All',
  food: '🍱 Food',
  campus: '🏫 Campus',
  digital: '💻 Digital',
  impact: '🌍 Impact',
  transport: '🚲 Transport',
  merch: '👜 Merch',
};

function RewardCard({ reward, onRedeem, canAfford }) {
  const [redeemed, setRedeemed] = useState(false);

  const handleRedeem = () => {
    if (!canAfford || !reward.available) return;
    onRedeem(reward.cost);
    setRedeemed(true);
  };

  return (
    <motion.div
      className={`eco-card p-4 ${!reward.available ? 'opacity-60' : ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={reward.available ? { y: -2 } : {}}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl flex-shrink-0">{reward.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-forest-800">{reward.title}</p>
          <p className="text-[11px] text-moss-400 mt-0.5 leading-tight">{reward.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-sm font-bold text-amber-700">🪙 {reward.cost} coins</span>
        {!reward.available ? (
          <span className="text-xs text-moss-300 bg-cream-100 px-3 py-1.5 rounded-xl">Coming soon</span>
        ) : redeemed ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-xs font-bold text-thriving-600 bg-thriving-100 px-3 py-1.5 rounded-xl"
          >
            ✅ Redeemed!
          </motion.span>
        ) : (
          <button
            id={`redeem-${reward.id}`}
            onClick={handleRedeem}
            disabled={!canAfford}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-200 ${
              canAfford
                ? 'bg-forest-600 text-white hover:bg-forest-700 active:scale-95'
                : 'bg-cream-100 text-moss-300 cursor-not-allowed'
            }`}
          >
            {canAfford ? 'Redeem →' : 'Not enough'}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function GreenCoins() {
  const { greenCoinsBalance, redeemCoins } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = GREEN_COINS_REWARDS.filter(
    (r) => activeCategory === 'all' || r.category === activeCategory
  );

  const categories = ['all', ...new Set(GREEN_COINS_REWARDS.map((r) => r.category))];

  return (
    <div className="page-content pt-4">
      {/* Header */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-display font-bold text-forest-900">🪙 Green Coins</h1>
        <p className="text-sm text-moss-400 mt-0.5">Earn by logging low-footprint days. Spend on campus perks.</p>
      </motion.div>

      {/* ── Top Row: Balance & How to Earn (Desktop 2-column grid) ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch mb-6">
        {/* Balance card */}
        <motion.div
          className="md:col-span-5 eco-card p-6 text-center flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className="text-6xl md:text-7xl font-display font-black text-amber-700 mb-1"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {greenCoinsBalance}
          </motion.div>
          <p className="text-sm text-amber-800 font-bold mb-3">🪙 Green Coins Balance</p>
          <div className="flex justify-center gap-3 text-xs text-moss-600 bg-white/70 px-4 py-2 rounded-full border border-amber-200/60 shadow-sm">
            <span>🥦 Vegan day → +50</span>
            <span>·</span>
            <span>🚶 Walk day → +50</span>
          </div>
        </motion.div>

        {/* How to earn card */}
        <motion.div
          className="md:col-span-7 eco-card p-5 flex flex-col justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="section-title mb-3">⚡ How to Earn Green Coins</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { label: 'Vegan day',     coins: 50,  icon: '🥦' },
              { label: 'Walk to campus',coins: 50,  icon: '🚶' },
              { label: 'Plant-based',   coins: 40,  icon: '🥗' },
              { label: 'Local train',   coins: 30,  icon: '🚆' },
              { label: 'Avg footprint', coins: 20,  icon: '⚡' },
              { label: 'High footprint',coins: 5,   icon: '🚗' },
            ].map((e) => (
              <div key={e.label} className="flex items-center gap-2 bg-cream-50 rounded-xl p-2.5 border border-forest-50 hover:bg-cream-100 transition-colors">
                <span className="text-lg">{e.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-forest-800 font-bold truncate">{e.label}</p>
                </div>
                <span className="text-xs font-extrabold text-amber-700 flex-shrink-0">+{e.coins}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Rewards catalog header & category filter ── */}
      <div className="mb-4">
        <h2 className="section-title mb-3">Rewards Catalog</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-${cat}`}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-forest-600 text-white shadow-sm'
                  : 'bg-cream-100 text-moss-500 border border-forest-100 hover:bg-cream-200'
              }`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop 3-column Reward Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              onRedeem={redeemCoins}
              canAfford={greenCoinsBalance >= reward.cost}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-6 p-4 rounded-2xl bg-cream-100 border border-forest-100 text-center">
        <p className="text-xs text-moss-500 font-medium">
          🎓 Rewards are live-simulated for the hackathon demo · Integrated with TCET campus services & canteen system
        </p>
      </div>
    </div>
  );
}

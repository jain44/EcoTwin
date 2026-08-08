import React from 'react';
import { motion } from 'framer-motion';
import { ALL_ACHIEVEMENTS, RARITY_CONFIG, getEarnedAchievements } from '../../engine/achievements';

export default function AchievementBadges({ habitLog }) {
  const earned = getEarnedAchievements(habitLog);
  const earnedIds = new Set(earned.map((a) => a.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-title">🏅 Achievements</h2>
        <span className="text-xs font-bold text-moss-500 bg-cream-100 px-2.5 py-1 rounded-full border border-forest-100">
          {earned.length}/{ALL_ACHIEVEMENTS.length} unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {ALL_ACHIEVEMENTS.map((achievement, i) => {
          const isEarned = earnedIds.has(achievement.id);
          const rarity = RARITY_CONFIG[achievement.rarity];

          return (
            <motion.div
              key={achievement.id}
              className={`relative rounded-2xl p-3 border text-center transition-all duration-300 ${
                isEarned
                  ? `${rarity.bg} ${rarity.border} shadow-sm`
                  : 'bg-gray-50 border-gray-100 opacity-40 grayscale'
              }`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: isEarned ? 1 : 0.4, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              title={isEarned ? achievement.description : `🔒 ${achievement.description}`}
            >
              {isEarned && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-forest-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12, delay: i * 0.04 + 0.2 }}
                >
                  <span className="text-[8px] text-white font-bold">✓</span>
                </motion.div>
              )}
              <div className="text-2xl mb-1">{achievement.icon}</div>
              <p className={`text-[10px] font-bold leading-tight ${isEarned ? rarity.color : 'text-gray-400'}`}>
                {achievement.title}
              </p>
              {isEarned && (
                <span className={`text-[9px] font-semibold uppercase tracking-wider ${rarity.color} opacity-70`}>
                  {rarity.label}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

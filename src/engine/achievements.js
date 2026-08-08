/**
 * EcoTwin Achievement Engine
 * Checks habit log for milestones and returns earned badges.
 */

export const ALL_ACHIEVEMENTS = [
  {
    id: 'first_log',
    title: 'First Step',
    description: 'Logged your first day of habits',
    icon: '🌱',
    rarity: 'common',
    check: (log) => log.length >= 1,
  },
  {
    id: 'three_day_streak',
    title: '3-Day Streak',
    description: 'Logged habits 3 days in a row',
    icon: '🔥',
    rarity: 'common',
    check: (log) => log.length >= 3,
  },
  {
    id: 'vegan_day',
    title: 'Plant Pioneer',
    description: 'Logged a fully vegan day',
    icon: '🥦',
    rarity: 'common',
    check: (log) => log.some((e) => e.dietType === 'vegan'),
  },
  {
    id: 'walk_commute',
    title: 'Zero Commute',
    description: 'Walked or cycled to campus at least once',
    icon: '🚶',
    rarity: 'common',
    check: (log) => log.some((e) => e.commuteMode === 'walk' || e.commuteMode === 'cycle'),
  },
  {
    id: 'seven_day_streak',
    title: '7-Day Streak',
    description: 'Logged habits 7 days in a row',
    icon: '⚡',
    rarity: 'rare',
    check: (log) => log.length >= 7,
  },
  {
    id: 'thriving_week',
    title: 'Thriving Week',
    description: 'Maintained Thriving status for 5+ days',
    icon: '🌿',
    rarity: 'rare',
    check: (log) => log.filter((e) => (e.computedFootprintKg ?? 99) < 3).length >= 5,
  },
  {
    id: 'low_energy',
    title: 'Power Saver',
    description: 'Logged 0 appliance hours at least twice',
    icon: '💡',
    rarity: 'common',
    check: (log) => log.filter((e) => (e.energyUsageHours ?? 1) === 0).length >= 2,
  },
  {
    id: 'vegan_week',
    title: 'Vegan Week',
    description: 'Ate vegan for 7 days',
    icon: '🌍',
    rarity: 'epic',
    check: (log) => log.filter((e) => e.dietType === 'vegan').length >= 7,
  },
  {
    id: 'eco_champion',
    title: 'Eco Champion',
    description: 'Logged 14 days of habits',
    icon: '👑',
    rarity: 'epic',
    check: (log) => log.length >= 14,
  },
  {
    id: 'train_commuter',
    title: 'Rail Rider',
    description: 'Used local train 5 times',
    icon: '🚆',
    rarity: 'common',
    check: (log) => log.filter((e) => e.commuteMode === 'train').length >= 5,
  },
];

export const RARITY_CONFIG = {
  common: { label: 'Common', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
  rare:   { label: 'Rare',   color: 'text-blue-600',  bg: 'bg-blue-50',   border: 'border-blue-200' },
  epic:   { label: 'Epic',   color: 'text-purple-600',bg: 'bg-purple-50', border: 'border-purple-200' },
};

/**
 * Returns the list of earned achievements for a given habit log.
 */
export function getEarnedAchievements(habitLog) {
  if (!habitLog || habitLog.length === 0) return [];
  return ALL_ACHIEVEMENTS.filter((a) => a.check(habitLog));
}

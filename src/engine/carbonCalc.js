/**
 * EcoTwin Carbon Calculation Engine
 * Emission factors sourced from:
 * - WRI India (commute, transport)
 * - CEA (Central Electricity Authority) baseline: 0.82 kg CO2e/kWh
 * - Diet estimates from lifecycle assessment studies
 */

export const EMISSION_FACTORS = {
  // kg CO2e per passenger-km (India-specific, WRI sourced)
  commute: {
    train: 0.014,
    bus: 0.05,
    bike: 0.03,     // petrol two-wheeler
    car: 0.14,      // average occupancy 1.5
    walk: 0,
    cycle: 0,
  },
  // kg CO2e per meal (diet-based lifecycle estimate)
  diet: {
    vegan: 0.7,
    veg: 0.9,
    nonveg: 3.3,
  },
  // kg CO2e per kWh — India grid average (CEA 2022–23 baseline)
  energyPerKwh: 0.82,
};

// Simplified kWh estimate: 1 hour appliance use ≈ 0.3 kWh (fan/light mix avg for hostel room)
const KWH_PER_HOUR = 0.3;

/**
 * Calculate daily footprint from a habit log entry
 * @param {Object} entry
 * @returns {number} kg CO2e
 */
export function calculateDailyFootprint(entry) {
  const commuteFactor = EMISSION_FACTORS.commute[entry.commuteMode] ?? 0;
  const commuteEmissions = commuteFactor * (entry.commuteDistanceKm ?? 0);

  const dietFactor = EMISSION_FACTORS.diet[entry.dietType] ?? 0.9;
  const dietEmissions = dietFactor * (entry.mealsCount ?? 3);

  const energyKwh = (entry.energyUsageHours ?? 0) * KWH_PER_HOUR;
  const energyEmissions = EMISSION_FACTORS.energyPerKwh * energyKwh;

  return +(commuteEmissions + dietEmissions + energyEmissions).toFixed(3);
}

/**
 * Calculate component-wise breakdown for a single entry
 */
export function getEmissionBreakdown(entry) {
  const commuteFactor = EMISSION_FACTORS.commute[entry.commuteMode] ?? 0;
  const commute = +(commuteFactor * (entry.commuteDistanceKm ?? 0)).toFixed(3);

  const dietFactor = EMISSION_FACTORS.diet[entry.dietType] ?? 0.9;
  const diet = +(dietFactor * (entry.mealsCount ?? 3)).toFixed(3);

  const energyKwh = (entry.energyUsageHours ?? 0) * KWH_PER_HOUR;
  const energy = +(EMISSION_FACTORS.energyPerKwh * energyKwh).toFixed(3);

  return { commute, diet, energy };
}

/**
 * Get 7-day rolling average footprint
 * @param {Array} habitLog - array of entries, most recent last
 * @returns {number} kg CO2e/day average
 */
export function getRollingAverage(habitLog) {
  if (!habitLog || habitLog.length === 0) return 0;
  const recent = habitLog.slice(-7);
  const total = recent.reduce((sum, e) => sum + (e.computedFootprintKg ?? 0), 0);
  return +(total / recent.length).toFixed(3);
}

/**
 * Determine twin state from rolling average
 * Thresholds calibrated to realistic Indian student footprint data
 */
export function getTwinState(rollingAvg) {
  if (rollingAvg < 3) return 'thriving';
  if (rollingAvg <= 6) return 'neutral';
  return 'wilting';
}

/**
 * Find the dominant emission category (for P1 trait mutation)
 * @param {Array} habitLog
 * @returns {"commute"|"diet"|"energy"}
 */
export function getDominantTrait(habitLog) {
  if (!habitLog || habitLog.length === 0) return 'diet';
  const recent = habitLog.slice(-7);

  let totals = { commute: 0, diet: 0, energy: 0 };
  recent.forEach((entry) => {
    const breakdown = getEmissionBreakdown(entry);
    totals.commute += breakdown.commute;
    totals.diet += breakdown.diet;
    totals.energy += breakdown.energy;
  });

  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Calculate Green Coins earned from a daily footprint score
 * Lower footprint = more coins
 */
export function calculateGreenCoins(footprintKg) {
  if (footprintKg < 2) return 50;
  if (footprintKg < 3) return 40;
  if (footprintKg < 4) return 30;
  if (footprintKg < 5) return 20;
  if (footprintKg < 6) return 10;
  return 5;
}

/**
 * ─── INTEGRITY ENGINE ──────────────────────────────────────────────────────
 * Detects suspicious patterns in habit logs that indicate gaming the system.
 *
 * Checks performed:
 *  1. Identical-entry streaks   — same exact values 3+ days in a row
 *  2. Always-perfect entries    — vegan + walk/cycle + 0 energy every day
 *  3. Zero-variance footprints  — footprint changes < 0.05 kg across 5+ days
 *  4. Suspiciously fast balance growth (relative to log length)
 *
 * Returns a trust score 0–100 and a coin multiplier 0.3–1.0.
 */
export function calculateTrustScore(habitLog) {
  if (!habitLog || habitLog.length < 3) {
    return { score: 100, multiplier: 1.0, flags: [], status: 'new' };
  }

  const recent = habitLog.slice(-7);
  const flags = [];
  let deductions = 0;

  // ── 1. Identical consecutive entries (3+ days) ──────────────────────────
  let maxIdenticalStreak = 1;
  let currentStreak = 1;
  for (let i = 1; i < recent.length; i++) {
    const a = recent[i - 1];
    const b = recent[i];
    const identical =
      a.commuteMode === b.commuteMode &&
      a.commuteDistanceKm === b.commuteDistanceKm &&
      a.dietType === b.dietType &&
      a.mealsCount === b.mealsCount &&
      a.energyUsageHours === b.energyUsageHours;
    if (identical) {
      currentStreak++;
      maxIdenticalStreak = Math.max(maxIdenticalStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  if (maxIdenticalStreak >= 5) {
    flags.push({ code: 'IDENTICAL_STREAK_HIGH', message: 'Identical entries logged 5+ days in a row', severity: 'high' });
    deductions += 40;
  } else if (maxIdenticalStreak >= 3) {
    flags.push({ code: 'IDENTICAL_STREAK_MED', message: 'Identical entries logged 3+ days in a row', severity: 'medium' });
    deductions += 20;
  }

  // ── 2. Always-perfect entries (vegan + walk/cycle + ≤0.5h energy) ────────
  const perfectEntries = recent.filter(
    (e) =>
      e.dietType === 'vegan' &&
      (e.commuteMode === 'walk' || e.commuteMode === 'cycle') &&
      (e.energyUsageHours ?? 0) <= 0.5
  );
  const perfectRatio = perfectEntries.length / recent.length;
  if (perfectRatio === 1 && recent.length >= 5) {
    flags.push({ code: 'ALWAYS_PERFECT', message: 'Every entry logged as maximum eco-friendly', severity: 'high' });
    deductions += 35;
  } else if (perfectRatio >= 0.8 && recent.length >= 5) {
    flags.push({ code: 'NEAR_PERFECT', message: '80%+ of entries logged as maximum eco-friendly', severity: 'medium' });
    deductions += 15;
  }

  // ── 3. Near-zero variance in footprints ─────────────────────────────────
  if (recent.length >= 5) {
    const footprints = recent.map((e) => e.computedFootprintKg ?? 0);
    const mean = footprints.reduce((a, b) => a + b, 0) / footprints.length;
    const variance = footprints.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / footprints.length;
    const stdDev = Math.sqrt(variance);
    if (stdDev < 0.05) {
      flags.push({ code: 'ZERO_VARIANCE', message: 'Carbon footprint is suspiciously identical every day', severity: 'high' });
      deductions += 30;
    } else if (stdDev < 0.2) {
      flags.push({ code: 'LOW_VARIANCE', message: 'Very low day-to-day variation in footprint', severity: 'low' });
      deductions += 10;
    }
  }

  // ── 4. QR Code trust bonuses ────────────────────────────────────────────
  const qrCount = recent.filter((e) => e.source === 'qr').length;
  if (qrCount > 0) {
    deductions = Math.max(0, deductions - qrCount * 15);
  }

  const score = Math.max(0, 100 - deductions);

  // Multiplier: smoothly scales from 0.3 (fully flagged) to 1.0 (fully trusted)
  const multiplier = +(0.3 + (score / 100) * 0.7).toFixed(2);

  let status;
  if (score >= 85) status = 'trusted';
  else if (score >= 60) status = 'caution';
  else status = 'suspicious';

  return { score, multiplier, flags, status };
}

/**
 * Calculate adjusted GreenCoins accounting for trust multiplier.
 * Ensures cheaters earn fewer coins even if they log eco-perfect data.
 */
export function calculateAdjustedCoins(footprintKg, habitLog) {
  const base = calculateGreenCoins(footprintKg);
  const { multiplier } = calculateTrustScore(habitLog);
  return Math.round(base * multiplier);
}

/**
 * Format kg CO2e for display
 */
export function formatFootprint(kg) {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t CO₂e`;
  return `${kg.toFixed(1)} kg CO₂e`;
}

export const EMISSION_SOURCES = {
  commute: { label: 'WRI India — Transport Emission Factors (2022)', url: 'https://www.wri.org/data/india-greenhouse-gas-emissions' },
  diet: { label: 'Our World in Data — Food Carbon Footprint', url: 'https://ourworldindata.org/food-choice-vs-eating-local' },
  energy: { label: 'CEA — CO2 Baseline Database for Indian Power Sector v18 (2023)', url: 'https://cea.nic.in/co2-baseline-database/' },
};

/**
 * Extract standard department from user branch text
 */
export function extractDepartment(hostelOrBranch) {
  const text = (hostelOrBranch || '').toLowerCase();
  if (text.includes('information technology') || text.includes('it dept') || text.includes('it ')) {
    return 'Information Technology';
  }
  if (text.includes('civil')) return 'Civil Engineering';
  if (text.includes('computer') || text.includes('cmpn') || text.includes('cs ')) {
    return 'Computer Engineering';
  }
  if (text.includes('electronics') || text.includes('extc') || text.includes('tc ')) {
    return 'Electronics & TC';
  }
  if (text.includes('mechanical') || text.includes('mech')) return 'Mechanical Engineering';
  if (text.includes('aids') || text.includes('artificial')) return 'AIDS';
  if (text.includes('chemical') || text.includes('chem')) return 'Chemical Engineering';
  if (text.includes('production') || text.includes('prod')) return 'Production Engineering';
  
  return 'Computer Engineering'; // Fallback default
}

/**
 * Extract standard hostel from student info
 */
export function extractHostel(hostelOrBranch, studentType) {
  if (studentType === 'dayscholar' || (hostelOrBranch || '').toLowerCase().includes('day scholar') || (hostelOrBranch || '').toLowerCase().includes('dayscholar')) {
    return 'Day Scholars (Suburban Mumbai)';
  }
  const text = (hostelOrBranch || '').toLowerCase();
  if (text.includes('hostel b') || text.includes('east')) {
    return 'Hostel B (Wing East)';
  }
  if (text.includes('hostel c') || text.includes('west')) {
    return 'Hostel C (Wing West)';
  }
  return 'Hostel A (Ground Block)';
}


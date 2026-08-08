/**
 * Simple Linear Regression calculation
 * Fits y = mx + c to the points (x, y)
 * Returns { slope: m, intercept: c }
 */
export function calculateLinearRegression(dataPoints) {
  const n = dataPoints.length;
  if (n < 2) return { slope: 0, intercept: 0 };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    const x = i; // Day index
    const y = dataPoints[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) return { slope: 0, intercept: dataPoints[0] };

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

/**
 * Predict days until mood downgrade or upgrade based on the slope of recent footprints.
 * Thresholds: Thriving < 3, Neutral 3-6, Wilting > 6
 */
export function predictMoodChange(habitLog, currentTwinState) {
  if (!habitLog || habitLog.length < 4) {
    return {
      status: 'insufficient_data',
      message: 'Log at least 4 days of habits to see future mood projections. 🌱'
    };
  }

  // Get last 7 days of footprint entries
  const recentEntries = habitLog.slice(-7);
  const footprints = recentEntries.map(e => e.computedFootprintKg ?? 0);
  
  // Calculate average score of last 7 entries
  const currentAvg = footprints.reduce((sum, val) => sum + val, 0) / footprints.length;
  const { slope } = calculateLinearRegression(footprints);

  // If slope is near flat
  if (Math.abs(slope) <= 0.05) {
    if (currentTwinState === 'thriving') {
      return {
        status: 'stable_good',
        message: 'Excellent stability! Thriving status is locked in for the foreseeable future. 🌟'
      };
    } else if (currentTwinState === 'neutral') {
      return {
        status: 'stable_neutral',
        message: 'Steady habits. Keep making green choices to sprout to thriving! 🌿'
      };
    } else {
      return {
        status: 'stable_bad',
        message: 'Stable but wilting. A single train ride or meatless meal can perk me up! 🥀'
      };
    }
  }

  // If emissions are rising (slope > 0.05)
  if (slope > 0.05) {
    if (currentTwinState === 'thriving') {
      // Days to exceed 3.0 kg
      const days = Math.max(1, Math.round((3.0 - currentAvg) / slope));
      return {
        status: 'warning_neutral',
        days,
        message: `Warning: At this rate, your twin will downgrade to neutral in ${days} ${days === 1 ? 'day' : 'days'}. ⚠️`
      };
    } else if (currentTwinState === 'neutral') {
      // Days to exceed 6.0 kg
      const days = Math.max(1, Math.round((6.0 - currentAvg) / slope));
      return {
        status: 'warning_wilting',
        days,
        message: `Caution: At this rate, your twin wilts in ${days} ${days === 1 ? 'day' : 'days'}! 🚨`
      };
    } else {
      return {
        status: 'critical_wilting',
        message: 'Critical emissions growth. Urgent green actions needed to recover! 🥀'
      };
    }
  }

  // If emissions are falling (slope < -0.05)
  if (slope < -0.05) {
    if (currentTwinState === 'wilting') {
      // Days to drop below 6.0 kg
      const days = Math.max(1, Math.round((6.0 - currentAvg) / slope));
      return {
        status: 'recovery_neutral',
        days,
        message: `Great recovery! Projected to exit wilting status in ${days} ${days === 1 ? 'day' : 'days'}. 🌟`
      };
    } else if (currentTwinState === 'neutral') {
      // Days to drop below 3.0 kg
      const days = Math.max(1, Math.round((3.0 - currentAvg) / slope));
      return {
        status: 'recovery_thriving',
        days,
        message: `Keep it up! Thriving status is projected in ${days} ${days === 1 ? 'day' : 'days'}! 🌿`
      };
    } else {
      return {
        status: 'peak_thriving',
        message: 'Emissions are decreasing even further! You are a sustainability superstar. 👑'
      };
    }
  }

  return null;
}

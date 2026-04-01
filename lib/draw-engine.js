/**
 * draw-engine.js
 * Core logic for Generating Parity Monthly Draws
 */

export function generateDrawNumbers(mode = 'RANDOM', activeScores = []) {
  if (mode === 'RANDOM') {
    return generateRandomSet();
  } else if (mode === 'ALGORITHMIC') {
    return generateAlgorithmicSet(activeScores);
  }
  return generateRandomSet();
}

/**
 * RANDOM MODE: 5 unique numbers between 1 and 45.
 */
function generateRandomSet() {
  const numbers = new Set();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * ALGORITHMIC MODE: Weighted selection.
 * Logic: Prefer numbers that have been picked by moderate frequency but avoid extreme outliers.
 * In a real MVP, this could be more complex. For now, it favors the 'center' of the frequency distribution.
 */
function generateAlgorithmicSet(activeScores) {
  // If no scores are provided, fallback to random
  if (!activeScores || activeScores.length === 0) return generateRandomSet();

  // Create frequency map
  const freq = {};
  for (let s of activeScores) {
    freq[s] = (freq[s] || 0) + 1;
  }

  // Generate weighted list
  const candidates = Array.from({ length: 45 }, (_, i) => i + 1);
  
  // Weights: favor numbers that appear in activeScores but aren't 'jackpot-heavy'
  const weightedCandidates = [];
  candidates.forEach(c => {
    const f = freq[c] || 0;
    // Basic weighting: base weight of 1 + frequency bias
    const weight = 2 + (f * 5); 
    for(let i=0; i<weight; i++) weightedCandidates.push(c);
  });

  const numbers = new Set();
  while (numbers.size < 5) {
    const randomIndex = Math.floor(Math.random() * weightedCandidates.length);
    numbers.add(weightedCandidates[randomIndex]);
  }
  
  return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * CALCULATE MATCHES
 * Compares user entry (5 numbers) vs draw result (5 numbers).
 */
export function calculateMatchCount(userNumbers, drawNumbers) {
  const intersection = userNumbers.filter(n => drawNumbers.includes(n));
  return intersection.length;
}

/**
 * CALCULATE PRIZE POOL
 * Logic: 40% of subscription revenue.
 */
export function calculatePrizePool(activeSubscribers, rollover = 0) {
  const revenuePerSub = 24.99; // Simplified
  const totalRevenue = activeSubscribers * revenuePerSub;
  const pool = (totalRevenue * 0.4) + rollover;
  
  return {
    total: pool,
    tiers: {
      MATCH_5: pool * 0.4,
      MATCH_4: pool * 0.35,
      MATCH_3: pool * 0.25
    }
  };
}

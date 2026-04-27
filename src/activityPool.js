import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function fetchActivitiesPool(destination) {
  try {
    const snap = await getDocs(
      collection(db, 'activities', destination, 'items')
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

/**
 * Score each activity against user preferences and split into slot pools.
 * Returns { Morning: [...], Afternoon: [...], Evening: [...] }, each capped at 10.
 */
export function buildSlottedPools(pool, { interests = [], area = '', budget = '$$', energy = 5 }) {
  const budgetRank = { '$': 0, '$$': 1, '$$$': 2 };
  const userBudget = budgetRank[budget] ?? 1;

  const scored = pool.map(item => {
    let score = 0;

    // Interest match — most important signal
    if (interests.length > 0 && Array.isArray(item.interests)) {
      score += item.interests.filter(i => interests.includes(i)).length * 3;
    }

    // Area proximity
    if (area && item.area) {
      const areaLow = area.toLowerCase();
      if (item.area.toLowerCase().includes(areaLow) || areaLow.includes(item.area.toLowerCase())) {
        score += 2;
      }
    }

    // Budget fit — penalise items above user's budget
    const itemBudget = budgetRank[item.costTier] ?? 1;
    if (itemBudget > userBudget + 1) score -= 3;
    if (itemBudget === userBudget) score += 1;

    // Energy alignment — high-energy categories suit high-energy users
    const activeCategories = new Set(['Adventure', 'Sports']);
    const calmCategories   = new Set(['Lifestyle', 'Sightseeing', 'Dining']);
    if (energy >= 7 && activeCategories.has(item.category)) score += 1;
    if (energy <= 4 && calmCategories.has(item.category)) score += 1;

    return { ...item, _score: score };
  }).sort((a, b) => b._score - a._score);

  const forSlot = slot => {
    const direct  = scored.filter(i => i.slot === slot);
    const any     = scored.filter(i => i.slot === 'Any');
    const merged  = [...direct, ...any];
    // Deduplicate by id
    const seen = new Set();
    return merged.filter(i => seen.has(i.id) ? false : seen.add(i.id)).slice(0, 10);
  };

  return {
    Morning:   forSlot('Morning'),
    Afternoon: forSlot('Afternoon'),
    Evening:   forSlot('Evening'),
  };
}

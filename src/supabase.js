import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default supabase;

/**
 * Persist a generated itinerary to the trips table.
 * Silently no-ops if Supabase env vars are not configured.
 *
 * @param {string} userId
 * @param {object} form   - { destination, arrivalDate, persona, budget, energy }
 * @param {object} pools  - { Morning: Activity[], Afternoon: Activity[], Evening: Activity[] }
 * @param {object} picks  - { Morning: number, Afternoon: number, Evening: number }
 * @returns {Promise<string|null>} The new trip's id, or null on failure
 */
export const saveTrip = async (userId, form, pools, picks) => {
  if (!import.meta.env.VITE_SUPABASE_URL) return null;
  try {
    const snapshot = {
      Morning: pools.Morning?.[picks.Morning] ?? null,
      Afternoon: pools.Afternoon?.[picks.Afternoon] ?? null,
      Evening: pools.Evening?.[picks.Evening] ?? null,
    };
    const { data, error } = await supabase
      .from('trips')
      .insert({
        user_id: userId,
        destination: form.destination,
        arrival_date: form.arrivalDate,
        persona: form.persona,
        budget: form.budget,
        energy: form.energy,
        picks_snapshot: snapshot,
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (err) {
    console.warn('saveTrip failed (non-critical):', err.message);
    return null;
  }
};

/**
 * Fetch the authenticated user's saved trips, most recent first.
 *
 * @param {string} userId
 * @returns {Promise<object[]>}
 */
export const getUserTrips = async (userId) => {
  if (!import.meta.env.VITE_SUPABASE_URL) return [];
  const { data, error } = await supabase
    .from('trips')
    .select('id, destination, arrival_date, persona, budget, picks_snapshot, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) { console.warn('getUserTrips failed:', error.message); return []; }
  return data;
};

/**
 * Save a shareable copy (no user_id required for read access).
 *
 * @param {string} userId
 * @param {object} payload
 * @returns {Promise<string|null>} share id
 */
export const createShareableTrip = async (userId, payload) => {
  if (!import.meta.env.VITE_SUPABASE_URL) return null;
  try {
    const { data, error } = await supabase
      .from('shared_itineraries')
      .insert({ user_id: userId, ...payload })
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  } catch (err) {
    console.warn('createShareableTrip failed:', err.message);
    return null;
  }
};

import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

/**
 * Fire a Firebase Analytics event.
 * Silently no-ops if analytics is unavailable (e.g. blocked by ad blocker).
 *
 * @param {string} eventName
 * @param {object} [params]
 */
export const track = async (eventName, params = {}) => {
  try {
    const instance = await analytics;
    if (instance) logEvent(instance, eventName, params);
  } catch {
    // Non-critical — never throw
  }
};

// Named event helpers keep call sites readable
export const trackItineraryGenerated = (destination, persona, budget) =>
  track('itinerary_generated', { destination, persona, budget });

export const trackActivityRerolled = (slot, destination) =>
  track('activity_rerolled', { slot, destination });

export const trackActivityLocked = (activityId, slot) =>
  track('activity_locked', { activity_id: activityId, slot });

export const trackExport = (format, destination) =>
  track('itinerary_exported', { format, destination });

export const trackShareLink = (destination) =>
  track('share_link_copied', { destination });

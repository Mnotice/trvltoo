import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

const track = (eventName, params = {}) => {
  try {
    if (analytics) logEvent(analytics, eventName, params);
  } catch {
    // Non-critical — never throw
  }
};

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

import { useState, useEffect } from 'react';
import {
  createTrip, subscribeUserTrips, updateTrip, deleteTrip,
  addSpotToTrip, removeSpotFromTrip, saveItinerary,
} from '../services/firestoreService';

export function useTrips(uid) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setTrips([]); setLoading(false); return; }
    setLoading(true);
    const unsub = subscribeUserTrips(uid, (data) => {
      setTrips(data);
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  return {
    trips,
    loading,
    createTrip: (data) => createTrip(uid, data),
    updateTrip,
    deleteTrip,
    addSpotToTrip,
    removeSpotFromTrip,
    saveItinerary,
  };
}

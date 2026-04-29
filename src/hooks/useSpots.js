import { useState, useEffect } from 'react';
import {
  createSpot, subscribeUserSpots, updateSpot, deleteSpot,
} from '../services/firestoreService';

export function useSpots(uid) {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setSpots([]); setLoading(false); return; }
    setLoading(true);
    const unsub = subscribeUserSpots(uid, (data) => {
      setSpots(data);
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  return {
    spots,
    loading,
    createSpot: (data) => createSpot(uid, data),
    updateSpot,
    deleteSpot,
  };
}

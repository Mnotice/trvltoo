import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const FREE_TRIP_LIMIT = 3;

export function usePlan(uid) {
  const [plan,    setPlan]    = useState('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    const unsub = onSnapshot(doc(db, 'users', uid), snap => {
      setPlan(snap.exists() ? (snap.data().plan ?? 'free') : 'free');
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  return { plan, isPro: plan === 'pro', loading };
}

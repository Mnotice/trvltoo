import { db } from '../firebase';
import {
  collection, addDoc, getDocs, deleteDoc,
  doc, serverTimestamp, query, where,
} from 'firebase/firestore';

export async function saveTrip(userId, data) {
  const ref = await addDoc(collection(db, 'trips'), {
    userId,
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserTrips(userId) {
  const q = query(collection(db, 'trips'), where('userId', '==', userId));
  const snap = await getDocs(q);
  const trips = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return trips.sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));
}

export async function deleteTrip(tripId) {
  await deleteDoc(doc(db, 'trips', tripId));
}

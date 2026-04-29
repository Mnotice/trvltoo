import { db } from '../firebase';
import {
  collection, doc, addDoc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp, arrayUnion, arrayRemove,
  onSnapshot, increment,
} from 'firebase/firestore';

// ── Users ─────────────────────────────────────────────────────────────────────

export async function upsertUser(uid, profile) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { ...profile, createdAt: serverTimestamp() });
  } else {
    await updateDoc(ref, profile);
  }
}

export async function getUser(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ── Trips ─────────────────────────────────────────────────────────────────────

export async function createTrip(uid, data) {
  const ref = await addDoc(collection(db, 'trips'), {
    ...data,
    createdBy: uid,
    collaborators: [],
    spotIds: [],
    itinerary: null,
    isPublic: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getTrip(tripId) {
  const snap = await getDoc(doc(db, 'trips', tripId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getUserTrips(uid) {
  const q = query(
    collection(db, 'trips'),
    where('createdBy', '==', uid),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function subscribeUserTrips(uid, callback) {
  const q = query(
    collection(db, 'trips'),
    where('createdBy', '==', uid),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function updateTrip(tripId, data) {
  await updateDoc(doc(db, 'trips', tripId), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteTrip(tripId) {
  await deleteDoc(doc(db, 'trips', tripId));
}

export async function addSpotToTrip(tripId, spotId) {
  await updateDoc(doc(db, 'trips', tripId), {
    spotIds: arrayUnion(spotId),
    updatedAt: serverTimestamp(),
  });
}

export async function removeSpotFromTrip(tripId, spotId) {
  await updateDoc(doc(db, 'trips', tripId), {
    spotIds: arrayRemove(spotId),
    updatedAt: serverTimestamp(),
  });
}

export async function saveItinerary(tripId, itinerary) {
  await updateDoc(doc(db, 'trips', tripId), {
    itinerary,
    updatedAt: serverTimestamp(),
  });
}

// ── Spots ─────────────────────────────────────────────────────────────────────

export async function createSpot(uid, data) {
  const ref = await addDoc(collection(db, 'spots'), {
    ...data,
    createdBy: uid,
    tripIds: [],
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getSpot(spotId) {
  const snap = await getDoc(doc(db, 'spots', spotId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getSpots(spotIds) {
  if (!spotIds?.length) return [];
  const snaps = await Promise.all(spotIds.map(id => getDoc(doc(db, 'spots', id))));
  return snaps.filter(s => s.exists()).map(s => ({ id: s.id, ...s.data() }));
}

export async function getUserSpots(uid) {
  const q = query(
    collection(db, 'spots'),
    where('createdBy', '==', uid),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function subscribeUserSpots(uid, callback) {
  const q = query(
    collection(db, 'spots'),
    where('createdBy', '==', uid),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function updateSpot(spotId, data) {
  await updateDoc(doc(db, 'spots', spotId), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteSpot(spotId) {
  await deleteDoc(doc(db, 'spots', spotId));
}

// ── Collections ───────────────────────────────────────────────────────────────

export async function createCollection(uid, data) {
  const ref = await addDoc(collection(db, 'collections'), {
    ...data,
    createdBy: uid,
    spotIds: [],
    isPublic: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserCollections(uid) {
  const q = query(
    collection(db, 'collections'),
    where('createdBy', '==', uid),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addSpotToCollection(collectionId, spotId) {
  await updateDoc(doc(db, 'collections', collectionId), {
    spotIds: arrayUnion(spotId),
  });
}

export async function removeSpotFromCollection(collectionId, spotId) {
  await updateDoc(doc(db, 'collections', collectionId), {
    spotIds: arrayRemove(spotId),
  });
}

export async function deleteCollection(collectionId) {
  await deleteDoc(doc(db, 'collections', collectionId));
}

// ── Shares ────────────────────────────────────────────────────────────────────

export async function createShare(uid, tripId, options = {}) {
  const ref = await addDoc(collection(db, 'shares'), {
    tripId,
    createdBy: uid,
    viewCount: 0,
    expiresAt: options.expiresAt ?? null,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getShare(shareId) {
  const snap = await getDoc(doc(db, 'shares', shareId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function incrementShareView(shareId) {
  await updateDoc(doc(db, 'shares', shareId), { viewCount: increment(1) });
}

export async function deleteShare(shareId) {
  await deleteDoc(doc(db, 'shares', shareId));
}

// ── Real-time trip subscription ───────────────────────────────────────────────

export function subscribeTrip(tripId, callback) {
  return onSnapshot(doc(db, 'trips', tripId), snap => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

// ── Invites ───────────────────────────────────────────────────────────────────

export async function createInvite(tripId, uid) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const ref = await addDoc(collection(db, 'invites'), {
    tripId, createdBy: uid, expiresAt, createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getInvite(inviteId) {
  const snap = await getDoc(doc(db, 'invites', inviteId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function acceptInvite(inviteId, uid) {
  const invite = await getInvite(inviteId);
  if (!invite) throw new Error('Invite not found');
  if (invite.expiresAt?.toDate?.() < new Date()) throw new Error('Invite has expired');
  await updateDoc(doc(db, 'trips', invite.tripId), {
    collaborators: arrayUnion(uid),
    updatedAt: serverTimestamp(),
  });
  return invite.tripId;
}

// ── Comments (subcollection of trips) ────────────────────────────────────────

export async function addComment(tripId, { uid, displayName, photoURL, text }) {
  await addDoc(collection(db, 'trips', tripId, 'comments'), {
    uid, displayName, photoURL: photoURL ?? null, text,
    createdAt: serverTimestamp(),
  });
}

export function subscribeComments(tripId, callback) {
  const q = query(
    collection(db, 'trips', tripId, 'comments'),
    orderBy('createdAt', 'asc'),
  );
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

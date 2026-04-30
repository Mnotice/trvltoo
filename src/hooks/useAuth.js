import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { upsertUser } from '../services/firestoreService';

export function useAuth() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    await upsertUser(cred.user.uid, {
      displayName: cred.user.displayName,
      email: cred.user.email,
      photoURL: cred.user.photoURL ?? null,
    });
  }

  async function signInWithEmail(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await upsertUser(cred.user.uid, { email: cred.user.email });
  }

  async function signUpWithEmail(email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(cred.user);
    await upsertUser(cred.user.uid, {
      email: cred.user.email,
      displayName: null,
      photoURL: null,
    });
  }

  async function sendPasswordReset(email) {
    await sendPasswordResetEmail(auth, email);
  }

  async function signOutUser() {
    await signOut(auth);
  }

  return {
    user,
    loading: user === undefined,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    signOut: signOutUser,
  };
}

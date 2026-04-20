import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  type User as FirebaseUser,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from 'firebase/auth';
import {
  initializeFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';

// Import Firebase config
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig as any);

// Initialize services
export const auth = getAuth(app);
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Auth functions
export const loginWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};

export const signInWithEmailAndPassword = (email: string, password: string) => {
  return firebaseSignInWithEmailAndPassword(auth, email, password);
};

export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

// Firestore exports
export {
  FirebaseUser,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
};

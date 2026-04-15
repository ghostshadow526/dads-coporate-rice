import { initializeApp } from 'firebase/app';
import { getAuth, type User as FirebaseUser } from 'firebase/auth';
import { initializeFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Minimal Firebase setup for standalone admin usage
const app = initializeApp(firebaseConfig as any);

export const db = initializeFirestore(app, { experimentalForceLongPolling: true });
export const auth = getAuth(app);

export { FirebaseUser, collection, getDocs, updateDoc, doc };

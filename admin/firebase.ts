import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, type User as FirebaseUser } from 'firebase/auth';
import { initializeFirestore, getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Minimal Firebase setup for standalone admin usage
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig as any);
const dbId = (firebaseConfig as any).firestoreDatabaseId || '(default)';

let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(app, { experimentalForceLongPolling: true }, dbId);
} catch {
  firestoreInstance = getFirestore(app, dbId);
}

export const db = firestoreInstance;
export const auth = getAuth(app);

export { FirebaseUser, collection, getDocs, updateDoc, doc };

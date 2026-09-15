import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const customDbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

// Suppress transient network offline/reconnection messages from polluting console
try {
  setLogLevel('error');
} catch {
  // Ignore in environments where setLogLevel may not be available
}

// Initialize Firestore singleton
export const db = (() => {
  try {
    return initializeFirestore(
      firebaseApp,
      {
        ignoreUndefinedProperties: true
      },
      customDbId
    );
  } catch {
    // If already initialized, fall back to getFirestore
    return customDbId ? getFirestore(firebaseApp, customDbId) : getFirestore(firebaseApp);
  }
})();


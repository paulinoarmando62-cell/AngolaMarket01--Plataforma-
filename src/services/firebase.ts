import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  setLogLevel,
  memoryLocalCache
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const customDbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

// Suppress console spam
try {
  setLogLevel('silent');
} catch {
  // Ignore
}

// Initialize Firestore singleton with memory cache only to guarantee operations reach the cloud
export const db = (() => {
  try {
    return initializeFirestore(
      firebaseApp,
      {
        ignoreUndefinedProperties: true,
        experimentalForceLongPolling: true,
        localCache: memoryLocalCache()
      },
      customDbId
    );
  } catch {
    try {
      return initializeFirestore(
        firebaseApp,
        {
          ignoreUndefinedProperties: true,
          experimentalForceLongPolling: true
        },
        customDbId
      );
    } catch {
      return customDbId ? getFirestore(firebaseApp, customDbId) : getFirestore(firebaseApp);
    }
  }
})();


import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  setLogLevel,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const customDbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

// Suppress transient network offline/reconnection messages from polluting console
try {
  setLogLevel('silent');
} catch {
  // Ignore in environments where setLogLevel may not be available
}

// Initialize Firestore singleton with long-polling and robust multi-tab offline caching
export const db = (() => {
  try {
    return initializeFirestore(
      firebaseApp,
      {
        ignoreUndefinedProperties: true,
        experimentalForceLongPolling: true,
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
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
      // If already initialized, fall back to getFirestore
      return customDbId ? getFirestore(firebaseApp, customDbId) : getFirestore(firebaseApp);
    }
  }
})();


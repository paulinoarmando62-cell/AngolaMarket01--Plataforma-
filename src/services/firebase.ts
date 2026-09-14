import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const customDbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? firebaseConfig.firestoreDatabaseId
  : undefined;

const isBrowser = typeof window !== 'undefined';

// Initialize Firestore with long-polling in browser environments to avoid WebSocket/proxy blocks
export const db = (() => {
  try {
    return initializeFirestore(
      firebaseApp,
      {
        ...(isBrowser ? { experimentalForceLongPolling: true } : {}),
        ignoreUndefinedProperties: true
      },
      customDbId
    );
  } catch {
    // If already initialized, fall back to getFirestore
    return customDbId ? getFirestore(firebaseApp, customDbId) : getFirestore(firebaseApp);
  }
})();

/**
 * Validates connection to the Firestore server
 */
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Connection validated with Firestore server.');
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('offline') || error.message.includes('unavailable'))) {
      console.warn('[Firebase] Firestore running with local persistence/reconnecting.');
      return false;
    }
    // Any other response (like document not found or permission check) confirms reachability to the server
    return true;
  }
}

// Initial connection test deferred slightly so the app mounts first
if (isBrowser) {
  setTimeout(() => {
    testConnection().catch(() => {});
  }, 1000);
}

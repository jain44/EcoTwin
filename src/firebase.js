import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize app — reuse if already initialized (handles HMR in dev)
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

// Auth
export const auth = getAuth(app);

// Firestore — try offline-persistent cache, fall back to standard mode
// (persistent cache can fail on: Safari private mode, already-initialized app, some SSR envs)
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch (_) {
  try {
    db = getFirestore(app);
  } catch (e2) {
    console.error('Firestore init failed completely:', e2);
    // getFirestore with no options — absolute fallback
    db = getFirestore();
  }
}

export { db, signInAnonymously };

import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || "AIzaSyAYHyuIpuWi93QZkGeAegeyb8AQxRhFSig",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "ecotwin6544.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "ecotwin6544",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "ecotwin6544.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "9308335935",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || "1:9308335935:web:a5a09a4be9fb3e1ffdad8a",
};

// Safely initialize app
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
} catch (err) {
  console.error("Firebase initializeApp error:", err);
  app = getApps()[0] || initializeApp(firebaseConfig);
}

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore
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
    db = getFirestore(app);
  }
}

export {
  db,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
};

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import {
  calculateDailyFootprint,
  getRollingAverage,
  getTwinState,
  getDominantTrait,
  calculateGreenCoins,
  calculateAdjustedCoins,
  calculateTrustScore,
  extractDepartment,
  extractHostel,
} from '../engine/carbonCalc';
import { DEMO_USER, DEMO_HABIT_LOG } from '../data/seedData';
import { auth, db, signInAnonymously } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, updateDoc, collection, onSnapshot, writeBatch } from 'firebase/firestore';

import { seedMockUsersIfNeeded } from '../data/seedData';

// ─── Initial State ────────────────────────────────────────────────────────────
const INITIAL_STATE = {
  uid: null,
  userProfile: null,       // null = not onboarded yet
  habitLog: [],            // array of daily entries
  greenCoinsBalance: 850,  // starting balance for demo
  hasOnboarded: false,
  isOnline: navigator.onLine,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_UID':
      return { ...state, uid: action.payload };

    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };

    case 'SYNC_PROFILE': {
      if (!action.payload) return state;
      return {
        ...state,
        userProfile: {
          id: action.payload.id,
          name: action.payload.name,
          hostelOrBranch: action.payload.hostelOrBranch,
          department: action.payload.department,
          hostel: action.payload.hostel,
          createdAt: action.payload.createdAt,
        },
        greenCoinsBalance: action.payload.greenCoinsBalance ?? state.greenCoinsBalance,
        hasOnboarded: true,
      };
    }

    case 'SYNC_LOGS':
      return {
        ...state,
        habitLog: action.payload,
      };

    case 'SET_PROFILE':
      return { ...state, userProfile: action.payload, hasOnboarded: true };

    case 'ADD_HABIT_ENTRY': {
      const entry = {
        ...action.payload,
        computedFootprintKg: calculateDailyFootprint(action.payload),
      };
      const filtered = state.habitLog.filter((e) => e.date !== entry.date);
      const newLog = [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date));
      const coinsEarned = calculateAdjustedCoins(entry.computedFootprintKg, newLog);
      return {
        ...state,
        habitLog: newLog,
        greenCoinsBalance: state.greenCoinsBalance + coinsEarned,
      };
    }

    case 'LOAD_DEMO': {
      return {
        ...state,
        userProfile: DEMO_USER,
        habitLog: DEMO_HABIT_LOG,
        greenCoinsBalance: 850,
        hasOnboarded: true,
      };
    }

    case 'REDEEM_COINS': {
      const cost = action.payload;
      if (state.greenCoinsBalance < cost) return state;
      return { ...state, greenCoinsBalance: state.greenCoinsBalance - cost };
    }

    case 'RESET':
      return INITIAL_STATE;

    case 'HYDRATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);

  // 1. Online/Offline status listeners
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE', payload: false });
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. Firebase Auth & Firestore synchronization
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: 'SET_UID', payload: user.uid });
        seedMockUsersIfNeeded(db);

        // Listen for user profile in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            dispatch({ type: 'SYNC_PROFILE', payload: docSnap.data() });
          } else {
            // Check if we have onboarding data in localStorage to restore
            try {
              const stored = localStorage.getItem('ecotwin_state');
              if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.userProfile && !state.userProfile) {
                  // Restore profile to Firestore from local cache
                  const prof = parsed.userProfile;
                  const dept = extractDepartment(prof.hostelOrBranch);
                  const hostel = extractHostel(prof.hostelOrBranch, parsed.studentType ?? 'dayscholar');
                  setDoc(userDocRef, {
                    id: user.uid,
                    name: prof.name,
                    hostelOrBranch: prof.hostelOrBranch,
                    department: dept,
                    hostel: hostel,
                    greenCoinsBalance: parsed.greenCoinsBalance ?? 850,
                    trustScore: 100,
                    rollingAverage: 2.2,
                    createdAt: prof.createdAt || new Date().toISOString().split('T')[0],
                  });
                }
              }
            } catch (e) {
              console.error("Failed to restore from local storage:", e);
            }
          }
        });

        // Listen for habit logs in Firestore
        const logsRef = collection(db, 'users', user.uid, 'habitLogs');
        const unsubscribeLogs = onSnapshot(logsRef, (querySnap) => {
          const logs = [];
          querySnap.forEach((d) => {
            logs.push(d.data());
          });
          logs.sort((a, b) => a.date.localeCompare(b.date));
          dispatch({ type: 'SYNC_LOGS', payload: logs });
        });

        return () => {
          unsubscribeUser();
          unsubscribeLogs();
        };
      } else {
        signInAnonymously(auth).catch((err) => {
          console.error("Firebase Anonymous Auth Error:", err);
        });
      }
    });

    return unsubscribeAuth;
  }, []);

  // 3. Keep localStorage updated as fallback
  useEffect(() => {
    if (state.hasOnboarded) {
      try {
        localStorage.setItem('ecotwin_state', JSON.stringify({
          userProfile: state.userProfile,
          habitLog: state.habitLog,
          greenCoinsBalance: state.greenCoinsBalance,
          hasOnboarded: state.hasOnboarded,
        }));
      } catch (e) {
        console.error("Local storage save failed:", e);
      }
    }
  }, [state.userProfile, state.habitLog, state.greenCoinsBalance, state.hasOnboarded]);

  // ── Derived Twin State ────────────────────────────────────────────────────
  const rollingAverage = getRollingAverage(state.habitLog);
  const twinState = getTwinState(rollingAverage);
  const dominantTrait = getDominantTrait(state.habitLog);
  const trustData = calculateTrustScore(state.habitLog);
  const todayEntry = state.habitLog.find(
    (e) => e.date === new Date().toISOString().split('T')[0]
  );

  // 4. Expose actions that write to Firebase and fall back locally
  const setProfile = async (profile, studentType = 'dayscholar') => {
    // 1. Update local state
    dispatch({ type: 'SET_PROFILE', payload: profile });

    // 2. Sync to Firebase
    const user = auth.currentUser;
    if (user) {
      const dept = extractDepartment(profile.hostelOrBranch);
      const hostel = extractHostel(profile.hostelOrBranch, studentType);
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        name: profile.name,
        hostelOrBranch: profile.hostelOrBranch,
        department: dept,
        hostel: hostel,
        greenCoinsBalance: state.greenCoinsBalance,
        trustScore: 100,
        rollingAverage: 2.2,
        createdAt: profile.createdAt || new Date().toISOString().split('T')[0],
      });
    }
  };

  const addHabitEntry = async (entryData) => {
    // 1. Calculate locally and dispatch
    dispatch({ type: 'ADD_HABIT_ENTRY', payload: entryData });

    // 2. Sync to Firestore
    const user = auth.currentUser;
    if (user) {
      const computedFootprintKg = calculateDailyFootprint(entryData);
      const entry = {
        ...entryData,
        computedFootprintKg,
        createdAt: new Date().toISOString(),
      };

      // Recalculate metrics using the updated logs list
      const filtered = state.habitLog.filter((e) => e.date !== entry.date);
      const newLog = [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date));
      const coinsEarned = calculateAdjustedCoins(computedFootprintKg, newLog);
      const newBalance = state.greenCoinsBalance + coinsEarned;
      const newRollingAverage = getRollingAverage(newLog);
      const { score: newTrustScore } = calculateTrustScore(newLog);

      // Write log entry
      await setDoc(doc(db, 'users', user.uid, 'habitLogs', entry.date), entry);

      // Update root user profile aggregates
      await updateDoc(doc(db, 'users', user.uid), {
        greenCoinsBalance: newBalance,
        trustScore: newTrustScore,
        rollingAverage: newRollingAverage,
        lastActive: new Date().toISOString(),
      });
    }
  };

  const redeemCoins = async (cost) => {
    if (state.greenCoinsBalance < cost) return;
    dispatch({ type: 'REDEEM_COINS', payload: cost });

    const user = auth.currentUser;
    if (user) {
      const newBalance = state.greenCoinsBalance - cost;
      await updateDoc(doc(db, 'users', user.uid), {
        greenCoinsBalance: newBalance,
      });
    }
  };

  const loadDemo = async () => {
    dispatch({ type: 'LOAD_DEMO' });

    const user = auth.currentUser;
    if (user) {
      const batch = writeBatch(db);

      // 1. Set User Document
      const userRef = doc(db, 'users', user.uid);
      const dept = extractDepartment(DEMO_USER.hostelOrBranch);
      const hostel = extractHostel(DEMO_USER.hostelOrBranch, 'dayscholar');
      batch.set(userRef, {
        id: user.uid,
        name: DEMO_USER.name,
        hostelOrBranch: DEMO_USER.hostelOrBranch,
        department: dept,
        hostel: hostel,
        greenCoinsBalance: 850,
        trustScore: 100,
        rollingAverage: getRollingAverage(DEMO_HABIT_LOG),
        createdAt: DEMO_USER.createdAt,
      });

      // 2. Set all habit log sub-documents
      DEMO_HABIT_LOG.forEach((log) => {
        const logRef = doc(db, 'users', user.uid, 'habitLogs', log.date);
        batch.set(logRef, {
          ...log,
          createdAt: new Date().toISOString(),
        });
      });

      await batch.commit();
    }
  };

  const signOutUser = async () => {
    try {
      const { signOut } = await import('../firebase');
      await signOut(auth);
    } catch (e) {
      console.error("Sign out error:", e);
    }
    dispatch({ type: 'RESET' });
    localStorage.removeItem('ecotwin_state');
  };

  const value = {
    // Raw state
    uid: state.uid,
    userProfile: state.userProfile,
    habitLog: state.habitLog,
    greenCoinsBalance: state.greenCoinsBalance,
    hasOnboarded: state.hasOnboarded,
    isOnline: state.isOnline,

    // Derived
    rollingAverage,
    twinState,
    dominantTrait,
    trustData,
    todayEntry,
    currentScore: todayEntry?.computedFootprintKg ?? rollingAverage,

    // Actions
    setProfile,
    addHabitEntry,
    loadDemo,
    redeemCoins,
    reset,
    signOutUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}


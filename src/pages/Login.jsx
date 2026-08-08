import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  signInAnonymously
} from '../firebase';
import { Leaf, LogIn, UserPlus, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { setProfile, loadDemo } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        if (!name.trim()) { setError('Please enter your full name'); setLoading(false); return; }
        const res = await createUserWithEmailAndPassword(auth, email, password);
        if (res.user) {
          await setProfile({ id: res.user.uid, name: name.trim(), hostelOrBranch: 'Information Technology — TCET', createdAt: new Date().toISOString().split('T')[0] });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      let msg = 'Authentication failed. Please try again.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      else if (err.code === 'auth/email-already-in-use') msg = 'Account already exists. Try signing in!';
      else if (err.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
      else if (err.code === 'auth/invalid-email') msg = 'Please enter a valid email.';
      setError(msg);
    } finally { setLoading(false); }
  };

  const handleGoogleAuth = async () => {
    setError(''); setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res?.user) await setProfile({ id: res.user.uid, name: res.user.displayName || 'Student', hostelOrBranch: 'Information Technology — TCET', createdAt: new Date().toISOString().split('T')[0] });
      navigate('/dashboard');
    } catch (err) {
      let msg = 'Google Sign-In was cancelled or failed.';
      if (err.code === 'auth/unauthorized-domain') msg = 'Domain not authorized in Firebase Console → Authentication → Authorized domains.';
      setError(msg);
    } finally { setLoading(false); }
  };

  const handleGuestAuth = async () => {
    setError(''); setLoading(true);
    try { await signInAnonymously(auth); navigate('/dashboard'); }
    catch (err) { setError('Guest sign in failed.'); }
    finally { setLoading(false); }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await loadDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel (desktop only) ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-emerald-500 to-teal-600 p-10 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-white/10 rounded-full" />

        <div className="relative flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Leaf size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-extrabold text-xl text-white tracking-tight">EcoTwin</span>
        </div>

        <div className="relative flex flex-col gap-5">
          <h2 className="text-4xl font-display font-extrabold text-white leading-tight">
            Your sustainability<br />journey starts here
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Log habits, grow your digital twin, and compete with your department — all in real time.
          </p>
          <div className="flex flex-col gap-2.5 mt-2">
            {['🌱 Living digital twin that evolves', '🏆 Real-time EcoBattles leaderboard', '🪙 GreenCoins redeemable on campus'].map((f) => (
              <div key={f} className="bg-white/15 backdrop-blur rounded-xl px-4 py-2.5 text-xs text-white font-semibold">{f}</div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-emerald-200/70">PixxelHack 2.0 · TCET Mumbai · EcoLife Theme</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Leaf size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-extrabold text-lg text-gray-900">Eco<span className="text-emerald-500">Twin</span></span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-display font-extrabold text-gray-900">
                {isSignUp ? 'Create your account' : 'Welcome back 👋'}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {isSignUp ? "Join TCET's sustainability community" : 'Sign in to continue to EcoTwin'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              {[['Sign In', false], ['Register', true]].map(([label, val]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => { setIsSignUp(val); setError(''); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    isSignUp === val ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2.5 rounded-xl mb-4 flex items-center gap-2"
                >
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                  <input type="text" required placeholder="e.g. Jainam Shah" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" />
                </div>
              )}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" required placeholder="student@tcetmumbai.in" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
                <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm shadow-emerald-100 flex items-center justify-center gap-2">
                {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> :
                  isSignUp ? <><UserPlus size={15} /><span>Create Account</span></> : <><LogIn size={15} /><span>Sign In</span></>}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Social */}
            <div className="space-y-2.5">
              <button type="button" onClick={handleGoogleAuth} disabled={loading}
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button type="button" onClick={handleGuestAuth} disabled={loading}
                className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Quick Guest Sign-In (Anonymous)</span>
              </button>

              <button type="button" onClick={handleDemoLogin} disabled={loading}
                className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                <Sparkles size={14} className="text-amber-500" />
                <span>Load Demo Account (Jainam — 850 Coins)</span>
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-gray-300">
              Want to change settings later?{' '}
              <button onClick={() => navigate('/about')} className="text-emerald-500 hover:underline font-semibold">Learn More</button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

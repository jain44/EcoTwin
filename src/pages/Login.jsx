import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { Leaf, LogIn, UserPlus, Sparkles, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { loadDemo } = useApp();
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
        if (!name.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error("Auth error:", err);
      let msg = 'Authentication failed. Please try again.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setError('Google Sign-In was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAuth = async () => {
    setError('');
    setLoading(true);
    try {
      await signInAnonymously(auth);
      navigate('/dashboard');
    } catch (err) {
      console.error("Guest Auth Error:", err);
      setError('Guest sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await loadDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-950 via-forest-900 to-emerald-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden text-white">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-forest-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        {/* Header Branding */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20"
          >
            <Leaf size={28} className="text-forest-950" />
          </motion.div>
          <h1 className="text-2xl font-display font-bold text-white">
            {isSignUp ? 'Create EcoTwin Account' : 'Welcome to EcoTwin'}
          </h1>
          <p className="text-xs text-emerald-200/80 mt-1">
            TCET Gamified Sustainability Companion & Virtual Twin
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-black/20 p-1 rounded-2xl mb-6 border border-white/5">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              !isSignUp ? 'bg-emerald-500 text-forest-950 shadow-md' : 'text-emerald-200/70 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              isSignUp ? 'bg-emerald-500 text-forest-950 shadow-md' : 'text-emerald-200/70 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs px-4 py-2.5 rounded-xl mb-4 flex items-center gap-2"
            >
              <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[11px] uppercase font-bold text-emerald-300 tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required={isSignUp}
                placeholder="e.g. Jainam Shah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase font-bold text-emerald-300 tracking-wider mb-1">
              Student Email
            </label>
            <input
              type="email"
              required
              placeholder="student@tcetmumbai.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase font-bold text-emerald-300 tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold py-3 px-4 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-forest-950 border-t-transparent rounded-full animate-spin" />
            ) : isSignUp ? (
              <>
                <UserPlus size={16} />
                <span>Create Student Account</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Sign In to Twin</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/15" />
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-white/15" />
        </div>

        {/* Quick Auth Options */}
        <div className="space-y-2.5">
          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-medium py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Guest / Anonymous Sign In */}
          <button
            type="button"
            onClick={handleGuestAuth}
            disabled={loading}
            className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Quick Guest Sign-In (Anonymous)</span>
          </button>

          {/* Pre-loaded Demo Account */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-medium py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>Load Demo Account (Jainam — 850 Coins)</span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-white/50">
          Want to change profile settings later?{' '}
          <button
            type="button"
            onClick={() => navigate('/about')}
            className="text-emerald-300 hover:underline font-bold"
          >
            Learn More
          </button>
        </div>
      </motion.div>
    </div>
  );
}

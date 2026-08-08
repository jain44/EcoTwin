import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import TwinRenderer from '../components/twin/TwinRenderer';
import EcoShareCard from '../components/dashboard/EcoShareCard';
import {
  User,
  ShieldCheck,
  Coins,
  TreePine,
  Edit3,
  LogOut,
  Calendar,
  Award,
  Sparkles,
  QrCode,
  Share2,
  CheckCircle2,
  Building2,
  Home
} from 'lucide-react';

const DEPARTMENTS = [
  'Information Technology — TCET',
  'Computer Engineering — TCET',
  'Civil Engineering — TCET',
  'Electronics & TC — TCET',
  'Mechanical Engineering — TCET',
  'AIDS Dept — TCET',
  'Chemical Engineering — TCET',
  'Production Engineering — TCET',
];

export default function Profile() {
  const navigate = useNavigate();
  const {
    userProfile,
    habitLog,
    greenCoinsBalance,
    rollingAverage,
    twinState,
    trustData,
    setProfile,
    signOutUser,
    loadDemo,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userProfile?.name || 'Student',
    hostelOrBranch: userProfile?.hostelOrBranch || 'Information Technology — TCET',
    studentType: 'dayscholar',
  });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await setProfile(
      {
        id: userProfile?.id || `user-${Date.now()}`,
        name: editForm.name,
        hostelOrBranch: editForm.hostelOrBranch,
        createdAt: userProfile?.createdAt || new Date().toISOString().split('T')[0],
      },
      editForm.studentType
    );
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/login');
  };

  const streakDays = Math.min(habitLog.length, 7);

  return (
    <div className="page-content pt-4 pb-12">
      {/* Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-forest-900">👤 Student Profile</h1>
          <p className="text-sm text-moss-400 mt-0.5">Personal Sustainability Identity & Twin Status</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShareOpen(true)}
            className="btn-ghost flex items-center gap-1.5 text-xs text-forest-700 bg-forest-50 px-3 py-2 rounded-xl hover:bg-forest-100 transition-colors"
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">Eco-Card</span>
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 border border-rose-200 font-bold px-3 py-2 rounded-xl hover:bg-rose-100 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: User Identity Card & Quick Stats */}
        <div className="md:col-span-5 flex flex-col gap-5">
          {/* Identity Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="eco-card p-6 border-2 border-forest-200 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-forest-700 to-emerald-500 text-white flex items-center justify-center font-display font-extrabold text-2xl shadow-md">
                  {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 className="text-lg font-bold font-display text-forest-900 leading-tight">
                    {userProfile?.name || 'TCET Student'}
                  </h2>
                  <p className="text-xs text-moss-500 mt-0.5 flex items-center gap-1">
                    <Building2 size={12} className="text-moss-400" />
                    <span>{userProfile?.department || userProfile?.hostelOrBranch || 'TCET College'}</span>
                  </p>
                  <span className="inline-block text-[10px] uppercase font-extrabold tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md mt-1.5">
                    {userProfile?.hostel ? userProfile.hostel : 'Day Scholar'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditForm({
                    name: userProfile?.name || '',
                    hostelOrBranch: userProfile?.hostelOrBranch || DEPARTMENTS[0],
                    studentType: userProfile?.hostel ? 'hostelite' : 'dayscholar',
                  });
                  setIsEditing(true);
                }}
                className="p-2 text-moss-500 hover:text-forest-800 hover:bg-forest-50 rounded-xl transition-colors"
                title="Edit Profile"
              >
                <Edit3 size={18} />
              </button>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-forest-100 text-center">
              <div className="bg-cream-50 p-2.5 rounded-2xl border border-forest-100">
                <p className="text-[10px] font-bold text-moss-400 uppercase tracking-wider">Green Coins</p>
                <p className="text-base font-extrabold text-amber-600 mt-0.5">🪙 {greenCoinsBalance}</p>
              </div>
              <div className="bg-cream-50 p-2.5 rounded-2xl border border-forest-100">
                <p className="text-[10px] font-bold text-moss-400 uppercase tracking-wider">Trust Score</p>
                <p className="text-base font-extrabold text-emerald-600 mt-0.5">🛡️ {trustData?.score ?? 100}</p>
              </div>
              <div className="bg-cream-50 p-2.5 rounded-2xl border border-forest-100">
                <p className="text-[10px] font-bold text-moss-400 uppercase tracking-wider">7-Day Avg</p>
                <p className="text-base font-extrabold text-forest-800 mt-0.5">{rollingAverage.toFixed(1)} kg</p>
              </div>
            </div>
          </motion.div>

          {/* Eco-Twin Avatar Overview */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="eco-card p-6 flex flex-col items-center text-center relative"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-moss-400 mb-2">
              Virtual Digital Twin Avatar
            </span>

            <div className="scale-110 my-2">
              <TwinRenderer state={twinState} size="md" />
            </div>

            <div className="mt-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                twinState === 'thriving' ? 'bg-emerald-100 text-emerald-800' :
                twinState === 'wilting'  ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {twinState === 'thriving' ? 'Thriving Guardian Tree 🌳' :
                 twinState === 'wilting'  ? 'Wilting Twin 🥀' : 'Neutral Sprout 🌱'}
              </span>
              <p className="text-xs text-moss-500 mt-2 max-w-xs">
                Your Eco-Twin evolves dynamically based on your daily transit, diet, and energy choices.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Habit Log History Timeline & Badges */}
        <div className="md:col-span-7 flex flex-col gap-5">
          {/* Recent Habit History */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="eco-card p-6"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-forest-100">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-forest-700" />
                <h3 className="text-base font-bold font-display text-forest-900">Habit Log Timeline</h3>
              </div>
              <span className="text-xs text-moss-500 font-semibold">{habitLog.length} total entries</span>
            </div>

            {habitLog.length === 0 ? (
              <div className="text-center py-8 text-moss-400">
                <p className="text-sm italic">No habits logged yet.</p>
                <button
                  onClick={() => navigate('/log')}
                  className="btn-primary text-xs mt-3 py-2 px-4"
                >
                  Log First Habit 🌿
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {[...habitLog].reverse().map((entry, idx) => (
                  <div
                    key={entry.date || idx}
                    className="p-3.5 bg-cream-50 border border-forest-100 rounded-2xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-sm">
                        {entry.commuteMode === 'walk' ? '🚶' :
                         entry.commuteMode === 'cycle' ? '🚲' :
                         entry.commuteMode === 'train' ? '🚆' :
                         entry.commuteMode === 'bus'   ? '🚌' : '🚗'}
                      </div>
                      <div>
                        <p className="font-bold text-forest-900">
                          {entry.date} {entry.source === 'qr' && <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 ml-1">✅ QR Verified</span>}
                        </p>
                        <p className="text-moss-500 text-[11px]">
                          {entry.commuteMode} ({entry.commuteDistanceKm}km) · {entry.dietType} diet · {entry.energyUsageHours}h energy
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-extrabold text-forest-800">{entry.computedFootprintKg} kg CO₂</p>
                      <p className="text-[10px] text-emerald-600 font-semibold">+Coins logged</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Account Actions Bar */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadDemo}
              className="flex-1 text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              <span>Reload Demo Profile</span>
            </button>
            <button
              onClick={() => navigate('/qr-locations')}
              className="flex-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <QrCode size={14} />
              <span>Campus QR Printable Signs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-forest-150"
            >
              <h3 className="text-lg font-bold font-display text-forest-900 mb-1">Edit Student Profile</h3>
              <p className="text-xs text-moss-400 mb-4">Update your campus department and residency info.</p>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-forest-800 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-cream-50 border border-forest-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-forest-900 focus:outline-none focus:border-forest-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-800 mb-1">Department / Branch</label>
                  <select
                    value={editForm.hostelOrBranch}
                    onChange={(e) => setEditForm({ ...editForm, hostelOrBranch: e.target.value })}
                    className="w-full bg-cream-50 border border-forest-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-forest-900 focus:outline-none focus:border-forest-500"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-forest-800 mb-1">Student Residency</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, studentType: 'dayscholar' })}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                        editForm.studentType === 'dayscholar'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-forest-100 bg-cream-50 text-moss-500'
                      }`}
                    >
                      <Home size={14} />
                      Day Scholar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, studentType: 'hostelite' })}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                        editForm.studentType === 'hostelite'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-forest-100 bg-cream-50 text-moss-500'
                      }`}
                    >
                      <Building2 size={14} />
                      Hostel Resident
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 btn-ghost py-2.5 text-xs text-moss-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary py-2.5 text-xs font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Eco Card Modal */}
      <AnimatePresence>
        {shareOpen && (
          <EcoShareCard
            userProfile={userProfile}
            rollingAverage={rollingAverage}
            twinState={twinState}
            greenCoinsBalance={greenCoinsBalance}
            onClose={() => setShareOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

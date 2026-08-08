import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { calculateDailyFootprint, getTwinState, formatFootprint, calculateGreenCoins } from '../engine/carbonCalc';
import TwinRenderer from '../components/twin/TwinRenderer';
import QRScanner from '../components/qr/QRScanner';
import { QrCode } from 'lucide-react';

const COMMUTE_MODES = [
  { id: 'train', label: 'Local Train', icon: '🚆' },
  { id: 'bus',   label: 'Bus',         icon: '🚌' },
  { id: 'bike',  label: 'Bike',        icon: '🛵' },
  { id: 'car',   label: 'Car / Cab',   icon: '🚗' },
  { id: 'walk',  label: 'Walk',        icon: '🚶' },
  { id: 'cycle', label: 'Cycle',       icon: '🚲' },
];

const DIET_TYPES = [
  { id: 'vegan',  label: 'Vegan',   icon: '🥦' },
  { id: 'veg',    label: 'Veg',     icon: '🥗' },
  { id: 'nonveg', label: 'Non-Veg', icon: '🍗' },
];

export default function HabitLog() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addHabitEntry, habitLog, twinState } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];
  const existing = habitLog.find((e) => e.date === todayStr);

  // Pick up pre-fill from QR scan (passed via navigation state)
  const qrPreFill = location.state?.qrPreFill ?? null;

  const [form, setForm] = useState({
    commuteMode: qrPreFill?.commuteMode ?? existing?.commuteMode ?? (habitLog.at(-1)?.commuteMode ?? 'train'),
    commuteDistanceKm: qrPreFill?.commuteDistanceKm ?? existing?.commuteDistanceKm ?? (habitLog.at(-1)?.commuteDistanceKm ?? 15),
    dietType: qrPreFill?.dietType ?? existing?.dietType ?? (habitLog.at(-1)?.dietType ?? 'veg'),
    mealsCount: qrPreFill?.mealsCount ?? existing?.mealsCount ?? (habitLog.at(-1)?.mealsCount ?? 3),
    energyUsageHours: qrPreFill?.energyUsageHours ?? existing?.energyUsageHours ?? (habitLog.at(-1)?.energyUsageHours ?? 4),
    source: qrPreFill?.source ?? 'manual',
    locationName: qrPreFill?.locationName ?? null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [newState, setNewState] = useState(twinState);
  const [scannerOpen, setScannerOpen] = useState(false);

  const preview = calculateDailyFootprint(form);
  const previewState = getTwinState(preview);
  const coinsEarned = calculateGreenCoins(preview);
  const stateChanged = previewState !== twinState;

  const [photo, setPhoto] = useState(existing?.photoUrl ?? null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleScanSuccess = (payload) => {
    setScannerOpen(false);
    setForm((f) => ({
      ...f,
      commuteMode: payload.commuteMode ?? f.commuteMode,
      commuteDistanceKm: payload.commuteDistanceKm ?? f.commuteDistanceKm,
      dietType: payload.dietType ?? f.dietType,
      mealsCount: payload.mealsCount ?? f.mealsCount,
      energyUsageHours: payload.energyUsageHours ?? f.energyUsageHours,
      source: payload.source ?? 'qr',
      locationName: payload.locationName ?? null,
    }));
  };

  const handleSubmit = () => {
    addHabitEntry({ date: todayStr, ...form, photoUrl: photo });
    setNewState(previewState);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page-content pt-6 flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 200 }}
        >
          <TwinRenderer state={newState} size="lg" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-display font-bold text-forest-900 mb-2">
            Logged! ✅
          </h2>
          <p className="text-moss-500 text-sm mb-1">
            Today's footprint: <strong className="text-forest-700">{formatFootprint(preview)}</strong>
          </p>
          <p className="text-moss-500 text-sm mb-4">
            +{coinsEarned} 🪙 Green Coins earned
          </p>
          {stateChanged && (
            <motion.div
              className="eco-card p-3 mb-4 bg-gradient-thriving"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-sm font-semibold text-forest-700">
                🌿 Your Twin has transitioned to <strong>{newState}</strong>!
              </p>
            </motion.div>
          )}
          <button className="btn-primary w-full" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-content pt-4">
      {/* QR Scanner Modal */}
      <AnimatePresence>
        {scannerOpen && (
          <QRScanner
            onScanSuccess={handleScanSuccess}
            onClose={() => setScannerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate('/dashboard')} className="btn-ghost text-sm -ml-1 flex items-center gap-1">
            ← Back
          </button>
          <button
            onClick={() => setScannerOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shadow-sm"
            id="open-qr-scanner-btn"
          >
            <QrCode size={14} />
            <span>Scan QR Location</span>
          </button>
        </div>
        <h1 className="text-2xl font-display font-bold text-forest-900">
          {existing ? "Update Today's Log" : "Log Today's Habits"}
        </h1>
        <p className="text-sm text-moss-400 mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        {form.source === 'qr' && form.locationName && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-xl"
          >
            <QrCode size={14} />
            <span>✅ QR Verified: {form.locationName} — +15 Integrity Bonus Applied</span>
          </motion.div>
        )}
      </motion.div>

      {/* Footprint preview strip — no twin avatar here (twin shown in right panel) */}
      <motion.div
        className="eco-card p-4 mb-5 flex items-center justify-between gap-4"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${
            previewState === 'thriving' ? 'bg-emerald-50 border border-emerald-200' :
            previewState === 'wilting'  ? 'bg-rose-50 border border-rose-200' :
                                          'bg-amber-50 border border-amber-200'
          }`}>
            {previewState === 'thriving' ? '🌿' : previewState === 'wilting' ? '🥀' : '🌱'}
          </div>
          <div>
            <p className="text-xs text-moss-500 mb-0.5">Estimated footprint today</p>
            <p className="text-2xl font-bold font-display text-forest-800">
              {formatFootprint(preview)}
            </p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            previewState === 'thriving' ? 'bg-emerald-100 text-emerald-700' :
            previewState === 'wilting'  ? 'bg-rose-100 text-rose-700' :
                                          'bg-amber-100 text-amber-700'
          }`}>
            {previewState === 'thriving' ? 'Thriving 🌳' : previewState === 'wilting' ? 'Wilting 🥀' : 'Neutral 🌱'}
          </span>
          <p className="text-xs text-moss-400">+{coinsEarned} 🪙 coins if logged</p>
        </div>
      </motion.div>


      {/* ── Main Habit Log Responsive Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* ── Left Column: Habit Logger Form ── */}
        <div className="md:col-span-7 flex flex-col gap-4">
          {/* ── COMMUTE ── */}
          <motion.div
            className="eco-card p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="eco-label text-base mb-2">Commute mode today</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2">
              {COMMUTE_MODES.map((m) => (
                <button
                  key={m.id}
                  id={`log-commute-${m.id}`}
                  onClick={() => onChange('commuteMode', m.id)}
                  className={`flex flex-col items-center justify-center gap-1 p-3 rounded-2xl text-xs font-semibold transition-all duration-200 border-2 ${
                    form.commuteMode === m.id
                      ? 'border-forest-500 bg-thriving-50 text-forest-700 shadow-sm'
                      : 'border-forest-100 bg-cream-50 text-moss-500 hover:border-forest-200'
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>

            {form.commuteMode && form.commuteMode !== 'walk' && form.commuteMode !== 'cycle' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-3 border-t border-forest-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="eco-label mb-0 font-semibold">One-way distance</label>
                  {/* Stepper control */}
                  <div className="flex items-center gap-2 bg-forest-50 p-1 rounded-xl border border-forest-200">
                    <button
                      onClick={() => onChange('commuteDistanceKm', Math.max(1, form.commuteDistanceKm - 1))}
                      className="w-7 h-7 rounded-lg bg-white text-forest-800 font-bold hover:bg-forest-100 flex items-center justify-center transition-colors shadow-xs"
                      aria-label="Decrease distance"
                    >
                      -
                    </button>
                    <span className="text-xs font-extrabold text-forest-900 px-2 min-w-[48px] text-center">
                      {form.commuteDistanceKm} km
                    </span>
                    <button
                      onClick={() => onChange('commuteDistanceKm', Math.min(60, form.commuteDistanceKm + 1))}
                      className="w-7 h-7 rounded-lg bg-white text-forest-800 font-bold hover:bg-forest-100 flex items-center justify-center transition-colors shadow-xs"
                      aria-label="Increase distance"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-5 gap-1.5 mt-3">
                  {[5, 8, 15, 25, 40].map((dist) => (
                    <button
                      key={dist}
                      type="button"
                      onClick={() => onChange('commuteDistanceKm', dist)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                        form.commuteDistanceKm === dist
                          ? 'bg-forest-600 text-white border-forest-600 shadow-xs'
                          : 'bg-cream-50 text-forest-800 border-forest-100 hover:bg-cream-100'
                      }`}
                    >
                      {dist} km
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* ── DIET ── */}
          <motion.div
            className="eco-card p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="eco-label text-base mb-2">Diet today</label>
            <div className="flex gap-3 mt-2">
              {DIET_TYPES.map((d) => (
                <button
                  key={d.id}
                  id={`log-diet-${d.id}`}
                  onClick={() => onChange('dietType', d.id)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl text-xs font-semibold transition-all duration-200 border-2 ${
                    form.dietType === d.id
                      ? 'border-forest-500 bg-thriving-50 text-forest-700 shadow-sm'
                      : 'border-forest-100 bg-cream-50 text-moss-500 hover:border-forest-200'
                  }`}
                >
                  <span className="text-2xl">{d.icon}</span>
                  {d.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-forest-50">
              <label className="eco-label mb-0 mr-2">Meals today:</label>
              <div className="flex-1 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    id={`log-meals-${n}`}
                    onClick={() => onChange('mealsCount', n)}
                    className={`py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                      form.mealsCount === n
                        ? 'bg-forest-600 text-white shadow-sm'
                        : 'bg-cream-100 text-forest-700 border border-forest-100 hover:bg-cream-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* 📸 Meal Photo Verification (Anti-Cheat / Trust Proof) */}
            <div className="mt-4 pt-3 border-t border-forest-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">📸</span>
                  <label className="eco-label mb-0">Meal Photo Proof (Optional)</label>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  +10 Bonus Coins
                </span>
              </div>

              {photo ? (
                <div className="flex items-center gap-3 bg-cream-50 p-2.5 rounded-2xl border border-forest-100">
                  <img src={photo} alt="Meal proof" className="w-14 h-14 object-cover rounded-xl border border-forest-200" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-forest-800 flex items-center gap-1">
                      <span>✅ Photo Verified</span>
                    </p>
                    <p className="text-[10px] text-moss-500">Increases Integrity & Trust Score</p>
                  </div>
                  <button
                    onClick={() => setPhoto(null)}
                    className="text-xs text-rose-500 font-bold hover:underline px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 bg-cream-50 border-2 border-dashed border-forest-200 hover:border-forest-400 p-3 rounded-2xl cursor-pointer text-xs font-bold text-forest-700 hover:bg-cream-100 transition-all">
                  <span>📷 Click or Upload Meal Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>
          </motion.div>

          {/* ── ENERGY ── */}
          <motion.div
            className="eco-card p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="eco-label text-base mb-0">Appliance hours today</label>
              {/* Stepper control */}
              <div className="flex items-center gap-2 bg-forest-50 p-1 rounded-xl border border-forest-200">
                <button
                  onClick={() => onChange('energyUsageHours', Math.max(0, form.energyUsageHours - 1))}
                  className="w-7 h-7 rounded-lg bg-white text-forest-800 font-bold hover:bg-forest-100 flex items-center justify-center transition-colors shadow-xs"
                  aria-label="Decrease energy hours"
                >
                  -
                </button>
                <span className="text-xs font-extrabold text-forest-900 px-2 min-w-[48px] text-center">
                  {form.energyUsageHours} h
                </span>
                <button
                  onClick={() => onChange('energyUsageHours', Math.min(16, form.energyUsageHours + 1))}
                  className="w-7 h-7 rounded-lg bg-white text-forest-800 font-bold hover:bg-forest-100 flex items-center justify-center transition-colors shadow-xs"
                  aria-label="Increase energy hours"
                >
                  +
                </button>
              </div>
            </div>

            {/* Preset Chips */}
            <div className="grid grid-cols-5 gap-1.5 mt-3">
              {[0, 2, 4, 8, 12].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => onChange('energyUsageHours', hrs)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                    form.energyUsageHours === hrs
                      ? 'bg-forest-600 text-white border-forest-600 shadow-xs'
                      : 'bg-cream-50 text-forest-800 border-forest-100 hover:bg-cream-100'
                  }`}
                >
                  {hrs}h
                </button>
              ))}
            </div>

            <p className="text-[11px] text-moss-400 mt-3">
              India grid factor: 0.82 kg CO₂e/kWh (CEA 2023) · ~0.3 kWh per appliance-hour
            </p>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            id="submit-habit-log"
            className="btn-primary w-full py-4 text-base mt-1"
            onClick={handleSubmit}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Save Today's Log 🌿
          </motion.button>
        </div>

        {/* ── Right Column: Live Footprint & Twin Preview ── */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <motion.div
            className="eco-card p-5 flex flex-col items-center text-center sticky top-24"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="section-title mb-3">Live Eco-Twin Impact</h3>
            <div className="my-2">
              <TwinRenderer state={previewState} size="lg" />
            </div>
            
            <div className="w-full bg-cream-50 rounded-2xl p-4 border border-forest-100 my-3">
              <p className="text-xs text-moss-500 font-semibold mb-1">Estimated Daily Emissions</p>
              <p className="text-3xl font-bold font-display text-forest-800">
                {formatFootprint(preview)}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                <span>🪙</span>
                <span>+{coinsEarned} GreenCoins earned</span>
              </div>
            </div>

            <div className="w-full text-left bg-forest-50/60 p-4 rounded-2xl border border-forest-100/60">
              <p className="text-xs font-bold text-forest-800 mb-1">💡 Daily Eco Tip</p>
              <p className="text-xs text-moss-600 leading-relaxed">
                Taking the local train or walking short distances saves up to 2.4 kg CO₂ per trip compared to private vehicles!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

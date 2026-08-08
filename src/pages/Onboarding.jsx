import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TwinRenderer from '../components/twin/TwinRenderer';
import { getTwinState, calculateDailyFootprint } from '../engine/carbonCalc';

// ── Step 1: Commute ──────────────────────────────────────────────────────────
const COMMUTE_MODES = [
  { id: 'train', label: 'Local Train', icon: '🚆', hint: 'Suburban / Metro' },
  { id: 'bus',   label: 'Bus / BEST', icon: '🚌', hint: 'BEST, NMMT, TMT' },
  { id: 'bike',  label: 'Bike / Scooter', icon: '🛵', hint: 'Two-wheeler' },
  { id: 'car',   label: 'Car / Cab', icon: '🚗', hint: 'Personal / Cab' },
  { id: 'walk',  label: 'Walk / Hostel',  icon: '🚶', hint: 'On-campus / Walking' },
  { id: 'cycle', label: 'Cycle',     icon: '🚲', hint: 'Zero-emission' },
];

function StepCommute({ values, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-forest-900 mb-1">
          How do you commute?
        </h2>
        <p className="text-xs md:text-sm text-moss-500">
          Select your primary travel mode to TCET, Kandivali
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {COMMUTE_MODES.map((mode) => {
          const isSelected = values.commuteMode === mode.id;
          return (
            <button
              key={mode.id}
              id={`commute-${mode.id}`}
              onClick={() => onChange('commuteMode', mode.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl text-center transition-all duration-200 border-2 ${
                isSelected
                  ? 'border-forest-600 bg-thriving-50/90 text-forest-800 shadow-sm ring-2 ring-forest-200'
                  : 'border-forest-100/80 bg-white hover:border-forest-200 text-moss-600 hover:bg-cream-50'
              }`}
            >
              <span className="text-2xl mb-1">{mode.icon}</span>
              <span className="text-xs font-bold text-forest-900">{mode.label}</span>
              <span className="text-[10px] text-moss-400 mt-0.5 leading-tight">{mode.hint}</span>
            </button>
          );
        })}
      </div>

      {values.commuteMode && values.commuteMode !== 'walk' && values.commuteMode !== 'cycle' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cream-50/80 rounded-2xl p-4 border border-forest-100 mt-1"
        >
          <div className="flex items-center justify-between mb-2">
            <label className="eco-label text-xs mb-0">
              One-way distance
            </label>
            {/* Stepper control */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-forest-200">
              <button
                type="button"
                onClick={() => onChange('commuteDistanceKm', Math.max(1, values.commuteDistanceKm - 1))}
                className="w-6 h-6 rounded-lg bg-cream-100 text-forest-800 font-bold hover:bg-cream-200 flex items-center justify-center transition-colors text-xs"
              >
                -
              </button>
              <span className="text-xs font-extrabold text-forest-900 px-1 min-w-[40px] text-center">
                {values.commuteDistanceKm} km
              </span>
              <button
                type="button"
                onClick={() => onChange('commuteDistanceKm', Math.min(60, values.commuteDistanceKm + 1))}
                className="w-6 h-6 rounded-lg bg-cream-100 text-forest-800 font-bold hover:bg-cream-200 flex items-center justify-center transition-colors text-xs"
              >
                +
              </button>
            </div>
          </div>

          {/* Preset Chips */}
          <div className="grid grid-cols-5 gap-1.5 mt-2.5">
            {[5, 8, 15, 25, 40].map((dist) => (
              <button
                key={dist}
                type="button"
                onClick={() => onChange('commuteDistanceKm', dist)}
                className={`py-1 px-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                  values.commuteDistanceKm === dist
                    ? 'bg-forest-600 text-white border-forest-600 shadow-xs'
                    : 'bg-white text-forest-800 border-forest-100 hover:bg-cream-100'
                }`}
              >
                {dist} km
              </button>
            ))}
          </div>

          <p className="text-[10px] text-moss-400 mt-2">
            💡 TCET to Andheri ≈ 8km · Borivali ≈ 5km · Thane ≈ 25km
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ── Step 2: Diet ─────────────────────────────────────────────────────────────
const DIET_TYPES = [
  { id: 'vegan',  label: 'Vegan',        icon: '🥦', desc: 'Plant-based only', co2: '~0.7 kg/meal' },
  { id: 'veg',    label: 'Vegetarian',   icon: '🥗', desc: 'No meat, dairy OK', co2: '~0.9 kg/meal' },
  { id: 'nonveg', label: 'Non-Vegetarian', icon: '🍗', desc: 'Includes chicken/fish', co2: '~3.3 kg/meal' },
];

function StepDiet({ values, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-forest-900 mb-1">
          What's your usual diet?
        </h2>
        <p className="text-xs md:text-sm text-moss-500">
          Pick the option that best describes most of your meals
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {DIET_TYPES.map((dt) => {
          const isSelected = values.dietType === dt.id;
          return (
            <button
              key={dt.id}
              id={`diet-${dt.id}`}
              onClick={() => onChange('dietType', dt.id)}
              className={`flex items-center gap-3.5 p-3.5 rounded-2xl w-full text-left transition-all duration-200 border-2 ${
                isSelected
                  ? 'border-forest-600 bg-thriving-50/90 text-forest-800 shadow-sm ring-2 ring-forest-200'
                  : 'border-forest-100/80 bg-white hover:border-forest-200 text-moss-600 hover:bg-cream-50'
              }`}
            >
              <span className="text-3xl flex-shrink-0">{dt.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-forest-900">{dt.label}</div>
                <div className="text-xs text-moss-400 truncate">{dt.desc}</div>
              </div>
              <div className="text-[10px] font-bold text-moss-500 bg-cream-100 rounded-lg px-2 py-1 flex-shrink-0 border border-forest-100">
                {dt.co2}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-cream-50/80 rounded-2xl p-4 border border-forest-100">
        <label className="eco-label text-xs mb-2 block">Meals per day</label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              id={`meals-${n}`}
              onClick={() => onChange('mealsCount', n)}
              className={`py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                values.mealsCount === n
                  ? 'bg-forest-600 text-white shadow-sm'
                  : 'bg-white text-forest-700 border border-forest-100 hover:bg-cream-100'
              }`}
            >
              {n} {n === 1 ? 'meal' : 'meals'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Energy & Profile ──────────────────────────────────────────────────
function StepEnergy({ values, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-forest-900 mb-1">
          Energy & Profile setup
        </h2>
        <p className="text-xs md:text-sm text-moss-500">
          Personalize your profile for the TCET leaderboard
        </p>
      </div>

      <div className="bg-cream-50/80 rounded-2xl p-4 border border-forest-100">
        <div className="flex items-center justify-between mb-2">
          <label className="eco-label text-xs mb-0">
            Appliance use per day
          </label>
          {/* Stepper control */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-forest-200">
            <button
              type="button"
              onClick={() => onChange('energyUsageHours', Math.max(0, values.energyUsageHours - 1))}
              className="w-6 h-6 rounded-lg bg-cream-100 text-forest-800 font-bold hover:bg-cream-200 flex items-center justify-center transition-colors text-xs"
            >
              -
            </button>
            <span className="text-xs font-extrabold text-forest-900 px-1 min-w-[40px] text-center">
              {values.energyUsageHours} h
            </span>
            <button
              type="button"
              onClick={() => onChange('energyUsageHours', Math.min(16, values.energyUsageHours + 1))}
              className="w-6 h-6 rounded-lg bg-cream-100 text-forest-800 font-bold hover:bg-cream-200 flex items-center justify-center transition-colors text-xs"
            >
              +
            </button>
          </div>
        </div>

        {/* Preset Chips */}
        <div className="grid grid-cols-5 gap-1.5 mt-2.5">
          {[0, 2, 4, 8, 12].map((hrs) => (
            <button
              key={hrs}
              type="button"
              onClick={() => onChange('energyUsageHours', hrs)}
              className={`py-1 px-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                values.energyUsageHours === hrs
                  ? 'bg-forest-600 text-white border-forest-600 shadow-xs'
                  : 'bg-white text-forest-800 border-forest-100 hover:bg-cream-100'
              }`}
            >
              {hrs}h
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {[
          { id: 'hostel', label: '🏠 Hosteller', desc: 'Living on campus' },
          { id: 'dayscholar', label: '🏡 Day Scholar', desc: 'Commuting daily' },
        ].map((t) => (
          <button
            key={t.id}
            id={`student-type-${t.id}`}
            onClick={() => onChange('studentType', t.id)}
            className={`p-3 rounded-2xl text-left transition-all duration-200 border-2 ${
              values.studentType === t.id
                ? 'border-forest-600 bg-thriving-50/90 text-forest-800 shadow-sm ring-2 ring-forest-200'
                : 'border-forest-100/80 bg-white text-moss-600 hover:bg-cream-50'
            }`}
          >
            <div className="text-xs font-bold text-forest-900">{t.label}</div>
            <div className="text-[10px] text-moss-400 mt-0.5">{t.desc}</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 border border-forest-100">
        <label className="eco-label text-xs mb-1 block" htmlFor="branch-name">
          Your Name & Branch (for EcoBattles)
        </label>
        <input
          id="branch-name"
          type="text"
          className="eco-input text-xs mt-1"
          placeholder="e.g. Aryan — Computer Engineering"
          value={values.nameAndBranch}
          onChange={(e) => onChange('nameAndBranch', e.target.value)}
          maxLength={60}
        />
      </div>
    </div>
  );
}

// ── Main Onboarding Component ────────────────────────────────────────────────
const STEPS = ['Commute', 'Diet', 'Energy & Profile'];

const DEFAULT_FORM = {
  commuteMode: '',
  commuteDistanceKm: 15,
  dietType: 'veg',
  mealsCount: 3,
  energyUsageHours: 4,
  studentType: 'dayscholar',
  nameAndBranch: '',
};

export default function Onboarding() {
  const navigate = useNavigate();
  const { setProfile, addHabitEntry, loadDemo } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [hatching, setHatching] = useState(false);
  const [previewState, setPreviewState] = useState('neutral');

  const handleChange = (field, value) => {
    const newForm = { ...form, [field]: value };
    setForm(newForm);
    if (['commuteMode', 'commuteDistanceKm', 'dietType', 'mealsCount', 'energyUsageHours'].includes(field)) {
      const fp = calculateDailyFootprint({
        commuteMode: newForm.commuteMode || 'walk',
        commuteDistanceKm: newForm.commuteDistanceKm,
        dietType: newForm.dietType,
        mealsCount: newForm.mealsCount,
        energyUsageHours: newForm.energyUsageHours,
      });
      setPreviewState(getTwinState(fp));
    }
  };

  const canProceed = () => {
    if (step === 0) return !!form.commuteMode;
    if (step === 1) return !!form.dietType && form.mealsCount > 0;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setHatching(true);
    const nameParts = form.nameAndBranch.split('—');
    const name = nameParts[0]?.trim() || 'TCET Student';
    const branch = nameParts[1]?.trim() || 'Computer Engineering — TCET';

    setProfile({
      id: `user-${Date.now()}`,
      name,
      hostelOrBranch: branch,
      createdAt: new Date().toISOString().split('T')[0],
    }, form.studentType);

    addHabitEntry({
      date: new Date().toISOString().split('T')[0],
      commuteMode: form.commuteMode,
      commuteDistanceKm: form.commuteDistanceKm,
      dietType: form.dietType,
      mealsCount: form.mealsCount,
      energyUsageHours: form.energyUsageHours,
    });

    setTimeout(() => navigate('/dashboard'), 1800);
  };

  // Hatching animation screen
  if (hatching) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-forest-900 via-forest-800 to-forest-950 p-6 text-center text-white">
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="mb-4"
        >
          <TwinRenderer state={previewState} size="lg" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-sm"
        >
          <div className="inline-flex items-center gap-1.5 bg-forest-700/80 text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-full border border-forest-500 mb-3">
            <Sparkles size={14} />
            <span>EcoTwin Born!</span>
          </div>
          <h2 className="text-2xl font-display font-extrabold mb-2">
            Your EcoTwin is hatching... 🌱
          </h2>
          <p className="text-forest-200 text-xs leading-relaxed">
            Initializing your real-time carbon tracker and connecting to TCET EcoBattles...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background soft ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Centered Onboarding Card Shell */}
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/80 shadow-2xl p-6 sm:p-8 relative z-10 flex flex-col gap-6">
        
        {/* Brand Header & Step Wizard Bar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-forest-600 text-white flex items-center justify-center shadow-sm">
                <Leaf size={18} strokeWidth={2.5} />
              </div>
              <span className="font-display font-extrabold text-forest-900 text-lg">EcoTwin</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-xs font-bold text-forest-700 hover:text-forest-900 bg-forest-50 hover:bg-forest-100 px-3 py-1 rounded-full border border-forest-200 transition-colors"
              >
                Sign In
              </button>
              <span className="text-xs font-bold text-moss-500 bg-cream-100 px-3 py-1 rounded-full border border-forest-100">
                Step {step + 1} of {STEPS.length}: {STEPS[step]}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex gap-2">
            {STEPS.map((s, i) => (
              <motion.div
                key={s}
                className="h-1.5 rounded-full flex-1"
                animate={{
                  background: i <= step ? 'linear-gradient(90deg, #16a34a, #4ade80)' : '#e2e8f0',
                }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </div>
        </div>

        {/* Live Twin Avatar Preview Header */}
        <div className="bg-gradient-to-b from-cream-50 to-cream-100/60 rounded-2xl p-4 border border-forest-100/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="scale-75 origin-left -my-3">
              <TwinRenderer state={previewState} size="sm" />
            </div>
            <div>
              <p className="text-xs font-bold text-forest-900">Your EcoTwin Preview</p>
              <p className="text-[11px] text-moss-500">Updates live as you select habits</p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
            previewState === 'thriving' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
            previewState === 'neutral' ? 'bg-amber-100 text-amber-800 border-amber-200' :
            'bg-rose-100 text-rose-800 border-rose-200'
          }`}>
            {previewState.toUpperCase()}
          </span>
        </div>

        {/* Step Form Content */}
        <div className="min-h-[280px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && <StepCommute values={form} onChange={handleChange} />}
              {step === 1 && <StepDiet values={form} onChange={handleChange} />}
              {step === 2 && <StepEnergy values={form} onChange={handleChange} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 pt-2 border-t border-forest-100/60">
          {step > 0 && (
            <button
              className="btn-secondary flex items-center justify-center gap-1.5 py-3 px-5 text-sm"
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}
          <motion.button
            id={step < STEPS.length - 1 ? 'onboarding-next' : 'onboarding-submit'}
            className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNext}
            disabled={!canProceed()}
            whileTap={{ scale: canProceed() ? 0.98 : 1 }}
          >
            <span>{step < STEPS.length - 1 ? 'Continue' : 'Hatch My EcoTwin 🌿'}</span>
            <ArrowRight size={16} />
          </motion.button>
        </div>

        {/* Demo Data Shortcut */}
        <div className="text-center">
          <button
            id="load-demo-btn"
            onClick={() => { loadDemo(); navigate('/dashboard'); }}
            className="text-xs text-moss-400 hover:text-forest-700 underline transition-colors"
          >
            Skip setup — load TCET demo data
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TwinThriving from './TwinThriving';
import TwinNeutral from './TwinNeutral';
import TwinWilting from './TwinWilting';

const STATE_BG = {
  thriving: 'twin-bg-thriving',
  neutral:  'twin-bg-neutral',
  wilting:  'twin-bg-wilting',
};

const STATE_MESSAGES = {
  thriving: "I'm flourishing! Keep it up 🌿",
  neutral:  "I'm okay, but I could be better 🌱",
  wilting:  "I need your help to recover 🍂",
};

/**
 * TwinRenderer — orchestrates state transitions with AnimatePresence
 * Props:
 *   state: "thriving" | "neutral" | "wilting"
 *   dominantTrait: "commute" | "diet" | "energy" (P1 usage)
 *   size: "sm" | "md" | "lg" (default "lg")
 */
export default function TwinRenderer({ state = 'neutral', dominantTrait, size = 'lg' }) {
  const sizeMap = { xs: 0.35, sm: 0.55, md: 0.75, lg: 1 };
  const scale = sizeMap[size] ?? 1;

  return (
    <div className={`relative flex flex-col items-center ${STATE_BG[state]}`}
      style={{ minHeight: size === 'lg' ? 280 : size === 'md' ? 210 : size === 'xs' ? 100 : 160 }}>

      {/* Animated Twin */}
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
        <AnimatePresence mode="wait">
          {state === 'thriving' && <TwinThriving key="thriving" />}
          {state === 'neutral'  && <TwinNeutral  key="neutral"  />}
          {state === 'wilting'  && <TwinWilting  key="wilting"  />}
        </AnimatePresence>
      </div>

      {/* Speech bubble message */}
      {size === 'lg' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={state}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-2 px-4 py-2 rounded-2xl text-sm text-center font-medium shadow-sm"
            style={{
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.6)',
              color: state === 'thriving' ? '#15803d' : state === 'neutral' ? '#b45309' : '#9f1239',
            }}
          >
            {STATE_MESSAGES[state]}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

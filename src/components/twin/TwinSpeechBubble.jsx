import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Leaf } from 'lucide-react';

export default function TwinSpeechBubble({ message, isAI, isLoading }) {
  if (!message && !isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative max-w-xs mx-auto mb-4"
    >
      {/* Speech bubble container */}
      <div className="bg-white/80 backdrop-blur-md border border-forest-100/80 px-4 py-3 rounded-2xl shadow-md text-left relative">
        {isLoading ? (
          <div className="flex items-center gap-2 py-1">
            <span className="w-1.5 h-1.5 bg-forest-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-forest-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-forest-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <div>
            <p className="text-xs font-semibold text-forest-800 leading-relaxed">
              "{message}"
            </p>
            <div className="flex items-center justify-end gap-1 mt-1.5">
              {isAI ? (
                <div className="flex items-center gap-0.5 text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-150 px-1.5 py-0.5 rounded-full">
                  <Sparkles size={8} />
                  <span>AI Twin</span>
                </div>
              ) : (
                <div className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-150 px-1.5 py-0.5 rounded-full">
                  <Leaf size={8} />
                  <span>Twin State</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pointer triangle */}
      <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white/80 filter drop-shadow-sm" />
    </motion.div>
  );
}

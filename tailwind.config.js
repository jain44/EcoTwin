/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        // Warm parchment base
        parchment: {
          50:  '#fdfaf4',
          100: '#f9f3e3',
          200: '#f0e6c8',
          300: '#e4d4a8',
          400: '#d4bc80',
          500: '#c4a55e',
        },
        // Thriving — rich forest green
        thriving: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          glow: '#4ade80',
        },
        // Neutral — warm earthy amber
        neutral: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          glow: '#fbbf24',
        },
        // Wilting — dusty rose-clay
        wilting: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          glow: '#fb7185',
        },
        // Forest earth tones — main UI palette
        forest: {
          50:  '#f7f9f4',
          100: '#eef2e8',
          200: '#d4e2c4',
          300: '#adc99a',
          400: '#7aab68',
          500: '#558f49',
          600: '#3d7235',
          700: '#2f5828',
          800: '#243f1f',
          900: '#1a2e17',
          950: '#0f1c0e',
        },
        // Warm cream — backgrounds, cards
        cream: {
          50:  '#fefefe',
          100: '#faf8f2',
          200: '#f4f0e6',
          300: '#ede6d4',
          400: '#e0d5ba',
          500: '#cfbf98',
        },
        // Moss — text, secondary elements
        moss: {
          100: '#e8f0e2',
          200: '#c8d9be',
          300: '#9dba90',
          400: '#6e9962',
          500: '#4d7a42',
          600: '#375c2f',
          700: '#274220',
          800: '#1c3017',
          900: '#121f10',
        },
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
        'leaf-sway': 'leafSway 3.5s ease-in-out infinite',
        'droop': 'droop 4s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'coin-spin': 'coinSpin 0.6s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'score-bump': 'scoreBump 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.7', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        leafSway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        droop: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(4px) rotate(-2deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0.5)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        coinSpin: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scoreBump: {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.2)' },
          '60%': { transform: 'scale(0.95)' },
        },
      },
      backgroundImage: {
        'gradient-nature': 'linear-gradient(135deg, #f7f9f4 0%, #eef2e8 50%, #f9f3e3 100%)',
        'gradient-forest': 'linear-gradient(160deg, #2f5828 0%, #3d7235 50%, #558f49 100%)',
        'gradient-thriving': 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        'gradient-wilting': 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
        'gradient-amber': 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
        'shimmer-green': 'linear-gradient(90deg, transparent 0%, rgba(74,222,128,0.4) 50%, transparent 100%)',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(74, 222, 128, 0.4), 0 0 60px rgba(74, 222, 128, 0.1)',
        'glow-amber': '0 0 20px rgba(251, 191, 36, 0.4), 0 0 60px rgba(251, 191, 36, 0.1)',
        'glow-rose':  '0 0 20px rgba(251, 113, 133, 0.4), 0 0 60px rgba(251, 113, 133, 0.1)',
        'nature': '0 4px 24px rgba(61, 114, 53, 0.12), 0 1px 4px rgba(61,114,53,0.08)',
        'card': '0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        'inner-nature': 'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

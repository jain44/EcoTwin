# 🌱 EcoTwin — Gamified Digital Twin Sustainability App

> **PixxelHack 2.0 — Round 2 (Development Sprint) Submission**
> **Theme:** EcoLife – Sustainable Living Dashboard (Bonus Theme #6)
> **Organized by:** TCET-ACM-SIGITE Student Chapter, Thakur College of Engineering & Technology, Mumbai

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-FFCA28?logo=firebase)](https://firebase.google.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS%20v3-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-0055FF?logo=framer)](https://www.framer.com/motion)

---

## 🌟 What is EcoTwin?

**EcoTwin** is a next-generation gamified sustainability app for TCET college students. It bridges the gap between personal daily habits and environmental impact through:

- A **living digital twin avatar** that evolves based on your real carbon footprint
- A **real-time cross-device leaderboard** (powered by Firebase Firestore)
- An **AI-generated personality** for your twin using Groq's Llama-3 LLM
- **QR-code verified habit logging** at physical campus locations
- A **campus forest** — a shared garden that grows as the whole student body logs green habits
- A **faculty/admin analytics dashboard** for sustainability reporting

Every walk to campus, every veg meal, every switched-off fan — your Eco-Twin feels it.

---

## 🚀 Live Demo & Links

| Resource | Link |
|---|---|
| 🌐 Live App (Netlify) | https://ecotwin65.netlify.app |
| 📦 GitHub | https://github.com/jain44/EcoTwin |
| 📹 Demo Video | *[Add YouTube/Loom link]* |

---

## 💡 Feature Breakdown

### 1. 🌿 Interactive Digital Eco-Twin Avatar
- SVG avatar with **3 visual states**: Thriving 🌳 · Neutral 🌱 · Wilting 🥀
- Smooth Framer Motion animations — breathing, swaying, glowing effects
- State driven by your **7-day rolling carbon average**
- **AI Personality** via Groq Llama-3: generates a unique 1–2 sentence message every day, plant-themed, encouraging, cached in Firestore so it never repeats API calls

### 2. 📊 Carbon Calculator & Habit Logging
- Log 3 categories daily: **Commute** · **Diet** · **Energy Usage**
- Mumbai student baseline: **5.5 kg CO₂/day** — EcoTwin benchmarks against this
- **Photo proof** upload for habits (base64, stored locally)
- **QR-verified logging** — scan campus location QR = +15 Trust Score bonus + pre-filled form

### 3. 🔮 Predictive Emission Warning Banner
- Linear regression on last 7 days → **3-day forecast**
- Color-coded alert: 🟢 On track / 🟡 Rising / 🔴 Warning with specific recommended actions
- Shown on Dashboard automatically when trend is upward

### 4. ⚔️ EcoBattles — Real-Time Leaderboard
- **Live Firestore leaderboard** — actual cross-device data, not fake localStorage
- 15 seeded students across all 8 TCET departments auto-populate on first load
- Filters by **All Students / Department / Hostel**
- Shows rank change, rolling average, Green Coins balance, trust score

### 5. 🌳 Campus Forest (Shared Visualization)
- Public page (`/campus-forest`) — no login required
- Every student who logs habits plants a tree in the shared forest
- Trees sized and colored by the student's sustainability score
- Real-time Firestore listener — forest grows live as people log

### 6. 📍 QR Code Proof Logging (Priority 5)
- Admin page at `/qr-locations` generates **printable QR cards** for 6 campus locations:
  - 🚉 TCET Train Station Exit, 🍽️ College Canteen, 📚 Central Library, 🌿 Eco Garden, 🏠 Hostel Block A, 🏋️ Sports Complex
- Each QR encodes a JSON payload — when scanned in-app it pre-fills habit form + marks it "QR Verified"
- Scan button in Habit Log page opens camera modal (html5-qrcode)

### 7. 🎓 Admin / Faculty Dashboard (`/admin`)
- Password-gated (default: `tcet2026`, configurable via `.env`)
- **KPI cards**: Total Twins · CO₂ Prevented · Avg Footprint · App Adoption %
- **Department bar chart** (Chart.js) — color coded green/amber/red by avg footprint
- **Top 8 Students** leaderboard table
- **Department adoption breakdown** grid
- Real-time Firestore listener — updates live as students log habits

### 8. 🪙 GreenCoins Marketplace
- Earn coins by logging habits (more coins for lower footprint + streak multiplier)
- **Trust Score** (0–100) adjusts coin earnings — QR-verified logs earn more
- Redeem for: Canteen 10% Off · Free Library Printing · Tree Planting · Campus Bike Pass

### 9. 🏅 Achievement Badges
- 8 badges: First Step · Week Warrior · Carbon Hero · Commute King · Diet Champ · Power Saver · QR Scout · Eco Legend
- Unlocked dynamically from habit log analysis

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite 8 |
| **Routing** | React Router DOM v7 |
| **Styling** | Tailwind CSS v3 + Custom design system |
| **Animations** | Framer Motion v13 |
| **Charts** | Chart.js + react-chartjs-2 |
| **Backend / DB** | Firebase Firestore (real-time NoSQL) |
| **Auth** | Firebase Anonymous Auth |
| **AI** | Groq SDK (Llama-3 8B) — free tier |
| **QR Generate** | qrcode (npm) |
| **QR Scan** | html5-qrcode |
| **Icons** | Lucide React |
| **Export** | html-to-image (Eco-Card sharing) |
| **PWA** | Service Worker + Web App Manifest |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- A Firebase project (free Spark plan works)

### 1. Clone & Install

```bash
git clone https://github.com/jain44/EcoTwin.git
cd EcoTwin
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
# Firebase — get from Console → Project Settings → Your Apps → Web App
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Groq (optional — AI twin messages, free at console.groq.com/keys)
VITE_GROQ_API_KEY=your_groq_key

# Admin dashboard password
VITE_ADMIN_PASSWORD=tcet2026
```

### 3. Firebase Console Setup (one-time)

1. **Authentication** → Sign-in method → **Anonymous** → Enable
2. **Firestore Database** → Create database → **Start in test mode** → Region: `asia-south1`

### 4. Run

```bash
npm run dev
# → http://localhost:5173
```

---

## 🗺️ App Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Onboarding / landing page |
| `/login` | Public | Login & Registration (Email, Google, Guest, Demo) |
| `/dashboard` | Auth | Main hub — twin, daily stats, AI message |
| `/log` | Auth | Daily habit logging + QR scanner |
| `/battles` | Auth | Live Firestore leaderboard |
| `/coins` | Auth | GreenCoins balance + redeem rewards |
| `/profile` | Auth | Personal student profile, twin stats, habit timeline & editor |
| `/about` | Auth | How it works + team info |
| `/campus-forest` | **Public** | Shared real-time campus forest |
| `/admin` | **Password** | Faculty analytics dashboard |
| `/qr-locations` | Admin | Printable campus QR code cards |

---

## 📁 Project Structure

```
EcoTwin/
├── public/
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service worker (offline support)
├── src/
│   ├── App.jsx             # Router + layout shell
│   ├── firebase.js         # Firebase init (Firestore + Auth)
│   ├── context/
│   │   └── AppContext.jsx  # Global state — Firebase sync + actions
│   ├── engine/
│   │   ├── carbonCalc.js   # CO₂ formulas, trust score, coins
│   │   ├── achievements.js # Badge unlock logic
│   │   └── emissionForecast.js  # Linear regression predictor
│   ├── services/
│   │   └── twinAI.js       # Groq LLM calls + Firestore cache + fallbacks
│   ├── data/
│   │   ├── seedData.js     # 15 mock TCET students (auto-seeded to Firestore)
│   │   └── qrLocations.js  # 6 campus QR location payloads
│   ├── pages/
│   │   ├── Dashboard.jsx   # Main hub
│   │   ├── HabitLog.jsx    # Daily log + QR scanner
│   │   ├── EcoBattles.jsx  # Live leaderboard
│   │   ├── GreenCoins.jsx  # Rewards marketplace
│   │   ├── CampusForest.jsx # Shared forest visualization
│   │   ├── Admin.jsx       # Faculty dashboard
│   │   ├── QRLocations.jsx # Printable QR cards
│   │   ├── Onboarding.jsx  # First-time setup
│   │   └── About.jsx       # Info page
│   ├── components/
│   │   ├── twin/           # TwinRenderer, TwinThriving, TwinNeutral, TwinWilting, TwinSpeechBubble
│   │   ├── dashboard/      # QuickStatsRow, WeeklyTrendChart, EmissionSourcesChart,
│   │   │                   # AchievementBadges, EcoShareCard, PredictiveBanner
│   │   ├── layout/         # BottomNav, DesktopHeader
│   │   └── qr/             # QRScanner (camera modal)
│   └── index.css           # Design system tokens + global styles
├── .env.example            # Safe env template
├── firestore.rules         # Firestore security rules
└── vite.config.js
```

---

## 🔒 Security Notes

- **`.env` is gitignored** — API keys never reach GitHub
- Firestore runs in **test mode** for the hackathon — add proper rules before production:

```js
// firestore.rules (production-ready template)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;                          // leaderboard public
      allow write: if request.auth.uid == userId;   // own doc only
      match /habitLogs/{logId} {
        allow read, write: if request.auth.uid == userId;
      }
    }
  }
}
```

---

## 🎯 Judging Criteria Alignment (PixxelHack 2.0)

| Criteria | How EcoTwin Delivers |
|---|---|
| **Functionality** | Complete end-to-end flow: Onboard → Log → Twin evolves → Leaderboard → Redeem rewards |
| **UI / UX** | Premium glassmorphism, HSL color palette, micro-animations, 100% mobile + desktop |
| **Responsiveness** | Mobile-first, tested on 375px → 1440px |
| **Creativity** | Tamagotchi-style twin + real carbon science + QR proof + AI personality = unique combo |
| **Technical Depth** | Firebase real-time sync, Groq LLM, linear regression forecasting, PWA, QR scanning |
| **Practical Impact** | Solves real student disengagement — canteen discounts, branch rivalry, campus QR integration |

---

## 👥 Team

**Hackathon:** PixxelHack 2.0 — National Level Web Development Hackathon
**Round:** Round 2 – Development Sprint (7th–8th August 2026)
**Organized by:** TCET-ACM-SIGITE Student Chapter, Thakur College of Engineering & Technology, Mumbai

---

*Built with ❤️ for a Greener Planet — EcoTwin 🌿*

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/layout/BottomNav';
import DesktopHeader from './components/layout/DesktopHeader';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import HabitLog from './pages/HabitLog';
import EcoBattles from './pages/EcoBattles';
import GreenCoins from './pages/GreenCoins';
import About from './pages/About';
import CampusForest from './pages/CampusForest';
import Admin from './pages/Admin';
import QRLocations from './pages/QRLocations';

function ProtectedRoute({ children }) {
  const { hasOnboarded } = useApp();
  return hasOnboarded ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { hasOnboarded } = useApp();
  const location = useLocation();
  const noNavPaths = ['/', '/campus-forest', '/admin', '/qr-locations'];
  const showNav = hasOnboarded && !noNavPaths.includes(location.pathname);

  return (
    <div className="app-container">
      {showNav && <DesktopHeader />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Landing / Onboarding */}
          <Route
            path="/"
            element={hasOnboarded ? <Navigate to="/dashboard" replace /> : <Onboarding />}
          />

          {/* Protected app routes */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/log"
            element={<ProtectedRoute><HabitLog /></ProtectedRoute>}
          />
          <Route
            path="/battles"
            element={<ProtectedRoute><EcoBattles /></ProtectedRoute>}
          />
          <Route
            path="/coins"
            element={<ProtectedRoute><GreenCoins /></ProtectedRoute>}
          />
          <Route
            path="/about"
            element={<ProtectedRoute><About /></ProtectedRoute>}
          />
          <Route
            path="/campus-forest"
            element={<CampusForest />}
          />

          {/* Admin / Faculty routes (no auth gate — password-gated internally) */}
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/qr-locations"
            element={<QRLocations />}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {showNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

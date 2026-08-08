import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/layout/BottomNav';
import DesktopHeader from './components/layout/DesktopHeader';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import HabitLog from './pages/HabitLog';
import EcoBattles from './pages/EcoBattles';
import GreenCoins from './pages/GreenCoins';
import About from './pages/About';
import Admin from './pages/Admin';
import QRLocations from './pages/QRLocations';
import Login from './pages/Login';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const { hasOnboarded } = useApp();
  return hasOnboarded ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  const { hasOnboarded } = useApp();
  const location = useLocation();

  // Pages that hide the nav bar
  const noNavPaths = ['/', '/login', '/admin', '/qr-locations'];
  const showNav = hasOnboarded && !noNavPaths.includes(location.pathname);

  return (
    <div className="app-container">
      {showNav && <DesktopHeader />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public landing — redirects logged-in users to dashboard inside Landing.jsx */}
          <Route path="/" element={<Landing />} />

          {/* Auth page */}
          <Route path="/login" element={<Login />} />

          {/* Protected app routes */}
          <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/log"           element={<ProtectedRoute><HabitLog /></ProtectedRoute>} />
          <Route path="/battles"       element={<ProtectedRoute><EcoBattles /></ProtectedRoute>} />
          <Route path="/coins"         element={<ProtectedRoute><GreenCoins /></ProtectedRoute>} />
          <Route path="/about"         element={<ProtectedRoute><About /></ProtectedRoute>} />
          <Route path="/profile"       element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Admin / Faculty */}
          <Route path="/admin"         element={<Admin />} />
          <Route path="/qr-locations"  element={<QRLocations />} />

          {/* Catch-all */}
          <Route path="*"              element={<Navigate to="/" replace />} />
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

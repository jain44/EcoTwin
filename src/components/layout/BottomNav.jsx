import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ClipboardList, Swords, Target, User } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard',  icon: Home,          label: 'Home',       id: 'nav-home' },
  { to: '/log',        icon: ClipboardList, label: 'Log',        id: 'nav-log' },
  { to: '/battles',    icon: Swords,        label: 'Battles',    id: 'nav-battles' },
  { to: '/challenges', icon: Target,        label: 'Challenges', id: 'nav-challenges' },
  { to: '/profile',    icon: User,          label: 'Profile',    id: 'nav-profile' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      <div className="flex items-center w-full">
        {NAV_ITEMS.map(({ to, icon: Icon, label, id }) => {
          const isActive = location.pathname === to || (to === '/dashboard' && location.pathname === '/');
          return (
            <NavLink
              key={to}
              to={to}
              id={id}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 relative"
              aria-label={label}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-forest-600"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={`transition-colors duration-200 ${
                  isActive ? 'text-forest-700' : 'text-moss-400'
                }`}
              />
              <span
                className={`text-[10px] font-semibold transition-colors duration-200 ${
                  isActive ? 'text-forest-700' : 'text-moss-400'
                }`}
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

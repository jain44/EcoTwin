import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Home, ClipboardList, Swords, Coins, Flame, TreePine } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { to: '/dashboard', icon: Home,          label: 'Dashboard', id: 'desk-nav-home' },
  { to: '/log',       icon: ClipboardList, label: 'Log Habits', id: 'desk-nav-log' },
  { to: '/battles',   icon: Swords,        label: 'EcoBattles', id: 'desk-nav-battles' },
  { to: '/coins',     icon: Coins,         label: 'GreenCoins', id: 'desk-nav-coins' },
  { to: '/campus-forest', icon: TreePine,  label: 'Campus Forest', id: 'desk-nav-forest' },
];

export default function DesktopHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, habitLog, greenCoinsBalance } = useApp();

  const firstName = userProfile?.name?.split(' ')[0] ?? 'Student';
  const dayStreak = Math.min(habitLog.length, 7);

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-forest-100/80 shadow-sm w-full">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-forest-700 via-forest-600 to-thriving-500 flex items-center justify-center shadow-nature transition-transform duration-300 group-hover:scale-105">
            <Leaf size={22} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-xl font-display font-extrabold text-forest-900 tracking-tight flex items-center gap-1">
              Eco<span className="text-forest-600">Twin</span>
            </span>
            <span className="text-[10px] font-semibold text-moss-500 uppercase tracking-widest block -mt-1">
              Sustainable Companion
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-cream-100/80 p-1.5 rounded-2xl border border-forest-100">
          {NAV_ITEMS.map(({ to, icon: Icon, label, id }) => {
            const isActive = location.pathname === to || (to === '/dashboard' && location.pathname === '/');
            return (
              <NavLink
                key={to}
                to={to}
                id={id}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-forest-800 shadow-sm border border-forest-100'
                    : 'text-moss-600 hover:text-forest-700 hover:bg-white/50'
                }`}
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-forest-600' : 'text-moss-500'} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Badges & Coins */}
        <div className="flex items-center gap-4">
          {/* Streak pill */}
          {dayStreak > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 rounded-full px-3 py-1.5 shadow-sm">
              <Flame size={16} className="text-amber-500 fill-amber-400" />
              <span className="text-xs font-bold text-amber-800">{dayStreak} day streak</span>
            </div>
          )}

          {/* GreenCoins pill */}
          <div 
            onClick={() => navigate('/coins')}
            className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 rounded-full px-3 py-1.5 cursor-pointer hover:bg-emerald-100/80 transition-colors shadow-sm"
          >
            <Coins size={16} className="text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800">{greenCoinsBalance}</span>
            <span className="text-[10px] uppercase font-bold text-emerald-600">Coins</span>
          </div>

          {/* User profile avatar badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-forest-100">
            <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-700 font-bold flex items-center justify-center text-xs border border-forest-200">
              {firstName.charAt(0)}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-bold text-forest-900 leading-tight">{firstName}</p>
              <p className="text-[10px] text-moss-500 leading-tight truncate max-w-[120px]">
                {userProfile?.hostelOrBranch?.split('—')[0] ?? 'Student'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

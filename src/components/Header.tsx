import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Sun, Moon, User, Menu, X, Bell, Heart, LogOut, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CricbuzzApiModal } from './CricbuzzApiModal';
import { api } from '../services/api';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [cricbuzzModalOpen, setCricbuzzModalOpen] = useState(false);
  const [cricbuzzStatus, setCricbuzzStatus] = useState<any>(null);

  useEffect(() => {
    api.getCricbuzzStatus().then(setCricbuzzStatus).catch(() => {});
  }, [cricbuzzModalOpen]);

  const navLinks = [
    { label: 'Live Scores', path: '/live' },
    { label: 'Schedule', path: '/schedule' },
    { label: 'Results', path: '/results' },
    { label: 'Series', path: '/series' },
    { label: 'Teams', path: '/teams' },
    { label: 'Rankings', path: '/rankings' },
    { label: 'News', path: '/news' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080D1B]/95 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark with Vector Cricket Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          {/* Original Cricket Logo: Cricket Ball moving toward bat with motion trail */}
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#111A2E] to-[#18233C] border border-white/10 flex items-center justify-center p-1 shadow-inner group-hover:border-[#B8FF4D]/40 transition-colors">
            <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
              {/* Bat Silhouette */}
              <rect x="22" y="4" width="3.5" height="18" rx="1.5" fill="#F8FAFC" transform="rotate(25 22 4)" />
              <rect x="23.5" y="2" width="2" height="6" rx="1" fill="#94A3B8" transform="rotate(25 23.5 2)" />
              {/* Ball Motion Trail */}
              <path d="M4 22 Q 12 18, 18 16" stroke="#B8FF4D" strokeWidth="1.5" strokeDasharray="2,2" strokeLinecap="round" opacity="0.8" />
              {/* Cricket Ball */}
              <circle cx="16" cy="17" r="4.5" fill="#EF4444" />
              <path d="M14 13.5 Q 16 17, 18 20.5" stroke="#FFFFFF" strokeWidth="0.8" fill="none" opacity="0.9" />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white flex items-center">
            Wicket<span className="text-[#B8FF4D]">Pulse</span>
          </span>
        </Link>

        {/* Zone 2: Navigation Links (Single-line, quiet hover) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap transition-colors py-1 ${
                  isActive
                    ? 'text-[#B8FF4D] font-semibold border-b-2 border-[#B8FF4D]'
                    : 'hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Cricbuzz API, Search, Theme, Profile/Login) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Cricbuzz API Diagnostics / Status Pill */}
          <button
            onClick={() => setCricbuzzModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border ${
              cricbuzzStatus?.isQuotaExceeded
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
            title="Cricbuzz Live Stream & RapidAPI Status (Click to manage)"
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                cricbuzzStatus?.isQuotaExceeded ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            />
            <span className="hidden sm:inline">
              {cricbuzzStatus?.isQuotaExceeded ? 'Cricbuzz (Live Simulation)' : 'Cricbuzz Live'}
            </span>
            <span className="sm:hidden">Live</span>
          </button>

          {/* Quick Search */}
          <Link
            to="/search"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Search teams, players, tournaments"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* User Profile or Sign In */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#B8FF4D] text-[#080D1B] font-bold flex items-center justify-center text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#111A2E] border border-white/10 shadow-xl py-1 text-xs z-50">
                  <div className="px-3 py-2 border-b border-white/5">
                    <p className="font-semibold text-white truncate">{user.name}</p>
                    <p className="text-slate-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-white/5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-white/5"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>Favorites & Feed</span>
                  </Link>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-lg bg-[#B8FF4D] text-[#080D1B] text-xs font-bold hover:bg-[#a6ec3c] transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 space-y-1 bg-[#080D1B] border-b border-white/10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/5 flex gap-2">
            <Link
              to="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-xs bg-slate-800 rounded-md text-slate-300"
            >
              Search
            </Link>
            {!user ? (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs bg-[#B8FF4D] text-[#080D1B] font-bold rounded-md"
              >
                Sign In
              </Link>
            ) : (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs bg-slate-800 rounded-md text-slate-300"
              >
                Profile
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Cricbuzz API & Stream Configuration Modal */}
      <CricbuzzApiModal
        isOpen={cricbuzzModalOpen}
        onClose={() => setCricbuzzModalOpen(false)}
        onKeyUpdated={() => {
          api.getCricbuzzStatus().then(setCricbuzzStatus).catch(() => {});
        }}
      />
    </header>
  );
};

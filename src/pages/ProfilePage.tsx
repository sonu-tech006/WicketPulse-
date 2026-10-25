import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Heart, Bell, Shield, LogOut, Settings } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <User className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Sign In Required</h2>
        <p className="text-xs text-slate-400">
          Sign in to view your profile, manage followed teams and players, and set match alerts.
        </p>
        <Link to="/login" className="inline-block px-5 py-2.5 rounded-xl bg-[#B8FF4D] text-[#080D1B] font-bold text-xs">
          Sign In to WicketPulse
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#111A2E] border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#B8FF4D] text-[#080D1B] font-extrabold text-2xl flex items-center justify-center shadow-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{user.name}</h1>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/settings"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-white/5 text-xs font-semibold"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Favorites & Reminders Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Teams Followed */}
        <div className="p-5 rounded-2xl bg-[#111A2E] border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Shield className="w-4 h-4 text-[#37D5F5]" />
            <span>Followed Teams</span>
          </div>
          {user.favoriteTeams?.length > 0 ? (
            <div className="flex flex-wrap gap-2 text-xs">
              {user.favoriteTeams.map((t) => (
                <Link
                  key={t}
                  to={`/teams/${t}`}
                  className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 hover:bg-slate-700 font-mono font-medium"
                >
                  {t}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No teams followed yet.</p>
          )}
        </div>

        {/* Players Followed */}
        <div className="p-5 rounded-2xl bg-[#111A2E] border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Heart className="w-4 h-4 text-[#B8FF4D]" />
            <span>Followed Players</span>
          </div>
          {user.favoritePlayers?.length > 0 ? (
            <div className="flex flex-wrap gap-2 text-xs">
              {user.favoritePlayers.map((p) => (
                <Link
                  key={p}
                  to={`/player/${p}`}
                  className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 hover:bg-slate-700 capitalize"
                >
                  {p.replace('-', ' ')}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No players followed yet.</p>
          )}
        </div>

        {/* Reminders Set */}
        <div className="p-5 rounded-2xl bg-[#111A2E] border border-white/5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Match Reminders</span>
          </div>
          <p className="text-xs text-slate-400">
            {user.reminders?.length || 0} fixtures saved for match alerts
          </p>
          <Link to="/schedule" className="text-xs text-[#B8FF4D] hover:underline font-semibold block pt-1">
            View Schedule →
          </Link>
        </div>
      </div>
    </div>
  );
};

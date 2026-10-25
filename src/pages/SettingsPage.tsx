import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Settings, Sun, Moon, Bell, Shield, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [preferredFormat, setPreferredFormat] = useState('All');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#B8FF4D]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Preferences & Settings
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your real-time score experience, audio alerts, and theme preferences
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#111A2E] border border-white/10 space-y-6 text-xs">
        {/* Theme Settings */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div>
            <h3 className="font-bold text-white text-sm">Appearance Theme</h3>
            <p className="text-slate-400">Choose between Deep Pitch Dark theme or Clean Light mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white border border-white/10"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-[#B8FF4D]" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span className="capitalize">{theme} Theme</span>
          </button>
        </div>

        {/* Audio Alerts */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div>
            <h3 className="font-bold text-white text-sm">Boundary & Wicket Sound Chimes</h3>
            <p className="text-slate-400">Auditory synthesized alert whenever a 4, 6, or Wicket occurs</p>
          </div>
          <button
            onClick={() => setSoundAlerts(!soundAlerts)}
            className={`w-12 h-6 rounded-full transition-colors p-1 ${
              soundAlerts ? 'bg-[#B8FF4D]' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-[#080D1B] transition-transform ${
                soundAlerts ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Format Priority */}
        <div className="space-y-2 pb-4 border-b border-white/5">
          <h3 className="font-bold text-white text-sm">Preferred Cricket Format</h3>
          <p className="text-slate-400">Select default filter when viewing live match boards</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['All', 'ODI', 'Test', 'T20I', 'Domestic T20'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setPreferredFormat(fmt)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  preferredFormat === fmt
                    ? 'bg-[#B8FF4D] text-[#080D1B]'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Save feedback */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Preferences saved successfully</span>
            </span>
          ) : (
            <span className="text-slate-500">Settings sync automatically to your browser</span>
          )}

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#B8FF4D] text-[#080D1B] font-bold hover:bg-[#a6ec3c] transition-colors shadow-sm"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

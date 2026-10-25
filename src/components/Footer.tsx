import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#050811] border-t border-white/5 py-10 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white">
                Wicket<span className="text-[#B8FF4D]">Pulse</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every Ball. Every Moment. The premier real-time cricket platform for international fixtures, domestic leagues, men’s & women’s cricket, live commentary, and official rankings.
            </p>
          </div>

          {/* Matches & Series */}
          <div className="space-y-2.5">
            <p className="font-semibold text-slate-200 text-xs tracking-wider">CRICKET CENTERS</p>
            <ul className="space-y-2">
              <li><Link to="/live" className="hover:text-white transition-colors">Live Scoreboard</Link></li>
              <li><Link to="/schedule" className="hover:text-white transition-colors">Upcoming Fixtures</Link></li>
              <li><Link to="/results" className="hover:text-white transition-colors">Match Results</Link></li>
              <li><Link to="/series" className="hover:text-white transition-colors">Tournaments & Series</Link></li>
            </ul>
          </div>

          {/* Stats & Rankings */}
          <div className="space-y-2.5">
            <p className="font-semibold text-slate-200 text-xs tracking-wider">STATS & PLAYERS</p>
            <ul className="space-y-2">
              <li><Link to="/rankings" className="hover:text-white transition-colors">ICC Official Rankings</Link></li>
              <li><Link to="/players" className="hover:text-white transition-colors">Player Profiles</Link></li>
              <li><Link to="/teams" className="hover:text-white transition-colors">National & League Teams</Link></li>
              <li><Link to="/news" className="hover:text-white transition-colors">Cricket News & Reports</Link></li>
            </ul>
          </div>

          {/* Integrity & Provider Disclaimer */}
          <div className="space-y-2.5">
            <p className="font-semibold text-slate-200 text-xs tracking-wider">DATA INTEGRITY</p>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Live match feeds and commentary are verified with official cricket scores. MongoDB Atlas provides persistent match states. All team badges, flags, and player stats are grounded in legitimate match scorecards.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} WicketPulse. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/settings" className="hover:text-slate-400">Settings</Link>
            <span>·</span>
            <Link to="/profile" className="hover:text-slate-400">Account</Link>
            <span>·</span>
            <span>Real-Time Engine Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

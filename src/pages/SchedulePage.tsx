import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { MatchSummary } from '../types/cricket';
import { Calendar, Bell, MapPin, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SchedulePage: React.FC = () => {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [filterFormat, setFilterFormat] = useState('All');
  const [loading, setLoading] = useState(true);
  const { hasReminder, toggleReminder } = useAuth();

  useEffect(() => {
    async function loadSchedule() {
      try {
        const res = await api.getUpcomingMatches();
        setMatches(res.matches || []);
      } catch (err) {
        console.error('Failed to load schedule:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, []);

  const filtered = matches.filter((m) => {
    if (filterFormat !== 'All' && m.format !== filterFormat) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#37D5F5]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cricket Match Schedule
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Confirmed international fixtures, bilateral tours, and premier franchise competitions
          </p>
        </div>

        {/* Format Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111A2E] rounded-lg border border-white/5 text-xs">
          {['All', 'ODI', 'Test', 'T20I', 'Domestic T20'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFilterFormat(fmt)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                filterFormat === fmt ? 'bg-[#37D5F5] text-[#080D1B]' : 'text-slate-400 hover:text-white'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-800/40 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((match) => {
            const isReminded = hasReminder(match.id);
            const dateObj = new Date(match.startTime);

            return (
              <div
                key={match.id}
                className="p-5 rounded-xl bg-[#111A2E] border border-white/5 hover:border-white/15 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Date & Tournament */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 text-center min-w-[70px] shrink-0 font-mono">
                    <span className="block text-[10px] text-slate-400 uppercase">
                      {dateObj.toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                    <span className="block text-xl font-bold text-white tabular-nums">
                      {dateObj.getDate()}
                    </span>
                    <span className="block text-[10px] text-[#B8FF4D]">
                      {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">{match.seriesName}</span>
                      <span>·</span>
                      <span>{match.format}</span>
                    </div>

                    <div className="flex items-center gap-3 text-base font-bold text-white">
                      <span>{match.team1.name}</span>
                      <span className="text-xs text-slate-500 font-mono">vs</span>
                      <span>{match.team2.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{match.venue}, {match.city}</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Reminder & Details */}
                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <button
                    onClick={() => toggleReminder(match.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      isReminded
                        ? 'bg-[#B8FF4D]/10 text-[#B8FF4D] border-[#B8FF4D]/30'
                        : 'bg-slate-800 text-slate-300 hover:text-white border-white/5 hover:border-white/10'
                    }`}
                  >
                    {isReminded ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                    <span>{isReminded ? 'Reminded' : 'Set Reminder'}</span>
                  </button>

                  <Link
                    to={`/match/${match.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <span>Match Center</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 text-sm">
          No matches found for this filter.
        </div>
      )}
    </div>
  );
};

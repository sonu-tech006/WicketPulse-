import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { SeriesInfo } from '../types/cricket';
import { Trophy, ChevronRight, Calendar } from 'lucide-react';

export const SeriesListPage: React.FC = () => {
  const [seriesList, setSeriesList] = useState<SeriesInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSeries() {
      try {
        const res = await api.getSeries();
        setSeriesList(res.series || []);
      } catch (err) {
        console.error('Failed to load series:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSeries();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-[#F59E0B]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cricket Tournaments & Series
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          ICC World Championships, bilateral trophy tours, and top domestic leagues
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-800/40 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seriesList.map((s) => (
            <Link
              key={s.id}
              to={`/series/${s.id}`}
              className="group p-6 rounded-2xl bg-[#111A2E] border border-white/5 hover:border-[#B8FF4D]/40 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-[#37D5F5]">{s.format} · {s.gender}</span>
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Calendar className="w-3 h-3" />
                    {new Date(s.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} –{' '}
                    {new Date(s.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#B8FF4D] transition-colors">
                  {s.name}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {s.description}
                </p>

                {/* Participating Team Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                  <span className="text-[11px] text-slate-500 font-semibold">Teams:</span>
                  {s.teams.slice(0, 5).map((t) => (
                    <span key={t.id} className="text-slate-300 font-medium">
                      {t.shortName || t.name}
                    </span>
                  ))}
                  {s.teams.length > 5 && (
                    <span className="text-slate-500 text-[11px]">+{s.teams.length - 5} more</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">{s.totalMatches} Matches Scheduled</span>
                <span className="font-bold text-[#B8FF4D] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Points Table & Stats</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { SeriesInfo } from '../types/cricket';
import { Trophy, Calendar, Award, ArrowLeft, Users, ChevronRight } from 'lucide-react';

export const SeriesDetailPage: React.FC = () => {
  const { seriesId } = useParams<{ seriesId: string }>();
  const [series, setSeries] = useState<SeriesInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seriesId) return;
    async function loadSeries() {
      try {
        const res = await api.getSeriesDetails(seriesId!);
        setSeries(res);
      } catch (err) {
        console.error('Failed to load series details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSeries();
  }, [seriesId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-[#B8FF4D] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading tournament standings & stats...</p>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Tournament Not Found</h2>
        <Link to="/series" className="inline-block px-4 py-2 rounded-lg bg-[#B8FF4D] text-[#080D1B] font-bold text-xs">
          Return to Series Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link to="/series" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>All Series</span>
      </Link>

      {/* Hero Banner with Trophy Visual */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#111A2E] via-[#14223F] to-[#0D162B] border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B8FF4D]">
            <span>{series.format}</span>
            <span>·</span>
            <span>{series.gender}’s Tournament</span>
            <span>·</span>
            <span>{series.category}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {series.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            {series.description}
          </p>

          <div className="flex items-center gap-4 pt-2 text-xs text-slate-400 font-mono">
            <span>{series.totalMatches} Total Matches</span>
            <span>·</span>
            <span>{series.teams?.length || 8} Participating Nations</span>
          </div>
        </div>

        {/* Trophy Showcase Card */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-xl bg-slate-800">
          <img
            src="/src/assets/images/cricket_trophy_showcase_1792845041356.jpg"
            alt="Championship Trophy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Points Table / Standings */}
      {series.standings && series.standings.length > 0 && (
        <div className="rounded-2xl bg-[#111A2E] border border-white/5 overflow-hidden shadow-xl space-y-2">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#F59E0B]" />
              <span className="font-bold text-white text-sm">Tournament Standings & Points Table</span>
            </div>
            <span className="text-slate-500 font-mono">Top 4 Advance</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-white/5 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-6">Pos</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-3 text-center">P</th>
                  <th className="py-3 px-3 text-center">W</th>
                  <th className="py-3 px-3 text-center">L</th>
                  <th className="py-3 px-3 text-center">NR</th>
                  <th className="py-3 px-4 text-center">Pts</th>
                  <th className="py-3 px-4 text-right">NRR</th>
                  <th className="py-3 px-6 text-center">Recent Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {series.standings.map((row) => (
                  <tr key={row.team.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-white tabular-nums">
                      {row.rank}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{row.team.flagUrl || '🏏'}</span>
                        <span>{row.team.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums">{row.played}</td>
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-emerald-400 font-bold">{row.won}</td>
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-red-400">{row.lost}</td>
                    <td className="py-3.5 px-3 text-center font-mono tabular-nums text-slate-500">{row.noResult}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-extrabold text-base text-[#B8FF4D] tabular-nums">
                      {row.points}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300 font-medium">
                      {row.netRunRate}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {row.recentForm.map((f, idx) => (
                          <span
                            key={idx}
                            className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center font-mono ${
                              f === 'W'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : f === 'L'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Scorers & Top Wicket Takers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Batsmen */}
        {series.topScorers && (
          <div className="p-5 rounded-xl bg-[#111A2E] border border-white/5 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-[#B8FF4D]" />
              <span>Leading Run Scorers</span>
            </h3>
            <div className="divide-y divide-white/5 text-xs">
              {series.topScorers.map((scorer, i) => (
                <div key={scorer.playerId} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-slate-400 w-4">{i + 1}</span>
                    <Link to={`/player/${scorer.playerId}`} className="font-semibold text-white hover:text-[#B8FF4D]">
                      {scorer.name}
                    </Link>
                    <span className="text-slate-400">({scorer.team})</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-white tabular-nums">{scorer.runs} runs</span>
                    <span className="text-[10px] text-slate-500 block">Avg: {scorer.average}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Bowlers */}
        {series.topWicketTakers && (
          <div className="p-5 rounded-xl bg-[#111A2E] border border-white/5 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-[#37D5F5]" />
              <span>Leading Wicket Takers</span>
            </h3>
            <div className="divide-y divide-white/5 text-xs">
              {series.topWicketTakers.map((bowler, i) => (
                <div key={bowler.playerId} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-slate-400 w-4">{i + 1}</span>
                    <Link to={`/player/${bowler.playerId}`} className="font-semibold text-white hover:text-[#37D5F5]">
                      {bowler.name}
                    </Link>
                    <span className="text-slate-400">({bowler.team})</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-white tabular-nums">{bowler.wickets} wkts</span>
                    <span className="text-[10px] text-slate-500 block">Avg: {bowler.average}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

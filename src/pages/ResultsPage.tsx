import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { MatchSummary } from '../types/cricket';
import { Award, ChevronRight, MapPin } from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const [results, setResults] = useState<MatchSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const res = await api.getRecentResults();
        setResults(res.matches || []);
      } catch (err) {
        console.error('Failed to load results:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-[#B8FF4D]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Recent Match Results
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Final match scorecards, victory margins, and player of the match honours
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-slate-800/40 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {results.map((match) => (
            <div
              key={match.id}
              className="p-5 rounded-xl bg-[#111A2E] border border-white/5 hover:border-white/15 transition-all space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">{match.seriesName}</span>
                  <span>·</span>
                  <span>{match.format}</span>
                </div>
                <span className="text-emerald-400 font-bold">{match.statusNote}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Scores */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{match.team1.flagUrl || '🏏'}</span>
                      <span className="font-bold text-white">{match.team1.name}</span>
                    </div>
                    <span className="font-mono text-slate-300 font-semibold tabular-nums">
                      {match.team1Score}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{match.team2.flagUrl || '🏏'}</span>
                      <span className="font-bold text-white">{match.team2.name}</span>
                    </div>
                    <span className="font-mono text-[#B8FF4D] font-bold tabular-nums">
                      {match.team2Score}
                    </span>
                  </div>
                </div>

                {/* Player of Match & Details */}
                <div className="md:border-l md:border-white/5 md:pl-6 flex items-center justify-between">
                  {match.playerOfTheMatch ? (
                    <div className="text-xs space-y-1">
                      <span className="text-slate-500 block uppercase text-[10px] tracking-wider">
                        Player of the Match
                      </span>
                      <span className="font-bold text-white block">
                        {match.playerOfTheMatch.name} ({match.playerOfTheMatch.team})
                      </span>
                      <span className="text-slate-400 block font-mono text-[11px]">
                        {match.playerOfTheMatch.performance}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">
                      Match concluded
                    </div>
                  )}

                  <Link
                    to={`/match/${match.id}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#37D5F5] font-semibold text-xs transition-colors shrink-0"
                  >
                    <span>Full Scorecard</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 text-sm">
          No completed results found.
        </div>
      )}
    </div>
  );
};

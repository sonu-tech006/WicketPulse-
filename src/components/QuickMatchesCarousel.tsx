import React from 'react';
import { Link } from 'react-router-dom';
import { MatchSummary } from '../types/cricket';
import { ChevronRight, Flame } from 'lucide-react';

interface QuickMatchesCarouselProps {
  matches: MatchSummary[];
  activeMatchId?: string;
}

export const QuickMatchesCarousel: React.FC<QuickMatchesCarouselProps> = ({ matches, activeMatchId }) => {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="w-full bg-[#060A16] border-b border-white/10 py-2.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {matches.map((m) => {
            const isLive = m.status === 'Live' || m.isLive;
            const isSelected = activeMatchId === m.id;

            return (
              <Link
                key={m.id}
                to={`/match/${m.id}`}
                className={`shrink-0 w-64 sm:w-72 p-3 rounded-xl border transition-all text-xs group ${
                  isSelected
                    ? 'bg-[#111A2E] border-[#B8FF4D]/50 shadow-md ring-1 ring-[#B8FF4D]/30'
                    : 'bg-[#0B1224] hover:bg-[#101930] border-white/10 hover:border-white/20'
                }`}
              >
                {/* Header: Series name & live indicator */}
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/5">
                  <span className="text-[11px] font-medium text-slate-400 truncate max-w-[170px]">
                    {m.seriesName}
                  </span>
                  {isLive ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-500/15 text-red-400 border border-red-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      LIVE
                    </span>
                  ) : m.status === 'Completed' ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
                      RESULT
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400">
                      UPCOMING
                    </span>
                  )}
                </div>

                {/* Teams & Scores */}
                <div className="space-y-1.5">
                  {/* Team 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <span className="text-sm">{m.team1.flagUrl || '🏏'}</span>
                      <span className="truncate max-w-[110px]">{m.team1.shortName || m.team1.name}</span>
                    </div>
                    <div className="text-right font-mono text-slate-200 font-bold tabular-nums">
                      {m.team1Score || (m.status === 'Scheduled' ? '-' : '')}
                      {m.team1Overs && <span className="text-[10px] text-slate-400 font-normal ml-1">({m.team1Overs})</span>}
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <span className="text-sm">{m.team2.flagUrl || '🏏'}</span>
                      <span className="truncate max-w-[110px]">{m.team2.shortName || m.team2.name}</span>
                    </div>
                    <div className="text-right font-mono font-bold tabular-nums text-[#B8FF4D]">
                      {m.team2Score || (m.status === 'Scheduled' ? '-' : '')}
                      {m.team2Overs && <span className="text-[10px] text-slate-400 font-normal ml-1">({m.team2Overs})</span>}
                    </div>
                  </div>
                </div>

                {/* Match Situation / Note Footer */}
                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate text-amber-300/90 font-medium">{m.statusNote || 'Match in progress'}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#B8FF4D]" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

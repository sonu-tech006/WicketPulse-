import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Bell, ChevronRight, Activity } from 'lucide-react';
import { MatchSummary } from '../types/cricket';
import { DeliveryBallMarker } from './DeliveryBallMarker';
import { useAuth } from '../context/AuthContext';

interface LiveMatchCardProps {
  match: MatchSummary;
  featured?: boolean;
}

export const LiveMatchCard: React.FC<LiveMatchCardProps> = ({ match, featured = false }) => {
  const { hasReminder, toggleReminder } = useAuth();
  const isReminded = hasReminder(match.id);

  const isLive = match.status === 'Live' || match.isLive;

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 overflow-hidden ${
        featured
          ? 'bg-[#111A2E] border-[#B8FF4D]/30 hover:border-[#B8FF4D]/60 shadow-lg'
          : 'bg-[#111A2E]/90 hover:bg-[#15203A] border-white/5 hover:border-white/15'
      }`}
    >
      {/* Top Banner: Series & Status */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 text-xs text-slate-400">
        <div className="flex items-center gap-2 truncate pr-2">
          <span className="font-medium text-slate-300 truncate">{match.seriesName}</span>
          <span>·</span>
          <span>{match.format}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
          ) : match.status === 'Completed' ? (
            <span className="text-slate-400 font-medium">Result</span>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleReminder(match.id);
              }}
              className={`p-1 rounded hover:bg-white/10 transition-colors ${
                isReminded ? 'text-[#B8FF4D]' : 'text-slate-400'
              }`}
              title={isReminded ? 'Reminder set' : 'Set match reminder'}
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Match Scores Core */}
      <Link to={`/match/${match.id}`} className="block p-4 space-y-3">
        {/* Team 1 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl select-none" role="img" aria-label={match.team1.name}>
              {match.team1.flagUrl || (match.team1.code === 'IND' ? '🇮🇳' : match.team1.code === 'AUS' ? '🇦🇺' : match.team1.code === 'ENG' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' : match.team1.code === 'SA' ? '🇿🇦' : '🏏')}
            </span>
            <span className="font-semibold text-slate-100 text-sm tracking-wide">
              {match.team1.shortName || match.team1.name}
            </span>
          </div>
          <div className="text-right">
            <span className="font-mono text-base font-bold text-slate-100 tabular-nums">
              {match.team1Score || 'Yet to bat'}
            </span>
            {match.team1Overs && (
              <span className="text-xs text-slate-400 font-mono ml-1.5 tabular-nums">
                ({match.team1Overs} ov)
              </span>
            )}
          </div>
        </div>

        {/* Team 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl select-none" role="img" aria-label={match.team2.name}>
              {match.team2.flagUrl || (match.team2.code === 'IND' ? '🇮🇳' : match.team2.code === 'AUS' ? '🇦🇺' : match.team2.code === 'ENG' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' : match.team2.code === 'SA' ? '🇿🇦' : '🏏')}
            </span>
            <span className="font-semibold text-slate-100 text-sm tracking-wide">
              {match.team2.shortName || match.team2.name}
            </span>
          </div>
          <div className="text-right">
            <span className="font-mono text-base font-bold text-[#B8FF4D] tabular-nums">
              {match.team2Score || (match.status === 'Scheduled' ? 'Upcoming' : 'Yet to bat')}
            </span>
            {match.team2Overs && (
              <span className="text-xs text-slate-400 font-mono ml-1.5 tabular-nums">
                ({match.team2Overs} ov)
              </span>
            )}
          </div>
        </div>

        {/* Status Note / Match Situation */}
        <div className="pt-2 border-t border-white/5">
          <p className="text-xs text-slate-300 font-medium line-clamp-1">
            {match.statusNote || (match.status === 'Live' ? 'Match in progress' : 'Scheduled')}
          </p>
        </div>

        {/* Live Delivery Strip (if recent balls exist) */}
        {isLive && match.recentBalls && match.recentBalls.length > 0 && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400 font-mono">Recent:</span>
            <div className="flex items-center gap-1.5">
              {match.recentBalls.slice(-6).map((ball, idx) => (
                <DeliveryBallMarker key={idx} value={ball} size="sm" />
              ))}
            </div>
          </div>
        )}

        {/* Venue & Action Footer */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-1 truncate max-w-[200px]">
            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{match.venue}, {match.city}</span>
          </div>
          <div className="flex items-center gap-1 text-[#37D5F5] group-hover:translate-x-0.5 transition-transform font-medium">
            <span>Match Center</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </Link>
    </div>
  );
};

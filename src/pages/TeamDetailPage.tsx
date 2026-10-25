import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Shield, ArrowLeft, Heart, Check, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TeamDetailPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { isFavorite, toggleFavorite } = useAuth();
  const [team, setTeam] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teamId) return;
    async function loadTeam() {
      try {
        const res = await api.getTeamDetails(teamId!);
        setTeam(res);
      } catch (e) {
        console.error('Failed to load team details:', e);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, [teamId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-[#37D5F5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading team roster & form...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Team Not Found</h2>
        <Link to="/teams" className="inline-block px-4 py-2 rounded-lg bg-[#B8FF4D] text-[#080D1B] font-bold text-xs">
          Return to Teams Directory
        </Link>
      </div>
    );
  }

  const isFav = isFavorite('team', team.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link to="/teams" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>All Teams</span>
      </Link>

      {/* Team Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#111A2E] to-[#152342] border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <span className="text-5xl select-none" role="img" aria-label={team.name}>
            {team.flag || '🏏'}
          </span>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-[#37D5F5]">{team.gender}</span>
              <span>·</span>
              <span className="font-mono">{team.code}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {team.name}
            </h1>
          </div>
        </div>

        <button
          onClick={() => toggleFavorite('team', team.id)}
          className={`self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
            isFav
              ? 'bg-[#B8FF4D]/15 text-[#B8FF4D] border-[#B8FF4D]/40'
              : 'bg-slate-800 text-slate-300 hover:text-white border-white/10'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-[#B8FF4D]' : ''}`} />
          <span>{isFav ? 'Following Team' : 'Follow Team'}</span>
        </button>
      </div>

      {/* ICC Rankings Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#111A2E] border border-white/5 text-center space-y-1">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Test Ranking</span>
          <p className="text-2xl font-bold font-mono text-white">#1</p>
          <span className="text-[11px] text-slate-500 font-mono">120 Rating</span>
        </div>
        <div className="p-4 rounded-xl bg-[#111A2E] border border-white/5 text-center space-y-1">
          <span className="text-xs text-slate-400 uppercase tracking-wider">ODI Ranking</span>
          <p className="text-2xl font-bold font-mono text-[#B8FF4D]">#1</p>
          <span className="text-[11px] text-slate-500 font-mono">122 Rating</span>
        </div>
        <div className="p-4 rounded-xl bg-[#111A2E] border border-white/5 text-center space-y-1">
          <span className="text-xs text-slate-400 uppercase tracking-wider">T20I Ranking</span>
          <p className="text-2xl font-bold font-mono text-[#37D5F5]">#1</p>
          <span className="text-[11px] text-slate-500 font-mono">268 Rating</span>
        </div>
      </div>

      {/* Recent Matches */}
      {team.recentMatches && team.recentMatches.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#111A2E] border border-white/5 space-y-4">
          <h3 className="font-bold text-white text-base">Recent Fixtures & Scorecards</h3>
          <div className="divide-y divide-white/5">
            {team.recentMatches.map((m: any) => (
              <Link
                key={m.id}
                to={`/match/${m.id}`}
                className="py-3 flex items-center justify-between text-xs text-slate-300 hover:text-white"
              >
                <div>
                  <p className="font-semibold text-white">{m.title}</p>
                  <p className="text-slate-400 text-[11px]">{m.seriesName} · {m.statusNote}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#B8FF4D]">{m.team2Score || m.team1Score}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

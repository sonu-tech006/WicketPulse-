import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MatchSummary } from '../types/cricket';
import { LiveMatchCard } from '../components/LiveMatchCard';
import { Heart, Shield, User, ChevronRight } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const [liveMatches, setLiveMatches] = useState<MatchSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await api.getLiveMatches();
        setLiveMatches(res.matches || []);
      } catch (err) {
        console.error('Failed to load favorite feed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  const favoriteTeams = user?.favoriteTeams || ['IND', 'AUS'];
  const favoritePlayers = user?.favoritePlayers || ['virat-kohli', 'jasprit-bumrah'];

  const matchedLive = liveMatches.filter(
    (m) => favoriteTeams.includes(m.team1.code) || favoriteTeams.includes(m.team2.code)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#B8FF4D] fill-[#B8FF4D]" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Personalized Cricket Feed
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Instant updates, live matches, and scorecards for your followed teams and cricketers
        </p>
      </div>

      {/* Followed Teams Pill Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold mr-1">Following Teams:</span>
        {favoriteTeams.map((teamCode) => (
          <Link
            key={teamCode}
            to={`/teams/${teamCode}`}
            className="px-3 py-1 rounded-lg bg-[#111A2E] text-slate-200 border border-white/5 hover:border-[#B8FF4D]/40 font-mono"
          >
            {teamCode}
          </Link>
        ))}
      </div>

      {/* Live Matches for Followed Teams */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Live Matches Involving Your Teams</h2>
        {loading ? (
          <div className="h-44 rounded-xl bg-slate-800/40 animate-pulse" />
        ) : matchedLive.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {matchedLive.map((m) => (
              <LiveMatchCard key={m.id} match={m} featured />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[#111A2E]/60 border border-white/5 text-center text-xs text-slate-400 space-y-2">
            <p>None of your followed teams are playing right now.</p>
            <Link to="/schedule" className="text-[#B8FF4D] font-semibold hover:underline block">
              Check upcoming fixtures for your teams →
            </Link>
          </div>
        )}
      </div>

      {/* Followed Players Quick Access */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">Your Star Cricketers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favoritePlayers.map((pId) => (
            <Link
              key={pId}
              to={`/player/${pId}`}
              className="p-4 rounded-xl bg-[#111A2E] border border-white/5 hover:border-[#B8FF4D]/40 transition-all flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-[#B8FF4D]">
                  {pId.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-white text-sm capitalize">{pId.replace('-', ' ')}</p>
                  <p className="text-slate-400 text-[11px]">View career stats</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

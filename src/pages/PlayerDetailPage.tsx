import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { PlayerProfile } from '../types/cricket';
import { Award, ArrowLeft, Heart, Shield, Activity, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PlayerDetailPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const { isFavorite, toggleFavorite } = useAuth();
  const [player, setPlayer] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playerId) return;
    async function loadPlayer() {
      try {
        const res = await api.getPlayerProfile(playerId!);
        setPlayer(res);
      } catch (err) {
        console.error('Failed to load player:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlayer();
  }, [playerId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-4 border-[#B8FF4D] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading player profile & career stats...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Player Not Found</h2>
        <Link to="/players" className="inline-block px-4 py-2 rounded-lg bg-[#B8FF4D] text-[#080D1B] font-bold text-xs">
          Return to Players Directory
        </Link>
      </div>
    );
  }

  const isFav = isFavorite('player', player.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link to="/players" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>All Players</span>
      </Link>

      {/* Hero Bio Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#111A2E] via-[#142340] to-[#0D1526] border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar or Portrait */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0A0F1D] border border-white/10 flex items-center justify-center font-extrabold text-3xl text-[#B8FF4D] shadow-xl shrink-0">
            {player.name.split(' ').map((n) => n[0]).join('')}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-400">
              <span className="font-semibold text-white">{player.country}</span>
              <span>·</span>
              <span className="text-[#37D5F5] font-semibold">{player.role}</span>
              <span>·</span>
              <span>{player.gender}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {player.fullName || player.name}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-1">
              <span>Batting: <strong className="text-white">{player.battingStyle}</strong></span>
              <span>·</span>
              <span>Bowling: <strong className="text-white">{player.bowlingStyle}</strong></span>
              {player.born && (
                <>
                  <span>·</span>
                  <span>Born: <strong className="text-white">{player.born}</strong></span>
                </>
              )}
            </div>

            {player.ranking && (
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#B8FF4D]/15 text-[#B8FF4D] text-xs font-bold border border-[#B8FF4D]/30 font-mono">
                  <Award className="w-3.5 h-3.5" />
                  ICC No. {player.ranking.rank} {player.ranking.format} {player.ranking.category}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Favorite Follow Button */}
        <button
          onClick={() => toggleFavorite('player', player.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors shrink-0 ${
            isFav
              ? 'bg-[#B8FF4D]/15 text-[#B8FF4D] border-[#B8FF4D]/40'
              : 'bg-slate-800 text-slate-300 hover:text-white border-white/10'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-[#B8FF4D]' : ''}`} />
          <span>{isFav ? 'Following Player' : 'Follow Player'}</span>
        </button>
      </div>

      {/* Career Statistics Table */}
      <div className="rounded-2xl bg-[#111A2E] border border-white/5 overflow-hidden shadow-xl space-y-2">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between text-xs font-semibold text-slate-300">
          <span>International Career Statistics</span>
          <span className="text-slate-500 font-mono">Official ICC Grounded Data</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/5 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-6">Format</th>
                <th className="py-3 px-3 text-right">Matches</th>
                <th className="py-3 px-3 text-right">Runs</th>
                <th className="py-3 px-3 text-right">HS</th>
                <th className="py-3 px-3 text-right">Avg</th>
                <th className="py-3 px-3 text-right">SR</th>
                <th className="py-3 px-3 text-right">100s</th>
                <th className="py-3 px-3 text-right">50s</th>
                <th className="py-3 px-3 text-right">Wickets</th>
                <th className="py-3 px-6 text-right">BBI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {player.stats.test && (
                <tr className="hover:bg-white/5">
                  <td className="py-3 px-6 font-bold text-white">Test</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.test.matches}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">{player.stats.test.runs}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.test.highestScore}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.test.average}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.test.strikeRate}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-[#B8FF4D]">{player.stats.test.centuries}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.test.fifties}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.test.wickets}</td>
                  <td className="py-3 px-6 text-right font-mono tabular-nums">{player.stats.test.bestBowling}</td>
                </tr>
              )}
              {player.stats.odi && (
                <tr className="hover:bg-white/5">
                  <td className="py-3 px-6 font-bold text-white">ODI</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.odi.matches}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">{player.stats.odi.runs}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.odi.highestScore}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.odi.average}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.odi.strikeRate}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-[#B8FF4D]">{player.stats.odi.centuries}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.odi.fifties}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.odi.wickets}</td>
                  <td className="py-3 px-6 text-right font-mono tabular-nums">{player.stats.odi.bestBowling}</td>
                </tr>
              )}
              {player.stats.t20i && (
                <tr className="hover:bg-white/5">
                  <td className="py-3 px-6 font-bold text-white">T20I</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.t20i.matches}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">{player.stats.t20i.runs}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.t20i.highestScore}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.t20i.average}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.t20i.strikeRate}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-[#B8FF4D]">{player.stats.t20i.centuries}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.t20i.fifties}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{player.stats.t20i.wickets}</td>
                  <td className="py-3 px-6 text-right font-mono tabular-nums">{player.stats.t20i.bestBowling}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Career Highlights */}
      {player.careerHighlights && player.careerHighlights.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#111A2E] border border-white/5 space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-[#B8FF4D]" />
            <span>Key Career Milestones & Honours</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {player.careerHighlights.map((hl, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#B8FF4D] font-bold font-mono">·</span>
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

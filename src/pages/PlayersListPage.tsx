import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { PlayerProfile } from '../types/cricket';
import { Users, ChevronRight, Award, Search } from 'lucide-react';

export const PlayersListPage: React.FC = () => {
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlayers() {
      try {
        const res = await api.getPlayers();
        setPlayers(res.players || []);
      } catch (err) {
        console.error('Failed to load players:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlayers();
  }, []);

  const roles = ['All', 'Batter', 'Bowler', 'All-Rounder', 'Wicketkeeper-Batter'];

  const filtered = players.filter((p) => {
    if (roleFilter !== 'All' && p.role !== roleFilter) return false;
    if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-[#B8FF4D]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cricket Players Directory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete player biographies, career statistics across formats, and official rankings
          </p>
        </div>

        {/* Search input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#111A2E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#B8FF4D]"
          />
        </div>
      </div>

      {/* Role Filter */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
              roleFilter === r
                ? 'bg-[#B8FF4D] text-[#080D1B]'
                : 'bg-[#111A2E] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Players Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-slate-800/40 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((player) => (
            <Link
              key={player.id}
              to={`/player/${player.id}`}
              className="group p-5 rounded-2xl bg-[#111A2E] border border-white/5 hover:border-[#B8FF4D]/40 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-start gap-3.5">
                {/* Avatar Initials Badge */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 flex items-center justify-center font-extrabold text-base text-[#B8FF4D] shrink-0">
                  {player.name.split(' ').map((n) => n[0]).join('')}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-white text-sm group-hover:text-[#B8FF4D] transition-colors leading-tight">
                    {player.name}
                  </h3>
                  <p className="text-xs text-slate-400">{player.country}</p>
                  <span className="inline-block text-[10px] font-semibold text-[#37D5F5] bg-[#37D5F5]/10 px-2 py-0.5 rounded">
                    {player.role}
                  </span>
                </div>
              </div>

              {/* Quick Stat Highlights */}
              <div className="pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">ODI Runs</span>
                  <span className="font-bold text-slate-200 tabular-nums">
                    {player.stats.odi?.runs || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Test Runs</span>
                  <span className="font-bold text-slate-200 tabular-nums">
                    {player.stats.test?.runs || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Wickets</span>
                  <span className="font-bold text-slate-200 tabular-nums">
                    {(player.stats.test?.wickets || 0) + (player.stats.odi?.wickets || 0)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 text-sm">
          No players match your search.
        </div>
      )}
    </div>
  );
};

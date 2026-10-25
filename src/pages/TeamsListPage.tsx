import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Shield, ChevronRight } from 'lucide-react';

export const TeamsListPage: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [genderFilter, setGenderFilter] = useState<'All' | 'Men' | 'Women'>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeams() {
      try {
        const res = await api.getTeams();
        setTeams(res.teams || []);
      } catch (e) {
        console.error('Failed to load teams:', e);
      } finally {
        setLoading(false);
      }
    }
    loadTeams();
  }, []);

  const filtered = teams.filter((t) => {
    if (genderFilter !== 'All' && t.gender !== genderFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#37D5F5]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cricket Teams
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            International national boards, women’s teams, and world franchise leagues
          </p>
        </div>

        {/* Gender Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111A2E] rounded-lg border border-white/5 text-xs">
          {(['All', 'Men', 'Women'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGenderFilter(g)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                genderFilter === g ? 'bg-[#37D5F5] text-[#080D1B]' : 'text-slate-400 hover:text-white'
              }`}
            >
              {g}’s Teams
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-800/40 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((team) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="group p-5 rounded-xl bg-[#111A2E] border border-white/5 hover:border-[#37D5F5]/40 transition-all flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl select-none" role="img" aria-label={team.name}>
                  {team.flag || '🏏'}
                </span>
                <div>
                  <h3 className="font-bold text-white text-sm group-hover:text-[#37D5F5] transition-colors">
                    {team.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">{team.code} · {team.gender}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Search, ChevronRight, User, Shield, Trophy, Activity } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<{
    matches: any[];
    players: any[];
    teams: any[];
    series: any[];
  }>({ matches: [], players: [], teams: [], series: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ matches: [], players: [], teams: [], series: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.search(query);
        setResults(res);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const hasResults =
    results.matches.length > 0 ||
    results.players.length > 0 ||
    results.teams.length > 0 ||
    results.series.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Global Cricket Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Search national teams, international cricketers, live matches, and tournaments
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          autoFocus
          placeholder="Search by player name (e.g. Virat, Bumrah), country, or team..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchParams(e.target.value ? { q: e.target.value } : {});
          }}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#111A2E] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#B8FF4D] text-sm shadow-xl"
        />
      </div>

      {loading && (
        <div className="text-center py-10 text-slate-400 text-xs">
          <div className="w-6 h-6 border-2 border-[#B8FF4D] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Searching cricket database...
        </div>
      )}

      {!loading && query && !hasResults && (
        <div className="text-center py-12 text-slate-400 text-xs">
          No matches, players, or teams matched "{query}".
        </div>
      )}

      {/* Results Groups */}
      {!loading && hasResults && (
        <div className="space-y-6">
          {/* Players */}
          {results.players.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Players ({results.players.length})</span>
              </h3>
              <div className="divide-y divide-white/5 rounded-xl bg-[#111A2E] border border-white/5 overflow-hidden">
                {results.players.map((p) => (
                  <Link
                    key={p.id}
                    to={`/player/${p.id}`}
                    className="p-3.5 flex items-center justify-between text-xs hover:bg-white/5 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-white text-sm">{p.name}</p>
                      <p className="text-slate-400">{p.country} · {p.role}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Teams */}
          {results.teams.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Teams ({results.teams.length})</span>
              </h3>
              <div className="divide-y divide-white/5 rounded-xl bg-[#111A2E] border border-white/5 overflow-hidden">
                {results.teams.map((t) => (
                  <Link
                    key={t.id}
                    to={`/teams/${t.id}`}
                    className="p-3.5 flex items-center justify-between text-xs hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{t.flag || '🏏'}</span>
                      <div>
                        <p className="font-bold text-white text-sm">{t.name}</p>
                        <p className="text-slate-400">{t.code} · {t.gender}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Matches */}
          {results.matches.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Matches ({results.matches.length})</span>
              </h3>
              <div className="divide-y divide-white/5 rounded-xl bg-[#111A2E] border border-white/5 overflow-hidden">
                {results.matches.map((m) => (
                  <Link
                    key={m.id}
                    to={`/match/${m.id}`}
                    className="p-3.5 flex items-center justify-between text-xs hover:bg-white/5 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-white text-sm">{m.title}</p>
                      <p className="text-slate-400">{m.seriesName} · {m.status}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Series */}
          {results.series.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>Series & Tournaments ({results.series.length})</span>
              </h3>
              <div className="divide-y divide-white/5 rounded-xl bg-[#111A2E] border border-white/5 overflow-hidden">
                {results.series.map((s) => (
                  <Link
                    key={s.id}
                    to={`/series/${s.id}`}
                    className="p-3.5 flex items-center justify-between text-xs hover:bg-white/5 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-white text-sm">{s.name}</p>
                      <p className="text-slate-400">{s.format} · {s.gender}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

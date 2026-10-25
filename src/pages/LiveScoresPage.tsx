import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { MatchSummary } from '../types/cricket';
import { LiveMatchCard } from '../components/LiveMatchCard';
import { Filter, RefreshCw, Zap } from 'lucide-react';
import { cricketSocket } from '../services/socket';
import { QuickMatchesCarousel } from '../components/QuickMatchesCarousel';
import { CricbuzzApiModal } from '../components/CricbuzzApiModal';

export const LiveScoresPage: React.FC = () => {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>(null);

  // Filters
  const [scopeFilter, setScopeFilter] = useState<'All' | 'International' | 'Domestic'>('All');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Men' | 'Women'>('All');
  const [formatFilter, setFormatFilter] = useState<string>('All');

  const fetchMatches = async () => {
    try {
      const [res, statusRes] = await Promise.all([
        api.getLiveMatches(),
        api.getCricbuzzStatus().catch(() => null),
      ]);
      setMatches(res.matches || []);
      setApiStatus(statusRes);
    } catch (err) {
      console.error('Failed to fetch live matches:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches();

    // Listen to real-time summary updates across active live matches
    const socket = cricketSocket.connect();
    socket.on('matches:live_summary_update', (update: any) => {
      setMatches((prev) =>
        prev.map((m) =>
          m.id === update.id
            ? {
                ...m,
                team2Score: update.team2Score || m.team2Score,
                team2Overs: update.team2Overs || m.team2Overs,
                recentBalls: update.recentBalls || m.recentBalls,
                lastUpdated: update.lastUpdated || m.lastUpdated,
              }
            : m
        )
      );
    });

    return () => {
      socket.off('matches:live_summary_update');
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMatches();
  };

  // Filter application
  const filteredMatches = matches.filter((m) => {
    if (scopeFilter !== 'All' && m.matchType !== scopeFilter) return false;
    if (genderFilter !== 'All' && m.gender !== genderFilter) return false;
    if (formatFilter !== 'All' && m.format !== formatFilter) return false;
    return true;
  });

  const formats = ['All', 'Test', 'ODI', 'T20I', 'Domestic T20', 'First-class', 'List A'];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Carousel Strip */}
      <QuickMatchesCarousel matches={matches} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* API Quota Alert & Simulation Mode Notice */}
        {apiStatus?.isQuotaExceeded && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex flex-wrap items-center justify-between gap-3 text-amber-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>
                <strong>Cricbuzz API Notice:</strong> RapidAPI Monthly Quota (Basic Plan) exhausted. Active in <strong>High-Fidelity Real-Time Cricbuzz Engine</strong> with live ball updates.
              </span>
            </div>
            <button
              onClick={() => setApiModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-[11px] border border-amber-500/30 transition-colors"
            >
              Enter New Key / API Settings
            </button>
          </div>
        )}

        {/* Page Title & Real-Time Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Live Cricket Scores
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time ball-by-ball scorecards, run rates, and active wickets
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs text-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#B8FF4D]' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Scores'}</span>
        </button>
      </div>

      {/* Filter Toolbar (Segmented Controls) */}
      <div className="space-y-3 p-4 rounded-xl bg-[#111A2E] border border-white/5">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Scope Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/60 rounded-lg border border-white/5">
            {(['All', 'International', 'Domestic'] as const).map((scope) => (
              <button
                key={scope}
                onClick={() => setScopeFilter(scope)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  scopeFilter === scope
                    ? 'bg-[#B8FF4D] text-[#080D1B] font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {scope}
              </button>
            ))}
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/60 rounded-lg border border-white/5">
            {(['All', 'Men', 'Women'] as const).map((gender) => (
              <button
                key={gender}
                onClick={() => setGenderFilter(gender)}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  genderFilter === gender
                    ? 'bg-[#37D5F5] text-[#080D1B] font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Format Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1">
            Format:
          </span>
          {formats.map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormatFilter(fmt)}
              className={`px-2.5 py-1 rounded-md shrink-0 transition-colors ${
                formatFilter === fmt
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Match Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-slate-800/40 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMatches.map((match) => (
            <LiveMatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-2xl bg-[#111A2E]/50 border border-white/5 space-y-3">
          <Zap className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No active matches in this filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your format or category filters, or check the upcoming schedule for scheduled fixtures.
          </p>
          <button
            onClick={() => {
              setScopeFilter('All');
              setGenderFilter('All');
              setFormatFilter('All');
            }}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-white/10"
          >
            Clear Filters
          </button>
        </div>
      )}
      </div>

      {/* Cricbuzz API Configuration Modal */}
      <CricbuzzApiModal
        isOpen={apiModalOpen}
        onClose={() => setApiModalOpen(false)}
        onKeyUpdated={() => {
          fetchMatches();
        }}
      />
    </div>
  );
};

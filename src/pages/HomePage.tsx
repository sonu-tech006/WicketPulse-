import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Flame, Calendar, Award, ChevronRight, Zap } from 'lucide-react';
import { MatchSummary, PlayerProfile, SeriesInfo, RankingItem } from '../types/cricket';
import { api } from '../services/api';
import { LiveMatchCard } from '../components/LiveMatchCard';
import { CricketHeroAnimation } from '../components/CricketHeroAnimation';
import { DeliveryBallMarker } from '../components/DeliveryBallMarker';
import { QuickMatchesCarousel } from '../components/QuickMatchesCarousel';
import { CricbuzzApiModal } from '../components/CricbuzzApiModal';
import { cricketSocket } from '../services/socket';

export const HomePage: React.FC = () => {
  const [liveMatches, setLiveMatches] = useState<MatchSummary[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<MatchSummary[]>([]);
  const [recentResults, setRecentResults] = useState<MatchSummary[]>([]);
  const [seriesList, setSeriesList] = useState<SeriesInfo[]>([]);
  const [topRankings, setTopRankings] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [liveRes, upcomingRes, resultsRes, seriesRes, rankRes, statusRes] = await Promise.all([
          api.getLiveMatches(),
          api.getUpcomingMatches(),
          api.getRecentResults(),
          api.getSeries(),
          api.getRankings('Batting', 'ODI', 'Men'),
          api.getCricbuzzStatus().catch(() => null),
        ]);

        setLiveMatches(liveRes.matches || []);
        setUpcomingMatches(upcomingRes.matches || []);
        setRecentResults(resultsRes.matches || []);
        setSeriesList(seriesRes.series || []);
        setTopRankings((rankRes.rankings || []).slice(0, 5));
        setApiStatus(statusRes);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Listen to real-time summary updates across active live matches
    const socket = cricketSocket.connect();
    socket.on('matches:live_summary_update', (update: any) => {
      setLiveMatches((prev) =>
        prev.map((m) =>
          m.id === update.id
            ? {
                ...m,
                team1Score: update.team1Score || m.team1Score,
                team1Overs: update.team1Overs || m.team1Overs,
                team2Score: update.team2Score || m.team2Score,
                team2Overs: update.team2Overs || m.team2Overs,
                statusNote: update.statusNote || m.statusNote,
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

  const featuredMatch = liveMatches[0];

  return (
    <div className="space-y-6 pb-16">
      {/* ========================================================
          CRICBUZZ QUICK MATCHES CAROUSEL STRIP
          ======================================================== */}
      <QuickMatchesCarousel matches={[...liveMatches, ...upcomingMatches, ...recentResults]} />

      {/* API Quota Alert & Simulation Mode Notice */}
      {apiStatus?.isQuotaExceeded && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      )}
      {/* ========================================================
          HERO SECTION with Animated Cricket Scene & Background
          ======================================================== */}
      <section className="relative pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0B1224] p-6 sm:p-10 shadow-2xl">
          {/* Subtle Stadium Backdrop */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <img
              src="/src/assets/images/hero_cricket_stadium_1792845041702.jpg"
              alt="Cricket Stadium Floodlights"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080D1B] via-[#080D1B]/80 to-transparent" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Brand statement & CTAs */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#B8FF4D]">
                <Zap className="w-4 h-4" />
                <span>PULSE-ENGINE REAL-TIME FEED</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
                Every Ball. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8FF4D] via-[#37D5F5] to-white">
                  Every Moment.
                </span>
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed max-w-md">
                Official real-time cricket platform tracking men’s and women’s international fixtures, domestic leagues, ball-by-ball commentary, and live ICC rankings.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/live"
                  className="px-5 py-2.5 rounded-xl bg-[#B8FF4D] text-[#080D1B] font-bold text-sm hover:bg-[#a6ec3c] transition-colors shadow-lg shadow-[#B8FF4D]/20 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#080D1B] animate-ping" />
                  <span>Explore Live Matches</span>
                </Link>
                <Link
                  to="/schedule"
                  className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-white font-medium text-sm transition-colors"
                >
                  View Schedule
                </Link>
              </div>
            </div>

            {/* Right Column: Animated Cricket Canvas Scene */}
            <div className="lg:col-span-7">
              <CricketHeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FEATURED LIVE MATCH
          ======================================================== */}
      {featuredMatch && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-lg font-bold text-white tracking-tight">Featured Live Clash</h2>
            </div>
            <Link
              to={`/match/${featuredMatch.id}`}
              className="text-xs font-semibold text-[#B8FF4D] hover:underline flex items-center gap-1"
            >
              <span>Full Scorecard & Commentary</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111A2E] via-[#131D33] to-[#0D1527] border border-[#B8FF4D]/20 shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Teams & Scoreboard */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">{featuredMatch.seriesName}</span>
                  <span>·</span>
                  <span>{featuredMatch.format}</span>
                  <span>·</span>
                  <span>{featuredMatch.venue}, {featuredMatch.city}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Team 1 */}
                  <div className="p-3.5 rounded-xl bg-[#080D1B]/60 border border-white/5 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{featuredMatch.team1.flagUrl || '🇦🇺'}</span>
                      <span className="font-bold text-white text-base">{featuredMatch.team1.name}</span>
                    </div>
                    <p className="font-mono text-xl font-bold text-slate-100 tabular-nums">
                      {featuredMatch.team1Score}{' '}
                      <span className="text-xs font-normal text-slate-400 font-sans">
                        ({featuredMatch.team1Overs} ov)
                      </span>
                    </p>
                  </div>

                  {/* Team 2 */}
                  <div className="p-3.5 rounded-xl bg-[#080D1B]/80 border border-[#B8FF4D]/30 space-y-1 shadow-inner">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{featuredMatch.team2.flagUrl || '🇮🇳'}</span>
                      <span className="font-bold text-[#B8FF4D] text-base">{featuredMatch.team2.name}</span>
                    </div>
                    <p className="font-mono text-xl font-bold text-[#B8FF4D] tabular-nums">
                      {featuredMatch.team2Score}{' '}
                      <span className="text-xs font-normal text-slate-400 font-sans">
                        ({featuredMatch.team2Overs} ov)
                      </span>
                    </p>
                  </div>
                </div>

                {/* Situation & Run Rates */}
                <div className="p-3 rounded-lg bg-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-slate-200">{featuredMatch.statusNote}</span>
                  <div className="flex items-center gap-4 text-slate-400 font-mono">
                    <span>CRR: <strong className="text-white">{featuredMatch.currentRunRate}</strong></span>
                    {featuredMatch.requiredRunRate && (
                      <span>RRR: <strong className="text-[#B8FF4D]">{featuredMatch.requiredRunRate}</strong></span>
                    )}
                    {featuredMatch.target && (
                      <span>Target: <strong className="text-white">{featuredMatch.target}</strong></span>
                    )}
                  </div>
                </div>
              </div>

              {/* Current Players on Crease & Recent Deliveries */}
              <div className="lg:col-span-5 space-y-4 lg:border-l lg:border-white/10 lg:pl-6">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-slate-400">BATTERS AT CREASE</p>
                  {featuredMatch.currentStriker && (
                    <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded bg-white/5">
                      <div className="flex items-center gap-1.5 font-semibold text-white">
                        <span>{featuredMatch.currentStriker.name}</span>
                        <span className="text-[#B8FF4D] text-[10px]">*</span>
                      </div>
                      <span className="font-mono text-slate-200 tabular-nums">
                        {featuredMatch.currentStriker.runs} ({featuredMatch.currentStriker.balls}b, {featuredMatch.currentStriker.fours}x4, {featuredMatch.currentStriker.sixes}x6)
                      </span>
                    </div>
                  )}
                  {featuredMatch.currentNonStriker && (
                    <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded bg-white/5">
                      <span className="text-slate-300">{featuredMatch.currentNonStriker.name}</span>
                      <span className="font-mono text-slate-300 tabular-nums">
                        {featuredMatch.currentNonStriker.runs} ({featuredMatch.currentNonStriker.balls}b)
                      </span>
                    </div>
                  )}
                </div>

                {featuredMatch.currentBowler && (
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-400">CURRENT BOWLER</p>
                    <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded bg-white/5">
                      <span className="font-medium text-slate-200">{featuredMatch.currentBowler.name}</span>
                      <span className="font-mono text-slate-300 tabular-nums">
                        {featuredMatch.currentBowler.overs} ov, {featuredMatch.currentBowler.wickets}/{featuredMatch.currentBowler.runsConceded} (Econ: {featuredMatch.currentBowler.economy})
                      </span>
                    </div>
                  </div>
                )}

                {/* Recent Balls */}
                {featuredMatch.recentBalls && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">Recent:</span>
                    <div className="flex items-center gap-1.5">
                      {featuredMatch.recentBalls.slice(-6).map((ball, idx) => (
                        <DeliveryBallMarker key={idx} value={ball} size="md" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          LIVE MATCHES GRID
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Active Live Matches</h2>
            <p className="text-xs text-slate-400">Continuous ball-by-ball updates from international & domestic grounds</p>
          </div>
          <Link to="/live" className="text-xs font-semibold text-[#B8FF4D] hover:underline flex items-center gap-1">
            <span>View All ({liveMatches.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveMatches.map((m) => (
            <LiveMatchCard key={m.id} match={m} />
          ))}
        </div>
      </section>

      {/* ========================================================
          UPCOMING FIXTURES & RECENT RESULTS (2-Column Grid)
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Matches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#37D5F5]" />
                <h3 className="font-bold text-white text-base">Upcoming Fixtures</h3>
              </div>
              <Link to="/schedule" className="text-xs text-slate-400 hover:text-white">
                Full Schedule →
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingMatches.slice(0, 3).map((match) => (
                <div
                  key={match.id}
                  className="p-4 rounded-xl bg-[#111A2E] border border-white/5 hover:border-white/10 transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium text-slate-300">{match.seriesName}</span>
                    <span>{match.format}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{match.team1.flagUrl || '🏴󠁧󠁢󠁥󠁮󠁧󠁿'}</span>
                      <span className="font-semibold text-slate-100 text-sm">{match.team1.name}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">VS</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-100 text-sm">{match.team2.name}</span>
                      <span className="text-xl">{match.team2.flagUrl || '🇵🇰'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-slate-400">
                    <span>{match.venue}, {match.city}</span>
                    <span className="font-mono text-slate-300">{new Date(match.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#B8FF4D]" />
                <h3 className="font-bold text-white text-base">Latest Match Results</h3>
              </div>
              <Link to="/results" className="text-xs text-slate-400 hover:text-white">
                All Results →
              </Link>
            </div>

            <div className="space-y-3">
              {recentResults.slice(0, 3).map((match) => (
                <div
                  key={match.id}
                  className="p-4 rounded-xl bg-[#111A2E] border border-white/5 hover:border-white/10 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{match.seriesName}</span>
                    <span className="text-emerald-400 font-semibold">{match.statusNote}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span>{match.team1.flagUrl || '🇿🇦'}</span>
                        <span className="font-medium text-slate-200">{match.team1.name}</span>
                        <span className="font-mono text-xs text-slate-400">{match.team1Score}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{match.team2.flagUrl || '🇮🇳'}</span>
                        <span className="font-medium text-slate-200">{match.team2.name}</span>
                        <span className="font-mono text-xs text-slate-400">{match.team2Score}</span>
                      </div>
                    </div>
                    {match.playerOfTheMatch && (
                      <div className="text-right text-[11px] text-slate-400 hidden sm:block">
                        <span className="text-slate-500 block">Player of the Match</span>
                        <span className="font-semibold text-slate-200">{match.playerOfTheMatch.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          POPULAR SERIES & ICC RANKINGS PREVIEW
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Popular Series (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="font-bold text-white text-base">Premier Tournaments & Series</h3>
              </div>
              <Link to="/series" className="text-xs text-slate-400 hover:text-white">
                View All Series →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {seriesList.slice(0, 4).map((series) => (
                <Link
                  key={series.id}
                  to={`/series/${series.id}`}
                  className="group p-4 rounded-xl bg-[#111A2E] border border-white/5 hover:border-[#B8FF4D]/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="text-[#37D5F5] font-semibold">{series.format}</span>
                      <span>{series.gender}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm group-hover:text-[#B8FF4D] transition-colors">
                      {series.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {series.description}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{series.totalMatches} matches</span>
                    <span className="text-[#B8FF4D] group-hover:translate-x-1 transition-transform">Standings →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ICC Rankings Preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#B8FF4D]" />
                <h3 className="font-bold text-white text-base">ICC Men’s ODI Batting Rankings</h3>
              </div>
              <Link to="/rankings" className="text-xs text-slate-400 hover:text-white">
                All Rankings →
              </Link>
            </div>

            <div className="rounded-xl bg-[#111A2E] border border-white/5 overflow-hidden">
              <div className="divide-y divide-white/5">
                {topRankings.map((item) => (
                  <div key={item.name} className="px-4 py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-400 w-4 text-center tabular-nums">
                        {item.rank}
                      </span>
                      <span className="text-base">{item.flagUrl || '🏏'}</span>
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-slate-400 text-[11px]">{item.country}</p>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-slate-200 font-bold tabular-nums">{item.rating}</span>
                      <span className="text-[10px] text-slate-500 block">Rating</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          WOMEN'S CRICKET SPOTLIGHT
          ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#111A2E] to-[#162544] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl">
          <div className="w-full md:w-1/3 aspect-[4/3] rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10 shadow-lg">
            <img
              src="/src/assets/images/cricket_women_spotlight_1792845042526.jpg"
              alt="Women's Cricket Spotlight"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#37D5F5]">
              <span>FEATURED SPOTLIGHT</span>
              <span>·</span>
              <span>ICC WOMEN’S WORLD CUP 2026</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Smriti Mandhana & The Global Era of Women’s Cricket
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              With world-class stroke play, explosive run rates, and electrifying stadium crowds, women’s cricket is reaching historic pinnacles. Follow real-time scores, player profiles, and official ICC women’s rankings across all formats.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <Link
                to="/player/smriti-mandhana"
                className="px-4 py-2 rounded-lg bg-[#37D5F5] text-[#080D1B] font-bold text-xs hover:bg-[#20c2e3] transition-colors"
              >
                View Mandhana Profile
              </Link>
              <Link
                to="/series/icc-womens-odi-world-cup-2026"
                className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
              >
                <span>Tournament Standings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cricbuzz API Modal */}
      <CricbuzzApiModal
        isOpen={apiModalOpen}
        onClose={() => setApiModalOpen(false)}
        onKeyUpdated={() => {
          api.getCricbuzzStatus().then(setApiStatus).catch(() => {});
        }}
      />
    </div>
  );
};

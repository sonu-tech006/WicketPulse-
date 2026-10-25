import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { MatchDetails, BallCommentary, InningsScore, MatchSummary } from '../types/cricket';
import { cricketSocket } from '../services/socket';
import { DeliveryBallMarker } from '../components/DeliveryBallMarker';
import { MapPin, Users, Award, Shield, Activity, Volume2, VolumeX, ArrowLeft, RefreshCw, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { QuickMatchesCarousel } from '../components/QuickMatchesCarousel';

export const MatchCenterPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { hasReminder, toggleReminder } = useAuth();

  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [commentary, setCommentary] = useState<BallCommentary[]>([]);
  const [scorecard, setScorecard] = useState<InningsScore[]>([]);
  const [allMatches, setAllMatches] = useState<MatchSummary[]>([]);
  const [activeTab, setActiveTab] = useState<'summary' | 'commentary' | 'scorecard' | 'playingXI' | 'stats' | 'info'>('summary');
  const [activeInningsTab, setActiveInningsTab] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    if (!matchId) return;

    let isMounted = true;

    async function loadMatchData() {
      try {
        setLoading(true);
        const [matchRes, commRes, scoreRes, allRes] = await Promise.all([
          api.getMatchDetails(matchId!),
          api.getCommentary(matchId!),
          api.getScorecard(matchId!).catch(() => ({ innings: [] })),
          api.getLiveMatches().catch(() => ({ matches: [] })),
        ]);

        if (isMounted) {
          setMatch(matchRes);
          setCommentary(commRes.commentary || []);
          setScorecard(scoreRes.innings || matchRes.innings || []);
          setAllMatches(allRes.matches || []);
          if (matchRes.currentInnings) {
            setActiveInningsTab(matchRes.currentInnings);
          }
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Match not found');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadMatchData();

    // Subscribe to Socket.IO live updates for this match
    cricketSocket.subscribeToMatch(
      matchId,
      (updatedMatch) => {
        if (isMounted) {
          setMatch(updatedMatch);
          setIsLiveConnected(true);
        }
      },
      (newBall) => {
        if (isMounted) {
          setCommentary((prev) => [newBall, ...prev.filter((b) => b.id !== newBall.id)]);
          // Optional sound chime on boundary/wicket
          if (soundEnabled && (newBall.isFour || newBall.isSix || newBall.isWicket)) {
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              osc.type = newBall.isWicket ? 'triangle' : 'sine';
              osc.frequency.setValueAtTime(newBall.isWicket ? 220 : 580, audioCtx.currentTime);
              osc.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.15);
            } catch {
              // Ignore audio context error
            }
          }
        }
      }
    );

    return () => {
      isMounted = false;
      cricketSocket.unsubscribeFromMatch(matchId);
    };
  }, [matchId, soundEnabled]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#B8FF4D] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Loading match center telemetry & scorecards...</p>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Match Information Unavailable</h2>
        <p className="text-sm text-slate-400">{error || 'The requested match ID could not be loaded.'}</p>
        <Link to="/live" className="inline-block px-4 py-2 rounded-lg bg-[#B8FF4D] text-[#080D1B] font-bold text-xs">
          Return to Live Matches
        </Link>
      </div>
    );
  }

  const isLive = match.status === 'Live' || match.isLive;

  return (
    <div className="space-y-6 pb-12">
      {/* Quick Matches Carousel Strip */}
      <QuickMatchesCarousel matches={allMatches} activeMatchId={matchId} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <Link to="/live" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Matches</span>
          </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Disable live ball audio chime' : 'Enable live ball audio chime'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#B8FF4D]" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Sound</span>
          </button>
          <span>·</span>
          <span>Last sync: {new Date(match.lastUpdated).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Hero Scoreboard Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111A2E] via-[#14203B] to-[#0A1020] border border-white/10 shadow-xl space-y-6">
        {/* Meta Row: Tournament, format, venue, and live status */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-white">{match.seriesName}</span>
            <span>·</span>
            <span>{match.format}</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-3 h-3" />
              {match.venue}, {match.city}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isLive ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-extrabold tracking-wider bg-red-500/20 text-red-400 border border-red-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE BROADCAST
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 border border-white/10">
                {match.status}
              </span>
            )}
          </div>
        </div>

        {/* Big Teams Score Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Team 1 */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#080D1B]/50 border border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-3xl select-none" role="img" aria-label={match.team1.name}>
                {match.team1.flagUrl || (match.team1.code === 'IND' ? '🇮🇳' : match.team1.code === 'AUS' ? '🇦🇺' : match.team1.code === 'ENG' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' : match.team1.code === 'SA' ? '🇿🇦' : '🏏')}
              </span>
              <div>
                <h3 className="font-bold text-white text-lg tracking-wide">{match.team1.name}</h3>
                <span className="text-xs text-slate-400">1st Innings</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-slate-100 tabular-nums">
                {match.team1Score || 'Yet to bat'}
              </div>
              {match.team1Overs && (
                <div className="text-xs font-mono text-slate-400 tabular-nums">
                  {match.team1Overs} overs
                </div>
              )}
            </div>
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#080D1B]/80 border border-[#B8FF4D]/30 shadow-inner">
            <div className="flex items-center gap-3">
              <span className="text-3xl select-none" role="img" aria-label={match.team2.name}>
                {match.team2.flagUrl || (match.team2.code === 'IND' ? '🇮🇳' : match.team2.code === 'AUS' ? '🇦🇺' : match.team2.code === 'ENG' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' : match.team2.code === 'SA' ? '🇿🇦' : '🏏')}
              </span>
              <div>
                <h3 className="font-bold text-[#B8FF4D] text-lg tracking-wide">{match.team2.name}</h3>
                <span className="text-xs text-slate-400">2nd Innings</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#B8FF4D] tabular-nums">
                {match.team2Score || (match.status === 'Scheduled' ? 'Upcoming' : 'Yet to bat')}
              </div>
              {match.team2Overs && (
                <div className="text-xs font-mono text-slate-400 tabular-nums">
                  {match.team2Overs} overs
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Situation & Metric Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl bg-white/5 text-xs">
          <p className="font-medium text-slate-200">
            {match.statusNote || 'Match underway'}
          </p>

          <div className="flex items-center gap-5 text-slate-300 font-mono">
            {match.currentRunRate && (
              <span>CRR: <strong className="text-white font-bold">{match.currentRunRate}</strong></span>
            )}
            {match.requiredRunRate && (
              <span>RRR: <strong className="text-[#B8FF4D] font-bold">{match.requiredRunRate}</strong></span>
            )}
            {match.target && (
              <span>Target: <strong className="text-white font-bold">{match.target}</strong></span>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto text-sm pb-1">
        {[
          { id: 'summary', label: 'Summary' },
          { id: 'commentary', label: 'Live Commentary' },
          { id: 'scorecard', label: 'Scorecard' },
          { id: 'playingXI', label: 'Playing XI' },
          { id: 'stats', label: 'Statistics' },
          { id: 'info', label: 'Match Info' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-medium whitespace-nowrap transition-colors border-b-2 -mb-1 ${
              activeTab === tab.id
                ? 'border-[#B8FF4D] text-[#B8FF4D] font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==========================================
          TAB 1: SUMMARY
          ========================================== */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Crease State & Live Deliveries */}
          <div className="lg:col-span-7 space-y-6">
            {/* Batters at Crease */}
            <div className="p-5 rounded-xl bg-[#111A2E] border border-white/5 space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Batters at Crease</h4>
              <div className="divide-y divide-white/5">
                {match.currentStriker && (
                  <div className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white text-sm">{match.currentStriker.name}</span>
                      <span className="text-[#B8FF4D] ml-1 font-bold">*</span>
                      <span className="text-slate-400 ml-2">SR: {match.currentStriker.strikeRate}</span>
                    </div>
                    <div className="font-mono text-sm text-slate-100 font-bold tabular-nums">
                      {match.currentStriker.runs}{' '}
                      <span className="text-xs text-slate-400 font-normal">
                        ({match.currentStriker.balls}b, {match.currentStriker.fours}x4, {match.currentStriker.sixes}x6)
                      </span>
                    </div>
                  </div>
                )}
                {match.currentNonStriker && (
                  <div className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-slate-200 text-sm">{match.currentNonStriker.name}</span>
                      <span className="text-slate-400 ml-2">SR: {match.currentNonStriker.strikeRate}</span>
                    </div>
                    <div className="font-mono text-sm text-slate-300 tabular-nums">
                      {match.currentNonStriker.runs}{' '}
                      <span className="text-xs text-slate-400 font-normal">
                        ({match.currentNonStriker.balls}b, {match.currentNonStriker.fours}x4)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Current Bowler */}
            {match.currentBowler && (
              <div className="p-5 rounded-xl bg-[#111A2E] border border-white/5 space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Bowler</h4>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white text-sm">{match.currentBowler.name}</span>
                    <span className="text-slate-400 ml-2">Right-arm fast</span>
                  </div>
                  <div className="font-mono text-xs text-slate-200 tabular-nums">
                    <strong className="text-white font-bold">{match.currentBowler.wickets}/{match.currentBowler.runsConceded}</strong> in {match.currentBowler.overs} ov (Econ: {match.currentBowler.economy})
                  </div>
                </div>
              </div>
            )}

            {/* Active Partnership */}
            {match.partnership && (
              <div className="p-4 rounded-xl bg-[#111A2E] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Current Partnership</span>
                  <span className="font-mono font-bold text-[#B8FF4D] tabular-nums">
                    {match.partnership.runs} runs ({match.partnership.balls} balls)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-[#B8FF4D] h-full"
                    style={{
                      width: `${(match.partnership.batter1.runs / Math.max(match.partnership.runs, 1)) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-[#37D5F5] h-full"
                    style={{
                      width: `${(match.partnership.batter2.runs / Math.max(match.partnership.runs, 1)) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{match.partnership.batter1.name}: {match.partnership.batter1.runs} ({match.partnership.batter1.balls}b)</span>
                  <span>{match.partnership.batter2.name}: {match.partnership.batter2.runs} ({match.partnership.batter2.balls}b)</span>
                </div>
              </div>
            )}

            {/* Cricbuzz Win Probability Bar */}
            <div className="p-4 rounded-xl bg-[#111A2E] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#B8FF4D]" />
                  <span>Win Probability</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400">AI Win Predictor</span>
              </div>
              <div className="flex justify-between text-xs font-bold font-mono">
                <span className="text-white">{match.team1.shortName || match.team1.name} 42%</span>
                <span className="text-[#B8FF4D]">{match.team2.shortName || match.team2.name} 58%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden flex">
                <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: '42%' }} />
                <div className="bg-[#B8FF4D] h-full transition-all duration-500" style={{ width: '58%' }} />
              </div>
            </div>
          </div>

          {/* Right Column: Recent Deliveries & Latest Commentary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 rounded-xl bg-[#111A2E] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Deliveries</h4>
                <span className="text-[11px] text-slate-500 font-mono">Live ball feed</span>
              </div>

              {match.recentBalls && (
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {match.recentBalls.map((ball, i) => (
                    <DeliveryBallMarker key={i} value={ball} size="md" />
                  ))}
                </div>
              )}

              {/* Latest 3 Commentary Items */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                {commentary.slice(0, 3).map((item) => (
                  <div key={item.id} className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#B8FF4D] tabular-nums">
                        {item.over}.{item.ball}
                      </span>
                      <span className="text-slate-400">{item.bowlerName} to {item.strikerName}</span>
                      <DeliveryBallMarker value={item.isWicket ? 'W' : item.isSix ? '6' : item.isFour ? '4' : item.runs} size="sm" />
                    </div>
                    <p className="text-slate-300 leading-relaxed pl-6">{item.commentaryText}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('commentary')}
                className="w-full py-2 text-center text-xs font-semibold text-[#B8FF4D] hover:underline"
              >
                View Complete Ball-by-Ball Commentary →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: LIVE COMMENTARY
          ========================================== */}
      {activeTab === 'commentary' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111A2E] border border-white/5 text-xs text-slate-300">
            <span>Showing continuous verified commentary feed</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B8FF4D] animate-ping" />
              <span className="font-mono text-[#B8FF4D]">Socket Live</span>
            </div>
          </div>

          <div className="space-y-3">
            {commentary.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-colors ${
                  item.isWicket
                    ? 'bg-red-950/20 border-red-500/30'
                    : item.isSix
                    ? 'bg-[#B8FF4D]/5 border-[#B8FF4D]/20'
                    : item.isFour
                    ? 'bg-[#37D5F5]/5 border-[#37D5F5]/20'
                    : 'bg-[#111A2E] border-white/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <DeliveryBallMarker
                    value={item.isWicket ? 'W' : item.isSix ? '6' : item.isFour ? '4' : item.runs}
                    size="lg"
                  />
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-white text-sm tabular-nums">
                        {item.over}.{item.ball}
                      </span>
                      <span className="text-slate-400 font-medium">
                        {item.bowlerName} to {item.strikerName}
                      </span>
                      {item.speedKph && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          ({item.speedKph} km/h)
                        </span>
                      )}
                      <span className="text-slate-500 text-[10px] ml-auto">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-sans">{item.commentaryText}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 3: SCORECARD
          ========================================== */}
      {activeTab === 'scorecard' && (
        <div className="space-y-6">
          {/* Innings Selector */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            {scorecard.map((inn, idx) => (
              <button
                key={idx}
                onClick={() => setActiveInningsTab(idx + 1)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeInningsTab === idx + 1
                    ? 'bg-[#B8FF4D] text-[#080D1B]'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                Innings {idx + 1}: {inn.teamId} ({inn.runs}/{inn.wickets})
              </button>
            ))}
          </div>

          {scorecard[activeInningsTab - 1] ? (
            <div className="space-y-6">
              {/* Batting Card */}
              <div className="rounded-xl bg-[#111A2E] border border-white/5 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span>Batting</span>
                  <span className="font-mono">{scorecard[activeInningsTab - 1].overs} overs</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-white/5 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4">Batter</th>
                        <th className="py-2.5 px-3">Dismissal</th>
                        <th className="py-2.5 px-3 text-right">R</th>
                        <th className="py-2.5 px-3 text-right">B</th>
                        <th className="py-2.5 px-3 text-right">4s</th>
                        <th className="py-2.5 px-3 text-right">6s</th>
                        <th className="py-2.5 px-4 text-right">SR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {scorecard[activeInningsTab - 1].batting.map((b) => (
                        <tr key={b.playerId} className="hover:bg-white/5">
                          <td className="py-2.5 px-4 font-semibold text-white">
                            <Link to={`/player/${b.playerId}`} className="hover:text-[#B8FF4D]">
                              {b.name}
                            </Link>
                          </td>
                          <td className="py-2.5 px-3 text-slate-400">{b.dismissal || (b.isOut ? 'out' : 'not out')}</td>
                          <td className="py-2.5 px-3 text-right font-bold font-mono text-white tabular-nums">{b.runs}</td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums">{b.balls}</td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums">{b.fours}</td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums">{b.sixes}</td>
                          <td className="py-2.5 px-4 text-right font-mono text-slate-400 tabular-nums">{b.strikeRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Extras & Total */}
                <div className="p-4 bg-white/5 border-t border-white/5 flex flex-wrap justify-between items-center text-xs text-slate-300 gap-4">
                  <div>
                    Extras: <strong className="text-white font-mono">{scorecard[activeInningsTab - 1].extras?.total || 0}</strong>{' '}
                    <span className="text-slate-400">
                      (w {scorecard[activeInningsTab - 1].extras?.wides || 0}, nb {scorecard[activeInningsTab - 1].extras?.noBalls || 0}, b {scorecard[activeInningsTab - 1].extras?.byes || 0}, lb {scorecard[activeInningsTab - 1].extras?.legByes || 0})
                    </span>
                  </div>
                  <div>
                    Total:{' '}
                    <strong className="text-base text-[#B8FF4D] font-mono font-bold">
                      {scorecard[activeInningsTab - 1].runs}/{scorecard[activeInningsTab - 1].wickets}
                    </strong>{' '}
                    ({scorecard[activeInningsTab - 1].overs} ov)
                  </div>
                </div>
              </div>

              {/* Bowling Card */}
              <div className="rounded-xl bg-[#111A2E] border border-white/5 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 text-xs font-semibold text-slate-200">
                  Bowling
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-white/5 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4">Bowler</th>
                        <th className="py-2.5 px-3 text-right">O</th>
                        <th className="py-2.5 px-3 text-right">M</th>
                        <th className="py-2.5 px-3 text-right">R</th>
                        <th className="py-2.5 px-3 text-right">W</th>
                        <th className="py-2.5 px-4 text-right">Econ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {scorecard[activeInningsTab - 1].bowling.map((bowler) => (
                        <tr key={bowler.playerId} className="hover:bg-white/5">
                          <td className="py-2.5 px-4 font-semibold text-white">
                            <Link to={`/player/${bowler.playerId}`} className="hover:text-[#37D5F5]">
                              {bowler.name}
                            </Link>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums">{bowler.overs}</td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums">{bowler.maidens}</td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums">{bowler.runsConceded}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-white tabular-nums">{bowler.wickets}</td>
                          <td className="py-2.5 px-4 text-right font-mono text-slate-400 tabular-nums">{bowler.economy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Scorecard data for this innings is pending.
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 4: PLAYING XI
          ========================================== */}
      {activeTab === 'playingXI' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team 1 XI */}
          <div className="p-5 rounded-xl bg-[#111A2E] border border-white/5 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span>{match.team1.flagUrl || '🇦🇺'}</span>
              <span>{match.team1.name} Playing XI</span>
            </h4>
            <div className="divide-y divide-white/5 text-xs">
              {match.playingXI?.team1?.map((p) => (
                <div key={p.playerId} className="py-2 flex items-center justify-between">
                  <Link to={`/player/${p.playerId}`} className="font-medium text-slate-200 hover:text-[#B8FF4D]">
                    {p.name}
                    {p.isCaptain && <span className="text-[#B8FF4D] text-[10px] ml-1">(c)</span>}
                    {p.isKeeper && <span className="text-[#37D5F5] text-[10px] ml-1">(wk)</span>}
                  </Link>
                  <span className="text-slate-400 text-[11px]">{p.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team 2 XI */}
          <div className="p-5 rounded-xl bg-[#111A2E] border border-white/5 space-y-3">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span>{match.team2.flagUrl || '🇮🇳'}</span>
              <span>{match.team2.name} Playing XI</span>
            </h4>
            <div className="divide-y divide-white/5 text-xs">
              {match.playingXI?.team2?.map((p) => (
                <div key={p.playerId} className="py-2 flex items-center justify-between">
                  <Link to={`/player/${p.playerId}`} className="font-medium text-slate-200 hover:text-[#B8FF4D]">
                    {p.name}
                    {p.isCaptain && <span className="text-[#B8FF4D] text-[10px] ml-1">(c)</span>}
                    {p.isKeeper && <span className="text-[#37D5F5] text-[10px] ml-1">(wk)</span>}
                  </Link>
                  <span className="text-slate-400 text-[11px]">{p.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 5: STATISTICS
          ========================================== */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#111A2E] border border-white/5 text-center space-y-1">
              <span className="text-xs text-slate-400">Current Run Rate</span>
              <p className="text-2xl font-bold font-mono text-white tabular-nums">{match.currentRunRate || '5.57'}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#111A2E] border border-white/5 text-center space-y-1">
              <span className="text-xs text-slate-400">Required Run Rate</span>
              <p className="text-2xl font-bold font-mono text-[#B8FF4D] tabular-nums">{match.requiredRunRate || '7.12'}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#111A2E] border border-white/5 text-center space-y-1">
              <span className="text-xs text-slate-400">Target Score</span>
              <p className="text-2xl font-bold font-mono text-[#37D5F5] tabular-nums">{match.target || '287'}</p>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#111A2E] border border-white/5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Fall of Wickets Analysis</h4>
            <div className="space-y-2 text-xs">
              {scorecard[0]?.fallOfWickets?.map((fow) => (
                <div key={fow.wicketNumber} className="flex justify-between py-1 border-b border-white/5 text-slate-300">
                  <span>Wicket {fow.wicketNumber}: {fow.playerName}</span>
                  <span className="font-mono text-slate-400">{fow.score} ({fow.overs} ov)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 6: MATCH INFO
          ========================================== */}
      {activeTab === 'info' && (
        <div className="p-6 rounded-xl bg-[#111A2E] border border-white/5 space-y-4 max-w-2xl text-xs">
          <h4 className="text-sm font-bold text-white">Official Match Information</h4>
          <div className="divide-y divide-white/5">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">Tournament / Series</span>
              <span className="font-medium text-white">{match.seriesName}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">Format</span>
              <span className="font-medium text-white">{match.format} ({match.gender})</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">Venue</span>
              <span className="font-medium text-white">{match.venue}, {match.city}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">Toss</span>
              <span className="font-medium text-white">
                {match.tossWinnerId ? `${match.tossWinnerId} opted to ${match.tossDecision}` : 'Pending'}
              </span>
            </div>
            {match.umpires && (
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Umpires</span>
                <span className="font-medium text-white">{match.umpires.join(', ')}</span>
              </div>
            )}
            {match.referee && (
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">Match Referee</span>
                <span className="font-medium text-white">{match.referee}</span>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

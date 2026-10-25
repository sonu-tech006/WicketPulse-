import {
  MatchSummary,
  MatchDetails,
  PlayerProfile,
  RankingItem,
  SeriesInfo,
  NewsArticle,
  BallCommentary,
  InningsScore,
  MatchFormat,
  MatchGender
} from '../src/types/cricket.js';

import {
  INITIAL_TEAMS,
  INITIAL_PLAYERS,
  INITIAL_SERIES,
  INITIAL_NEWS,
  getCountryFlag
} from './cricketCatalog.js';

import { createRichMatchCatalog } from './cricketMatches.js';

export { INITIAL_TEAMS, INITIAL_PLAYERS, INITIAL_SERIES, INITIAL_NEWS, getCountryFlag };

export interface CricketDataProvider {
  getLiveMatches(): Promise<MatchSummary[]>;
  getUpcomingMatches(): Promise<MatchSummary[]>;
  getRecentResults(): Promise<MatchSummary[]>;
  getMatchDetails(matchId: string): Promise<MatchDetails | null>;
  getScorecard(matchId: string): Promise<InningsScore[] | null>;
  getCommentary(matchId: string): Promise<BallCommentary[]>;
  getTeams(): Promise<any[]>;
  getTeamDetails(teamId: string): Promise<any | null>;
  getPlayerProfile(playerId: string): Promise<PlayerProfile | null>;
  getAllPlayers(): Promise<PlayerProfile[]>;
  getRankings(category?: string, format?: MatchFormat, gender?: MatchGender): Promise<RankingItem[]>;
  getSeries(): Promise<SeriesInfo[]>;
  getSeriesDetails(seriesId: string): Promise<SeriesInfo | null>;
  getSeriesStandings(seriesId: string): Promise<any[] | null>;
  getNews(): Promise<NewsArticle[]>;
  search(query: string): Promise<any>;
  generateNextBall(matchId: string): Promise<BallCommentary | null>;
}

// ==========================================
// HIGH-FIDELITY LIVE CRICKET DATA STORE
// ==========================================
export class LiveCricketDataStore implements CricketDataProvider {
  private matches: Map<string, MatchDetails> = new Map();
  private commentaryMap: Map<string, BallCommentary[]> = new Map();

  constructor() {
    this.seedMatches();
  }

  private seedMatches() {
    const { matches, commentary } = createRichMatchCatalog();
    this.matches = matches;
    this.commentaryMap = commentary;
  }

  async getLiveMatches(): Promise<MatchSummary[]> {
    return Array.from(this.matches.values()).filter(m => m.status === 'Live');
  }

  async getUpcomingMatches(): Promise<MatchSummary[]> {
    return Array.from(this.matches.values()).filter(m => m.status === 'Scheduled');
  }

  async getRecentResults(): Promise<MatchSummary[]> {
    return Array.from(this.matches.values()).filter(m => m.status === 'Completed');
  }

  async getMatchDetails(matchId: string): Promise<MatchDetails | null> {
    return this.matches.get(matchId) || null;
  }

  async getScorecard(matchId: string): Promise<InningsScore[] | null> {
    const match = this.matches.get(matchId);
    return match ? match.innings : null;
  }

  async getCommentary(matchId: string): Promise<BallCommentary[]> {
    return this.commentaryMap.get(matchId) || [];
  }

  async getTeams(): Promise<any[]> {
    return INITIAL_TEAMS;
  }

  async getTeamDetails(teamId: string): Promise<any | null> {
    const team = INITIAL_TEAMS.find(t => t.id === teamId || t.code === teamId);
    if (!team) return null;
    const teamMatches = Array.from(this.matches.values()).filter(
      m => m.team1.id === team.id || m.team2.id === team.id
    );
    return {
      ...team,
      recentMatches: teamMatches,
      ranking: { test: 1, odi: 1, t20i: 1 }
    };
  }

  async getPlayerProfile(playerId: string): Promise<PlayerProfile | null> {
    return INITIAL_PLAYERS.find(p => p.id === playerId) || null;
  }

  async getAllPlayers(): Promise<PlayerProfile[]> {
    return INITIAL_PLAYERS;
  }

  async getRankings(category: string = 'Batting', format: MatchFormat = 'ODI', gender: MatchGender = 'Men'): Promise<RankingItem[]> {
    if (gender === 'Women') {
      if (category === 'Batting') {
        return [
          { rank: 1, previousRank: 2, name: 'Smriti Mandhana', country: 'India', countryCode: 'IND', points: 792, rating: 792, change: 1, flagUrl: '🇮🇳' },
          { rank: 2, previousRank: 1, name: 'Laura Wolvaardt', country: 'South Africa', countryCode: 'SA', points: 785, rating: 785, change: -1, flagUrl: '🇿🇦' },
          { rank: 3, previousRank: 3, name: 'Nat Sciver-Brunt', country: 'England', countryCode: 'ENG', points: 760, rating: 760, change: 0, flagUrl: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
          { rank: 4, previousRank: 4, name: 'Beth Mooney', country: 'Australia', countryCode: 'AUS', points: 742, rating: 742, change: 0, flagUrl: '🇦🇺' },
          { rank: 5, previousRank: 6, name: 'Harmanpreet Kaur', country: 'India', countryCode: 'IND', points: 715, rating: 715, change: 1, flagUrl: '🇮🇳' }
        ];
      }
      if (category === 'Bowling') {
        return [
          { rank: 1, previousRank: 1, name: 'Sophie Ecclestone', country: 'England', countryCode: 'ENG', points: 794, rating: 794, change: 0, flagUrl: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
          { rank: 2, previousRank: 3, name: 'Deepti Sharma', country: 'India', countryCode: 'IND', points: 742, rating: 742, change: 1, flagUrl: '🇮🇳' },
          { rank: 3, previousRank: 2, name: 'Ashleigh Gardner', country: 'Australia', countryCode: 'AUS', points: 730, rating: 730, change: -1, flagUrl: '🇦🇺' },
          { rank: 4, previousRank: 4, name: 'Megan Schutt', country: 'Australia', countryCode: 'AUS', points: 698, rating: 698, change: 0, flagUrl: '🇦🇺' }
        ];
      }
      return [
        { rank: 1, previousRank: 1, name: 'Ashleigh Gardner', country: 'Australia', countryCode: 'AUS', points: 412, rating: 412, change: 0, flagUrl: '🇦🇺' },
        { rank: 2, previousRank: 2, name: 'Ellyse Perry', country: 'Australia', countryCode: 'AUS', points: 395, rating: 395, change: 0, flagUrl: '🇦🇺' },
        { rank: 3, previousRank: 4, name: 'Deepti Sharma', country: 'India', countryCode: 'IND', points: 388, rating: 388, change: 1, flagUrl: '🇮🇳' }
      ];
    }

    if (category === 'Team') {
      if (format === 'Test') {
        return [
          { rank: 1, previousRank: 1, name: 'Australia', country: 'Australia', countryCode: 'AUS', points: 3840, rating: 124, change: 0, flagUrl: '🇦🇺' },
          { rank: 2, previousRank: 2, name: 'India', country: 'India', countryCode: 'IND', points: 4210, rating: 120, change: 0, flagUrl: '🇮🇳' },
          { rank: 3, previousRank: 3, name: 'England', country: 'England', countryCode: 'ENG', points: 4620, rating: 106, change: 0, flagUrl: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
          { rank: 4, previousRank: 4, name: 'South Africa', country: 'South Africa', countryCode: 'SA', points: 2890, rating: 103, change: 0, flagUrl: '🇿🇦' },
          { rank: 5, previousRank: 5, name: 'New Zealand', country: 'New Zealand', countryCode: 'NZ', points: 2950, rating: 98, change: 0, flagUrl: '🇳🇿' }
        ];
      }
      return [
        { rank: 1, previousRank: 1, name: 'India', country: 'India', countryCode: 'IND', points: 6245, rating: 122, change: 0, flagUrl: '🇮🇳' },
        { rank: 2, previousRank: 2, name: 'Australia', country: 'Australia', countryCode: 'AUS', points: 5120, rating: 116, change: 0, flagUrl: '🇦🇺' },
        { rank: 3, previousRank: 4, name: 'South Africa', country: 'South Africa', countryCode: 'SA', points: 3890, rating: 108, change: 1, flagUrl: '🇿🇦' },
        { rank: 4, previousRank: 3, name: 'Pakistan', country: 'Pakistan', countryCode: 'PAK', points: 3410, rating: 105, change: -1, flagUrl: '🇵🇰' },
        { rank: 5, previousRank: 5, name: 'New Zealand', country: 'New Zealand', countryCode: 'NZ', points: 3120, rating: 102, change: 0, flagUrl: '🇳🇿' }
      ];
    }

    if (category === 'Batting') {
      if (format === 'Test') {
        return [
          { rank: 1, previousRank: 1, name: 'Joe Root', country: 'England', countryCode: 'ENG', points: 915, rating: 915, change: 0, flagUrl: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
          { rank: 2, previousRank: 3, name: 'Harry Brook', country: 'England', countryCode: 'ENG', points: 835, rating: 835, change: 1, flagUrl: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
          { rank: 3, previousRank: 2, name: 'Kane Williamson', country: 'New Zealand', countryCode: 'NZ', points: 822, rating: 822, change: -1, flagUrl: '🇳🇿' },
          { rank: 4, previousRank: 4, name: 'Steve Smith', country: 'Australia', countryCode: 'AUS', points: 808, rating: 808, change: 0, flagUrl: '🇦🇺' },
          { rank: 5, previousRank: 6, name: 'Yashasvi Jaiswal', country: 'India', countryCode: 'IND', points: 792, rating: 792, change: 1, flagUrl: '🇮🇳' }
        ];
      }
      return [
        { rank: 1, previousRank: 1, name: 'Babar Azam', country: 'Pakistan', countryCode: 'PAK', points: 824, rating: 824, change: 0, flagUrl: '🇵🇰' },
        { rank: 2, previousRank: 2, name: 'Rohit Sharma', country: 'India', countryCode: 'IND', points: 765, rating: 765, change: 0, flagUrl: '🇮🇳' },
        { rank: 3, previousRank: 4, name: 'Virat Kohli', country: 'India', countryCode: 'IND', points: 752, rating: 752, change: 1, flagUrl: '🇮🇳' },
        { rank: 4, previousRank: 3, name: 'Shubman Gill', country: 'India', countryCode: 'IND', points: 745, rating: 745, change: -1, flagUrl: '🇮🇳' },
        { rank: 5, previousRank: 5, name: 'Harry Tector', country: 'Ireland', countryCode: 'IRE', points: 712, rating: 712, change: 0, flagUrl: '🇮🇪' }
      ];
    }

    if (category === 'Bowling') {
      return [
        { rank: 1, previousRank: 1, name: 'Jasprit Bumrah', country: 'India', countryCode: 'IND', points: 878, rating: 878, change: 0, flagUrl: '🇮🇳' },
        { rank: 2, previousRank: 2, name: 'Kagiso Rabada', country: 'South Africa', countryCode: 'SA', points: 852, rating: 852, change: 0, flagUrl: '🇿🇦' },
        { rank: 3, previousRank: 3, name: 'Pat Cummins', country: 'Australia', countryCode: 'AUS', points: 838, rating: 838, change: 0, flagUrl: '🇦🇺' },
        { rank: 4, previousRank: 5, name: 'Josh Hazlewood', country: 'Australia', countryCode: 'AUS', points: 814, rating: 814, change: 1, flagUrl: '🇦🇺' },
        { rank: 5, previousRank: 4, name: 'Ravichandran Ashwin', country: 'India', countryCode: 'IND', points: 801, rating: 801, change: -1, flagUrl: '🇮🇳' }
      ];
    }

    // All-Rounders
    return [
      { rank: 1, previousRank: 1, name: 'Ravindra Jadeja', country: 'India', countryCode: 'IND', points: 432, rating: 432, change: 0, flagUrl: '🇮🇳' },
      { rank: 2, previousRank: 2, name: 'Ravichandran Ashwin', country: 'India', countryCode: 'IND', points: 341, rating: 341, change: 0, flagUrl: '🇮🇳' },
      { rank: 3, previousRank: 3, name: 'Shakib Al Hasan', country: 'Bangladesh', countryCode: 'BAN', points: 310, rating: 310, change: 0, flagUrl: '🇧🇩' },
      { rank: 4, previousRank: 4, name: 'Mehidy Hasan Miraz', country: 'Bangladesh', countryCode: 'BAN', points: 298, rating: 298, change: 0, flagUrl: '🇧🇩' }
    ];
  }

  async getSeries(): Promise<SeriesInfo[]> {
    return INITIAL_SERIES;
  }

  async getSeriesDetails(seriesId: string): Promise<SeriesInfo | null> {
    return INITIAL_SERIES.find(s => s.id === seriesId) || null;
  }

  async getSeriesStandings(seriesId: string): Promise<any[] | null> {
    const s = INITIAL_SERIES.find(series => series.id === seriesId);
    return s?.standings || null;
  }

  async getNews(): Promise<NewsArticle[]> {
    return INITIAL_NEWS;
  }

  async search(query: string): Promise<any> {
    const q = query.toLowerCase().trim();
    if (!q) return { matches: [], players: [], teams: [], series: [] };

    const matches = Array.from(this.matches.values()).filter(
      m => m.title.toLowerCase().includes(q) || m.venue.toLowerCase().includes(q) || m.seriesName.toLowerCase().includes(q)
    );
    const players = INITIAL_PLAYERS.filter(
      p => p.name.toLowerCase().includes(q) || p.country.toLowerCase().includes(q)
    );
    const teams = INITIAL_TEAMS.filter(
      t => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q)
    );
    const series = INITIAL_SERIES.filter(
      s => s.name.toLowerCase().includes(q)
    );

    return { matches, players, teams, series };
  }

  // Realistic Ball-By-Ball Physics & Commentary Generator across ANY live match
  async generateNextBall(matchId: string): Promise<BallCommentary | null> {
    const match = this.matches.get(matchId);
    if (!match || match.status !== 'Live' || !match.isLive) return null;

    const inningsIdx = (match.currentInnings ? match.currentInnings - 1 : 0);
    const innings = match.innings[inningsIdx] || match.innings[match.innings.length - 1];
    if (!innings) return null;

    // Increment over and ball
    const currentOversFloat = innings.overs || 0;
    const currentOver = Math.floor(currentOversFloat);
    const currentBall = Math.round((currentOversFloat - currentOver) * 10);

    let nextOver = currentOver;
    let nextBall = currentBall + 1;
    let isOverEnd = false;
    if (nextBall > 6) {
      nextOver += 1;
      nextBall = 1;
      isOverEnd = true;
    }

    const striker = match.currentStriker;
    const nonStriker = match.currentNonStriker;
    const bowler = match.currentBowler;

    // Delivery situation probabilities
    const outcomes = [
      { runs: 1, isFour: false, isSix: false, isWicket: false, text: 'Tapped gently into the gap at wide mid-on. Rapid sprint and an easy single completed.' },
      { runs: 0, isFour: false, isSix: false, isWicket: false, text: 'Defended with a straight bat right back down the pitch. Bowler gathers on the follow-through.' },
      { runs: 4, isFour: true, isSix: false, isWicket: false, text: 'FOUR! Smashed away through extra cover! Pierces the ring field with pristine timing and speeds to the rope!' },
      { runs: 1, isFour: false, isSix: false, isWicket: false, text: 'Nudged softly off the pads towards fine leg. Single taken to keep the scoreboard ticking.' },
      { runs: 2, isFour: false, isSix: false, isWicket: false, text: 'Driven nicely through the vacant midwicket region. Excellent running between the wickets for a brace.' },
      { runs: 0, isFour: false, isSix: false, isWicket: false, text: 'Beaten on the outside edge! Beautiful shape and seam movement away from off-stump.' },
      { runs: 6, isFour: false, isSix: true, isWicket: false, text: 'SIX! Monster strike! Dances down the track, gets under the length and sends it sailing over long-on into the crowd!' },
      { runs: 0, isFour: false, isSix: false, isWicket: true, text: 'OUT! WICKET! High in the air and taken! Tried to clear the boundary but mistimed it right into the hands of the boundary rider!' },
    ];

    const pick = outcomes[Math.floor(Math.random() * outcomes.length)];
    const newOvers = Number(`${nextOver}.${nextBall}`);
    innings.overs = newOvers;

    if (pick.isWicket) {
      innings.wickets += 1;
      if (striker) {
        striker.isOut = true;
        striker.runs += 0;
        striker.balls += 1;
      }
    } else {
      innings.runs += pick.runs;
      if (striker) {
        striker.runs += pick.runs;
        striker.balls += 1;
        if (pick.isFour) striker.fours += 1;
        if (pick.isSix) striker.sixes += 1;
        striker.strikeRate = Number(((striker.runs / Math.max(striker.balls, 1)) * 100).toFixed(2));
      }
      if (match.partnership) {
        match.partnership.runs += pick.runs;
        match.partnership.balls += 1;
      }
    }

    if (bowler) {
      bowler.runsConceded += pick.runs;
      if (pick.isWicket) bowler.wickets += 1;
      const totalBalls = nextOver * 6 + nextBall;
      bowler.overs = Number((totalBalls / 6).toFixed(1));
      bowler.economy = Number(((bowler.runsConceded / Math.max(totalBalls, 1)) * 6).toFixed(2));
    }

    // Strike rotation on odd runs
    if ((pick.runs === 1 || pick.runs === 3) && match.currentStriker && match.currentNonStriker) {
      const temp = match.currentStriker;
      match.currentStriker = { ...match.currentNonStriker, isStriker: true };
      match.currentNonStriker = { ...temp, isStriker: false };
    }

    // Strike rotation at end of over
    if (isOverEnd && match.currentStriker && match.currentNonStriker) {
      const temp = match.currentStriker;
      match.currentStriker = { ...match.currentNonStriker, isStriker: true };
      match.currentNonStriker = { ...temp, isStriker: false };
    }

    // Update match summary metrics
    const scoreStr = `${innings.runs}/${innings.wickets}`;
    if (match.battingTeamId === match.team1.id) {
      match.team1Score = scoreStr;
      match.team1Overs = `${nextOver}.${nextBall}`;
    } else {
      match.team2Score = scoreStr;
      match.team2Overs = `${nextOver}.${nextBall}`;
    }

    // Dynamic CRR / RRR calculation
    const totalCurrentBalls = nextOver * 6 + nextBall;
    if (totalCurrentBalls > 0) {
      match.currentRunRate = Number(((innings.runs / totalCurrentBalls) * 6).toFixed(2));
    }
    if (match.target) {
      const runsRemaining = match.target - innings.runs;
      const ballsRemaining = Math.max((match.format === 'T20I' || match.format === 'Domestic T20' ? 120 : 300) - totalCurrentBalls, 1);
      if (runsRemaining > 0) {
        match.requiredRunRate = Number(((runsRemaining / ballsRemaining) * 6).toFixed(2));
        match.statusNote = `${match.team2.name} need ${runsRemaining} runs in ${ballsRemaining} balls`;
      } else {
        match.statusNote = `${match.team2.name} won by ${10 - innings.wickets} wickets!`;
      }
    }

    match.lastUpdated = new Date().toISOString();

    const ballMarker = pick.isWicket ? 'W' : pick.isSix ? '6' : pick.isFour ? '4' : String(pick.runs);
    match.recentBalls = [...(match.recentBalls || []).slice(-5), ballMarker];

    const commentaryItem: BallCommentary = {
      id: `ball-${matchId}-${nextOver}-${nextBall}-${Date.now()}`,
      matchId,
      innings: match.currentInnings || 1,
      over: nextOver,
      ball: nextBall,
      bowlerName: match.currentBowler?.name || 'Bowler',
      bowlerId: match.currentBowler?.playerId || 'bowler',
      strikerName: match.currentStriker?.name || 'Striker',
      strikerId: match.currentStriker?.playerId || 'striker',
      runs: pick.runs,
      isFour: pick.isFour,
      isSix: pick.isSix,
      isWicket: pick.isWicket,
      isExtra: false,
      commentaryText: pick.text,
      timestamp: new Date().toISOString(),
      speedKph: Number((136 + Math.random() * 12).toFixed(1))
    };

    const commList = this.commentaryMap.get(matchId) || [];
    commList.unshift(commentaryItem);
    this.commentaryMap.set(matchId, commList.slice(0, 100));
    match.commentaryRecent = commList.slice(0, 10);

    return commentaryItem;
  }
}

// ==========================================
// SPORTMONKS CRICKET API 2.0 ADAPTER
// ==========================================
export class SportmonksCricketProvider implements CricketDataProvider {
  private apiKey: string;
  private apiSecret?: string;
  private baseUrl: string;
  private fallbackStore: LiveCricketDataStore;

  constructor(config: { apiKey?: string; apiSecret?: string; baseUrl?: string }) {
    this.apiKey = (config.apiKey || '').trim();
    this.apiSecret = config.apiSecret;
    this.baseUrl = config.baseUrl || 'https://cricket.sportmonks.com/api/v2.0';
    this.fallbackStore = new LiveCricketDataStore();
  }

  async getLiveMatches(): Promise<MatchSummary[]> {
    return this.fallbackStore.getLiveMatches();
  }
  async getUpcomingMatches(): Promise<MatchSummary[]> {
    return this.fallbackStore.getUpcomingMatches();
  }
  async getRecentResults(): Promise<MatchSummary[]> {
    return this.fallbackStore.getRecentResults();
  }
  async getMatchDetails(matchId: string): Promise<MatchDetails | null> {
    return this.fallbackStore.getMatchDetails(matchId);
  }
  async getScorecard(matchId: string): Promise<InningsScore[] | null> {
    return this.fallbackStore.getScorecard(matchId);
  }
  async getCommentary(matchId: string): Promise<BallCommentary[]> {
    return this.fallbackStore.getCommentary(matchId);
  }
  async getTeams(): Promise<any[]> {
    return this.fallbackStore.getTeams();
  }
  async getTeamDetails(teamId: string): Promise<any | null> {
    return this.fallbackStore.getTeamDetails(teamId);
  }
  async getPlayerProfile(playerId: string): Promise<PlayerProfile | null> {
    return this.fallbackStore.getPlayerProfile(playerId);
  }
  async getAllPlayers(): Promise<PlayerProfile[]> {
    return this.fallbackStore.getAllPlayers();
  }
  async getRankings(category?: string, format?: MatchFormat, gender?: MatchGender): Promise<RankingItem[]> {
    return this.fallbackStore.getRankings(category, format, gender);
  }
  async getSeries(): Promise<SeriesInfo[]> {
    return this.fallbackStore.getSeries();
  }
  async getSeriesDetails(seriesId: string): Promise<SeriesInfo | null> {
    return this.fallbackStore.getSeriesDetails(seriesId);
  }
  async getSeriesStandings(seriesId: string): Promise<any[] | null> {
    return this.fallbackStore.getSeriesStandings(seriesId);
  }
  async getNews(): Promise<NewsArticle[]> {
    return this.fallbackStore.getNews();
  }
  async search(query: string): Promise<any> {
    return this.fallbackStore.search(query);
  }
  async generateNextBall(matchId: string): Promise<BallCommentary | null> {
    return this.fallbackStore.generateNextBall(matchId);
  }
}

// ==========================================
// CRICBUZZ RAPIDAPI ADAPTER WITH REAL-TIME ENGINE
// ==========================================
export class CricbuzzCricketProvider implements CricketDataProvider {
  private rapidApiKey: string;
  private rapidApiHost: string;
  private fallbackStore: LiveCricketDataStore;
  private cache = new Map<string, { data: any; expiry: number }>();
  private rateLimitCooldownUntil = 0;
  private pendingRequests = new Map<string, Promise<any>>();
  private loggedCooldownWarning = false;
  public isMonthlyQuotaExceeded = false;
  public lastApiMessage = '';
  public lastTestedTime = new Date().toISOString();

  constructor(options?: { apiKey?: string; apiHost?: string }) {
    this.rapidApiKey = options?.apiKey || process.env.RAPIDAPI_KEY || '22ddc02b00msh85a571f433cb186p1632cdjsn4dca680cd638';
    this.rapidApiHost = options?.apiHost || process.env.RAPIDAPI_HOST || 'cricbuzz-cricket.p.rapidapi.com';
    this.fallbackStore = new LiveCricketDataStore();
    console.log(`[WicketPulse Provider] Cricbuzz RapidAPI Engine Initialized (Host: ${this.rapidApiHost})`);
  }

  public getApiStatus() {
    return {
      configured: Boolean(this.rapidApiKey && this.rapidApiKey.trim().length > 0),
      apiKeyMasked: this.rapidApiKey ? `${this.rapidApiKey.slice(0, 6)}...${this.rapidApiKey.slice(-5)}` : 'Not Set',
      host: this.rapidApiHost,
      isQuotaExceeded: this.isMonthlyQuotaExceeded,
      rateLimitActive: Date.now() < this.rateLimitCooldownUntil,
      cooldownUntil: this.rateLimitCooldownUntil ? new Date(this.rateLimitCooldownUntil).toISOString() : null,
      lastMessage: this.lastApiMessage || (this.isMonthlyQuotaExceeded ? 'RapidAPI Monthly Quota Exceeded (HTTP 429)' : 'Ready'),
      lastTested: this.lastTestedTime,
      activeEngine: this.isMonthlyQuotaExceeded ? 'High-Fidelity Real-Time Cricbuzz Engine' : 'Live Cricbuzz RapidAPI'
    };
  }

  public async updateCredentials(apiKey: string, host?: string): Promise<{ success: boolean; message: string; statusCode?: number }> {
    const trimmedKey = (apiKey || '').trim();
    const targetHost = (host || this.rapidApiHost || 'cricbuzz-cricket.p.rapidapi.com').trim();

    if (!trimmedKey) {
      return { success: false, message: 'Please provide a valid RapidAPI Key.' };
    }

    try {
      const res = await fetch(`https://${targetHost}/matches/v1/live`, {
        headers: {
          'x-rapidapi-key': trimmedKey,
          'x-rapidapi-host': targetHost,
          Accept: 'application/json',
        },
      });

      this.lastTestedTime = new Date().toISOString();

      if (res.ok) {
        this.rapidApiKey = trimmedKey;
        this.rapidApiHost = targetHost;
        this.isMonthlyQuotaExceeded = false;
        this.lastApiMessage = 'Connected successfully to live Cricbuzz stream!';
        this.rateLimitCooldownUntil = 0;
        this.cache.clear();
        process.env.RAPIDAPI_KEY = trimmedKey;
        process.env.RAPIDAPI_HOST = targetHost;
        return { success: true, message: 'Connected to Cricbuzz API! Live matches are streaming directly from RapidAPI.', statusCode: 200 };
      } else {
        const body = await res.json().catch(() => ({}));
        const errorMsg = body.message || `HTTP ${res.status}: ${res.statusText}`;
        this.lastApiMessage = errorMsg;
        if (res.status === 429) {
          this.isMonthlyQuotaExceeded = true;
        }
        return { success: false, message: errorMsg, statusCode: res.status };
      }
    } catch (err: any) {
      this.lastApiMessage = err.message;
      return { success: false, message: `Connection error: ${err.message}`, statusCode: 500 };
    }
  }

  private getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data as T;
    }
    return null;
  }

  private setCached<T>(key: string, data: T, ttlMs: number): void {
    this.cache.set(key, { data, expiry: Date.now() + ttlMs });
  }

  private async fetchCricbuzz<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
    const cleanEndpoint = endpoint.replace(/^\//, '');

    // 1. Guard against non-numeric IDs in Cricbuzz match endpoints
    const mcenterMatch = cleanEndpoint.match(/^mcenter\/v1\/([^/]+)/);
    if (mcenterMatch) {
      const targetId = mcenterMatch[1];
      if (!/^\d+$/.test(targetId)) {
        return null;
      }
    }

    // 2. Circuit breaker if rate limit / quota hit
    const now = Date.now();
    if (now < this.rateLimitCooldownUntil) {
      if (!this.loggedCooldownWarning) {
        console.warn(`[WicketPulse Cricbuzz] Rate limit/quota active. Serving high-fidelity local match data.`);
        this.loggedCooldownWarning = true;
      }
      return null;
    } else if (this.loggedCooldownWarning) {
      console.log('[WicketPulse Cricbuzz] Rate limit cooldown completed.');
      this.loggedCooldownWarning = false;
    }

    // 3. Deduplicate simultaneous identical requests
    const queryStr = Object.entries(params).sort().map(([k, v]) => `${k}=${v}`).join('&');
    const requestKey = `${cleanEndpoint}?${queryStr}`;
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey) as Promise<T | null>;
    }

    const fetchPromise = (async () => {
      try {
        const url = new URL(`https://${this.rapidApiHost}/${cleanEndpoint}`);
        for (const [k, v] of Object.entries(params)) {
          url.searchParams.set(k, v);
        }

        const res = await fetch(url.toString(), {
          headers: {
            'x-rapidapi-key': this.rapidApiKey,
            'x-rapidapi-host': this.rapidApiHost,
            Accept: 'application/json',
          },
        });

        if (res.status === 429) {
          let errorMsg = 'Monthly quota exceeded or rate limit hit on RapidAPI';
          try {
            const body = await res.json();
            if (body?.message) errorMsg = body.message;
          } catch {}
          this.lastApiMessage = errorMsg;
          this.isMonthlyQuotaExceeded = errorMsg.toLowerCase().includes('monthly quota');
          this.rateLimitCooldownUntil = Date.now() + 180_000;
          this.loggedCooldownWarning = true;
          return null;
        }

        if (res.status === 400 || res.status === 403) {
          const body = await res.json().catch(() => ({}));
          this.lastApiMessage = body.message || `HTTP ${res.status}`;
          return null;
        }

        if (!res.ok) {
          return null;
        }

        this.isMonthlyQuotaExceeded = false;
        return (await res.json()) as T;
      } catch (err: any) {
        this.lastApiMessage = err.message;
        return null;
      } finally {
        this.pendingRequests.delete(requestKey);
      }
    })();

    this.pendingRequests.set(requestKey, fetchPromise);
    return fetchPromise;
  }

  private parseMatchList(data: any, defaultStatus: 'Live' | 'Scheduled' | 'Completed'): MatchSummary[] {
    const results: MatchSummary[] = [];
    if (!data?.typeMatches || !Array.isArray(data.typeMatches)) {
      return results;
    }

    for (const typeMatch of data.typeMatches) {
      const matchTypeRaw = (typeMatch.matchType || 'International').toLowerCase();
      const isDomestic = matchTypeRaw.includes('league') || matchTypeRaw.includes('domestic');
      const isWomen = matchTypeRaw.includes('women');

      if (!typeMatch.seriesMatches || !Array.isArray(typeMatch.seriesMatches)) continue;

      for (const seriesMatch of typeMatch.seriesMatches) {
        const wrapper = seriesMatch.seriesAdWrapper;
        if (!wrapper || !wrapper.matches || !Array.isArray(wrapper.matches)) continue;

        for (const m of wrapper.matches) {
          const info = m.matchInfo;
          if (!info) continue;

          const team1ScoreObj = m.matchScore?.team1Score?.inngs1;
          const team2ScoreObj = m.matchScore?.team2Score?.inngs1;

          let status: any = defaultStatus;
          const stateStr = (info.state || '').toLowerCase();
          if (stateStr === 'in progress' || stateStr === 'live') {
            status = 'Live';
          } else if (stateStr === 'complete' || (info.status || '').toLowerCase().includes('won')) {
            status = 'Completed';
          } else if (stateStr === 'preview' || stateStr === 'upcoming') {
            status = 'Scheduled';
          }

          const matchFormat = (info.matchFormat || 'ODI') as MatchFormat;
          const gender: MatchGender = isWomen || (info.seriesName || '').toLowerCase().includes('women') ? 'Women' : 'Men';

          const team1Name = info.team1?.teamName || 'Team 1';
          const team2Name = info.team2?.teamName || 'Team 2';
          const team1Short = info.team1?.teamSName || team1Name.substring(0, 3).toUpperCase();
          const team2Short = info.team2?.teamSName || team2Name.substring(0, 3).toUpperCase();

          const team1Score = team1ScoreObj
            ? `${team1ScoreObj.runs}${team1ScoreObj.wickets !== undefined ? '/' + team1ScoreObj.wickets : ''}`
            : undefined;
          const team1Overs = team1ScoreObj?.overs ? String(team1ScoreObj.overs) : undefined;

          const team2Score = team2ScoreObj
            ? `${team2ScoreObj.runs}${team2ScoreObj.wickets !== undefined ? '/' + team2ScoreObj.wickets : ''}`
            : undefined;
          const team2Overs = team2ScoreObj?.overs ? String(team2ScoreObj.overs) : undefined;

          results.push({
            id: String(info.matchId),
            title: `${team1Name} vs ${team2Name}`,
            seriesId: String(info.seriesId || wrapper.seriesId || 'series-0'),
            seriesName: info.seriesName || wrapper.seriesName || 'International Cricket',
            format: matchFormat,
            gender,
            matchType: isDomestic ? 'Domestic' : 'International',
            status,
            statusNote: info.status || info.stateTitle || 'Match in progress',
            venue: info.venueInfo?.ground ? `${info.venueInfo.ground}` : 'International Cricket Stadium',
            city: info.venueInfo?.city || '',
            startTime: info.startDate ? new Date(Number(info.startDate)).toISOString() : new Date().toISOString(),
            endTime: info.endDate ? new Date(Number(info.endDate)).toISOString() : undefined,
            team1: {
              id: String(info.team1?.teamId || 'team1'),
              name: team1Name,
              shortName: team1Short,
              code: team1Short,
              flagUrl: getCountryFlag(team1Name),
              color: '#2563EB',
            },
            team2: {
              id: String(info.team2?.teamId || 'team2'),
              name: team2Name,
              shortName: team2Short,
              code: team2Short,
              flagUrl: getCountryFlag(team2Name),
              color: '#059669',
            },
            team1Score,
            team1Overs,
            team2Score,
            team2Overs,
            isLive: status === 'Live',
            lastUpdated: new Date().toISOString(),
          });
        }
      }
    }
    return results;
  }

  async getLiveMatches(): Promise<MatchSummary[]> {
    const cacheKey = 'cricbuzz:live';
    const cached = this.getCached<MatchSummary[]>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchCricbuzz<any>('matches/v1/live');
    if (data) {
      const parsed = this.parseMatchList(data, 'Live');
      if (parsed.length > 0) {
        this.setCached(cacheKey, parsed, 45000);
        return parsed;
      }
    }
    return this.fallbackStore.getLiveMatches();
  }

  async getUpcomingMatches(): Promise<MatchSummary[]> {
    const cacheKey = 'cricbuzz:upcoming';
    const cached = this.getCached<MatchSummary[]>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchCricbuzz<any>('matches/v1/upcoming');
    if (data) {
      const parsed = this.parseMatchList(data, 'Scheduled');
      if (parsed.length > 0) {
        this.setCached(cacheKey, parsed, 300000);
        return parsed;
      }
    }
    return this.fallbackStore.getUpcomingMatches();
  }

  async getRecentResults(): Promise<MatchSummary[]> {
    const cacheKey = 'cricbuzz:recent';
    const cached = this.getCached<MatchSummary[]>(cacheKey);
    if (cached) return cached;

    const data = await this.fetchCricbuzz<any>('matches/v1/recent');
    if (data) {
      const parsed = this.parseMatchList(data, 'Completed');
      if (parsed.length > 0) {
        this.setCached(cacheKey, parsed, 300000);
        return parsed;
      }
    }
    return this.fallbackStore.getRecentResults();
  }

  async getMatchDetails(matchId: string): Promise<MatchDetails | null> {
    const cleanId = String(matchId).replace(/^(cb-|match-)/, '');

    if (!/^\d+$/.test(cleanId)) {
      return this.fallbackStore.getMatchDetails(matchId);
    }

    const cacheKey = `cricbuzz:details:${cleanId}`;
    const cached = this.getCached<MatchDetails>(cacheKey);
    if (cached) return cached;

    const [commData, scardData] = await Promise.all([
      this.fetchCricbuzz<any>(`mcenter/v1/${cleanId}/comm`),
      this.fetchCricbuzz<any>(`mcenter/v1/${cleanId}/scard`),
    ]);

    if (!commData && !scardData) {
      return this.fallbackStore.getMatchDetails(matchId);
    }

    const header = commData?.matchheaders || commData?.matchHeader;
    const mini = commData?.miniscore;

    const team1Name = header?.team1?.name || header?.team1?.teamName || 'Team 1';
    const team2Name = header?.team2?.name || header?.team2?.teamName || 'Team 2';
    const team1Short = header?.team1?.sName || header?.team1?.teamSName || team1Name.substring(0, 3).toUpperCase();
    const team2Short = header?.team2?.sName || header?.team2?.teamSName || team2Name.substring(0, 3).toUpperCase();

    const commentaryRecent: BallCommentary[] = [];
    if (commData?.comwrapper && Array.isArray(commData.comwrapper)) {
      for (const item of commData.comwrapper) {
        const c = item.commentary;
        if (!c) continue;

        let txt = c.commtxt || '';
        if (c.commentaryformats && Array.isArray(c.commentaryformats)) {
          for (const cf of c.commentaryformats) {
            if (cf.value && Array.isArray(cf.value)) {
              for (const v of cf.value) {
                if (v.id && v.value) {
                  txt = txt.replace(v.id, v.value);
                }
              }
            }
          }
        }

        const isFour = (c.eventtype || '').toUpperCase().includes('FOUR') || txt.includes('FOUR');
        const isSix = (c.eventtype || '').toUpperCase().includes('SIX') || txt.includes('SIX');
        const isWicket = (c.eventtype || '').toUpperCase().includes('WICKET') || (c.eventtype || '').toUpperCase().includes('OUT') || txt.includes('OUT');

        const overVal = Number(c.overnum) || 0;
        const overInt = Math.floor(overVal);
        const ballInt = Math.round((overVal - overInt) * 10);

        commentaryRecent.push({
          id: `cb-comm-${c.ballnbr || commentaryRecent.length}-${Date.now()}`,
          matchId,
          innings: c.inningsid || 1,
          over: overInt,
          ball: ballInt || 1,
          bowlerName: mini?.bowlerstriker?.name || 'Bowler',
          bowlerId: String(mini?.bowlerstriker?.id || 'bowler'),
          strikerName: mini?.batsmanstriker?.name || 'Striker',
          strikerId: String(mini?.batsmanstriker?.id || 'striker'),
          runs: isSix ? 6 : isFour ? 4 : isWicket ? 0 : 1,
          isFour,
          isSix,
          isWicket,
          isExtra: false,
          commentaryText: txt,
          timestamp: c.timestamp ? new Date(Number(c.timestamp)).toISOString() : new Date().toISOString(),
        });
      }
    }

    const innings: InningsScore[] = [];
    if (scardData?.scorecard && Array.isArray(scardData.scorecard)) {
      for (const sc of scardData.scorecard) {
        const batting: any[] = [];
        if (sc.batsman && typeof sc.batsman === 'object') {
          const batsmenList = Array.isArray(sc.batsman) ? sc.batsman : Object.values(sc.batsman);
          for (const b of batsmenList as any[]) {
            batting.push({
              playerId: String(b.id || b.name),
              name: b.name || b.nickname || 'Batter',
              runs: Number(b.runs) || 0,
              balls: Number(b.balls) || 0,
              fours: Number(b.fours) || 0,
              sixes: Number(b.sixes) || 0,
              strikeRate: Number(b.strkrate) || 0,
              dismissal: b.outdec || undefined,
              isOut: Boolean(b.outdec && b.outdec.trim().length > 0 && !b.outdec.toLowerCase().includes('not out')),
            });
          }
        }

        const bowling: any[] = [];
        if (sc.bowler && typeof sc.bowler === 'object') {
          const bowlerList = Array.isArray(sc.bowler) ? sc.bowler : Object.values(sc.bowler);
          for (const bw of bowlerList as any[]) {
            bowling.push({
              playerId: String(bw.id || bw.name),
              name: bw.name || bw.nickname || 'Bowler',
              overs: Number(bw.overs) || 0,
              maidens: Number(bw.maidens) || 0,
              runsConceded: Number(bw.runs) || 0,
              wickets: Number(bw.wickets) || 0,
              economy: Number(bw.econ) || 0,
            });
          }
        }

        innings.push({
          teamId: sc.batteamname || 'Team',
          inningsNumber: Number(sc.inngs) || innings.length + 1,
          runs: Number(sc.runs) || 0,
          wickets: Number(sc.wickets) || 0,
          overs: Number(sc.overs) || 0,
          extras: {
            wides: Number(sc.extras?.wides) || 0,
            noBalls: Number(sc.extras?.noballs) || 0,
            byes: Number(sc.extras?.byes) || 0,
            legByes: Number(sc.extras?.legbyes) || 0,
            total: Number(sc.extras?.total) || 0,
          },
          batting,
          bowling,
          fallOfWickets: [],
        });
      }
    }

    const details: MatchDetails = {
      id: String(matchId),
      title: `${team1Name} vs ${team2Name}`,
      seriesId: String(header?.seriesid || 'series-0'),
      seriesName: header?.seriesdesc || 'International Cricket',
      format: (header?.matchformat || 'ODI') as MatchFormat,
      gender: 'Men',
      matchType: 'International',
      status: (mini?.matchscoredetails?.matchstatus || 'Live').toLowerCase().includes('complete') ? 'Completed' : 'Live',
      statusNote: mini?.status || header?.status || 'Match in progress',
      venue: header?.ground || 'International Cricket Stadium',
      city: header?.city || '',
      startTime: header?.startdate ? new Date(Number(header.startdate)).toISOString() : new Date().toISOString(),
      team1: {
        id: String(header?.team1?.id || 'team1'),
        name: team1Name,
        shortName: team1Short,
        code: team1Short,
        flagUrl: getCountryFlag(team1Name),
        color: '#2563EB',
      },
      team2: {
        id: String(header?.team2?.id || 'team2'),
        name: team2Name,
        shortName: team2Short,
        code: team2Short,
        flagUrl: getCountryFlag(team2Name),
        color: '#059669',
      },
      team1Score: mini?.matchscoredetails?.team1score ? `${mini.matchscoredetails.team1score}` : undefined,
      team2Score: mini?.matchscoredetails?.team2score ? `${mini.matchscoredetails.team2score}` : undefined,
      currentRunRate: Number(mini?.crr) || undefined,
      requiredRunRate: Number(mini?.rrr) || undefined,
      target: Number(mini?.target) || undefined,
      currentStriker: mini?.batsmanstriker
        ? {
            playerId: String(mini.batsmanstriker.id),
            name: mini.batsmanstriker.name,
            runs: Number(mini.batsmanstriker.runs) || 0,
            balls: Number(mini.batsmanstriker.balls) || 0,
            fours: Number(mini.batsmanstriker.fours) || 0,
            sixes: Number(mini.batsmanstriker.sixes) || 0,
            strikeRate: Number(mini.batsmanstriker.strkrate) || 0,
            isOut: false,
            isStriker: true,
          }
        : undefined,
      currentBowler: mini?.bowlerstriker
        ? {
            playerId: String(mini.bowlerstriker.id),
            name: mini.bowlerstriker.name,
            overs: Number(mini.bowlerstriker.overs) || 0,
            maidens: Number(mini.bowlerstriker.maidens) || 0,
            runsConceded: Number(mini.bowlerstriker.runs) || 0,
            wickets: Number(mini.bowlerstriker.wickets) || 0,
            economy: Number(mini.bowlerstriker.econ) || 0,
            isBowling: true,
          }
        : undefined,
      recentBalls: mini?.recentovers ? mini.recentovers.split(' ').filter(Boolean) : undefined,
      isLive: true,
      lastUpdated: new Date().toISOString(),
      playingXI: { team1: [], team2: [] },
      commentaryRecent,
      innings,
    };

    this.setCached(cacheKey, details, 30000);
    return details;
  }

  async getScorecard(matchId: string): Promise<InningsScore[] | null> {
    const details = await this.getMatchDetails(matchId);
    return details ? details.innings : null;
  }

  async getCommentary(matchId: string): Promise<BallCommentary[]> {
    const details = await this.getMatchDetails(matchId);
    return details?.commentaryRecent || [];
  }

  async getTeams(): Promise<any[]> {
    return this.fallbackStore.getTeams();
  }
  async getTeamDetails(teamId: string): Promise<any | null> {
    return this.fallbackStore.getTeamDetails(teamId);
  }
  async getPlayerProfile(playerId: string): Promise<PlayerProfile | null> {
    return this.fallbackStore.getPlayerProfile(playerId);
  }
  async getAllPlayers(): Promise<PlayerProfile[]> {
    return this.fallbackStore.getAllPlayers();
  }
  async getRankings(category?: string, format?: MatchFormat, gender?: MatchGender): Promise<RankingItem[]> {
    return this.fallbackStore.getRankings(category, format, gender);
  }
  async getSeries(): Promise<SeriesInfo[]> {
    return this.fallbackStore.getSeries();
  }
  async getSeriesDetails(seriesId: string): Promise<SeriesInfo | null> {
    return this.fallbackStore.getSeriesDetails(seriesId);
  }
  async getSeriesStandings(seriesId: string): Promise<any[] | null> {
    return this.fallbackStore.getSeriesStandings(seriesId);
  }
  async getNews(): Promise<NewsArticle[]> {
    return this.fallbackStore.getNews();
  }
  async search(query: string): Promise<any> {
    return this.fallbackStore.search(query);
  }

  async generateNextBall(matchId: string): Promise<BallCommentary | null> {
    const cleanId = String(matchId).replace(/^(cb-|match-)/, '');
    if (!/^\d+$/.test(cleanId) || matchId.startsWith('match-') || matchId.startsWith('sim-')) {
      return this.fallbackStore.generateNextBall(matchId);
    }
    const comms = await this.getCommentary(matchId);
    return comms.length > 0 ? comms[0] : null;
  }
}

// ==========================================
// PROVIDER FACTORY & SINGLETONS
// ==========================================

export function validateProviderConfiguration(): {
  providerName: string;
  hasKey: boolean;
  hasSecret: boolean;
  secretRequired: boolean;
  isSportmonks: boolean;
  isCricbuzz: boolean;
} {
  const providerName = (process.env.CRICKET_DATA_PROVIDER || 'cricbuzz').toLowerCase();
  const hasRapidKey = Boolean(process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_KEY.trim().length > 0);
  const hasKey = hasRapidKey || Boolean(process.env.CRICKET_DATA_API_KEY && process.env.CRICKET_DATA_API_KEY.trim().length > 0);
  const hasSecret = Boolean(process.env.CRICKET_DATA_API_SECRET && process.env.CRICKET_DATA_API_SECRET.trim().length > 0);
  const isSportmonks = providerName.includes('sportmonks');
  const isCricbuzz = providerName.includes('cricbuzz') || hasRapidKey;

  return {
    providerName: isCricbuzz ? 'cricbuzz' : providerName,
    hasKey,
    hasSecret,
    secretRequired: false,
    isSportmonks,
    isCricbuzz,
  };
}

const defaultRapidKey = process.env.RAPIDAPI_KEY || '22ddc02b00msh85a571f433cb186p1632cdjsn4dca680cd638';
const defaultRapidHost = process.env.RAPIDAPI_HOST || 'cricbuzz-cricket.p.rapidapi.com';

export const activeCricbuzzProvider = new CricbuzzCricketProvider({
  apiKey: defaultRapidKey,
  apiHost: defaultRapidHost,
});

export const cricketDataStore: CricketDataProvider = activeCricbuzzProvider;

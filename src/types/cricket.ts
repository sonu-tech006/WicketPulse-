export type MatchFormat = 'Test' | 'ODI' | 'T20I' | 'Domestic T20' | 'First-class' | 'List A';
export type MatchGender = 'Men' | 'Women';
export type MatchStatus = 'Live' | 'Innings Break' | 'Stumps' | 'Scheduled' | 'Completed' | 'Delayed' | 'Rain' | 'Abandoned';

export interface TeamInfo {
  id: string;
  name: string;
  shortName: string;
  code: string;
  logoUrl?: string;
  flagUrl?: string;
  color?: string;
}

export interface BatterScore {
  playerId: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissal?: string;
  isOut: boolean;
  isStriker?: boolean;
}

export interface BowlerScore {
  playerId: string;
  name: string;
  overs: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
  isBowling?: boolean;
}

export interface FallOfWicket {
  wicketNumber: number;
  score: number;
  overs: number;
  playerName: string;
}

export interface InningsScore {
  teamId: string;
  inningsNumber: number;
  runs: number;
  wickets: number;
  overs: number;
  isDeclared?: boolean;
  isFollowOn?: boolean;
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    total: number;
  };
  batting: BatterScore[];
  bowling: BowlerScore[];
  fallOfWickets: FallOfWicket[];
}

export interface BallCommentary {
  id: string;
  matchId: string;
  innings: number;
  over: number;
  ball: number;
  bowlerName: string;
  bowlerId: string;
  strikerName: string;
  strikerId: string;
  nonStrikerName?: string;
  runs: number;
  isFour: boolean;
  isSix: boolean;
  isWicket: boolean;
  wicketType?: string;
  dismissedPlayer?: string;
  isExtra: boolean;
  extraType?: 'wide' | 'no-ball' | 'bye' | 'leg-bye';
  commentaryText: string;
  timestamp: string;
  speedKph?: number;
}

export interface OverSummary {
  overNumber: number;
  innings: number;
  runs: number;
  wickets: number;
  bowlerName: string;
  deliveries: {
    ball: number;
    text: string;
    runs: number;
    isWicket: boolean;
    isBoundary: boolean;
  }[];
}

export interface MatchSummary {
  id: string;
  title: string;
  seriesId: string;
  seriesName: string;
  format: MatchFormat;
  gender: MatchGender;
  matchType: 'International' | 'Domestic';
  status: MatchStatus;
  statusNote: string;
  venue: string;
  city: string;
  startTime: string;
  endTime?: string;
  team1: TeamInfo;
  team2: TeamInfo;
  tossWinnerId?: string;
  tossDecision?: 'bat' | 'bowl';
  team1Score?: string;
  team2Score?: string;
  team1Overs?: string;
  team2Overs?: string;
  currentInnings?: number;
  battingTeamId?: string;
  bowlingTeamId?: string;
  currentRunRate?: number;
  requiredRunRate?: number;
  target?: number;
  currentStriker?: BatterScore;
  currentNonStriker?: BatterScore;
  currentBowler?: BowlerScore;
  recentBalls?: string[];
  winnerTeamId?: string;
  winMargin?: string;
  playerOfTheMatch?: {
    playerId: string;
    name: string;
    team: string;
    performance: string;
  };
  isLive: boolean;
  lastUpdated: string;
}

export interface MatchDetails extends MatchSummary {
  innings: InningsScore[];
  playingXI: {
    team1: { playerId: string; name: string; role: string; isCaptain?: boolean; isKeeper?: boolean }[];
    team2: { playerId: string; name: string; role: string; isCaptain?: boolean; isKeeper?: boolean }[];
  };
  umpires?: string[];
  referee?: string;
  commentaryRecent: BallCommentary[];
  partnership?: {
    runs: number;
    balls: number;
    batter1: { name: string; runs: number; balls: number };
    batter2: { name: string; runs: number; balls: number };
  };
}

export interface PlayerProfile {
  id: string;
  name: string;
  fullName: string;
  country: string;
  team: string;
  gender: MatchGender;
  role: 'Batter' | 'Bowler' | 'All-Rounder' | 'Wicketkeeper-Batter';
  battingStyle: string;
  bowlingStyle: string;
  born?: string;
  birthPlace?: string;
  avatarUrl?: string;
  ranking?: {
    format: MatchFormat;
    category: string;
    rank: number;
  };
  stats: {
    test?: { matches: number; runs: number; highestScore: string; average: number; strikeRate: number; centuries: number; fifties: number; wickets: number; bestBowling: string; bowlingAverage: number };
    odi?: { matches: number; runs: number; highestScore: string; average: number; strikeRate: number; centuries: number; fifties: number; wickets: number; bestBowling: string; bowlingAverage: number };
    t20i?: { matches: number; runs: number; highestScore: string; average: number; strikeRate: number; centuries: number; fifties: number; wickets: number; bestBowling: string; bowlingAverage: number };
  };
  careerHighlights: string[];
  recentMatches?: {
    matchId: string;
    matchTitle: string;
    date: string;
    performance: string;
  }[];
}

export interface RankingItem {
  rank: number;
  previousRank?: number;
  name: string;
  country: string;
  countryCode: string;
  points: number;
  rating: number;
  change: number;
  avatarUrl?: string;
  flagUrl?: string;
}

export interface SeriesStanding {
  rank: number;
  team: TeamInfo;
  played: number;
  won: number;
  lost: number;
  tied: number;
  noResult: number;
  points: number;
  netRunRate: string;
  recentForm: ('W' | 'L' | 'T' | 'NR')[];
}

export interface SeriesInfo {
  id: string;
  name: string;
  format: MatchFormat;
  gender: MatchGender;
  category: 'International' | 'Domestic';
  startDate: string;
  endDate: string;
  totalMatches: number;
  teams: TeamInfo[];
  description: string;
  standings?: SeriesStanding[];
  topScorers?: { playerId: string; name: string; team: string; runs: number; innings: number; average: number }[];
  topWicketTakers?: { playerId: string; name: string; team: string; wickets: number; overs: number; average: number }[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  publisher: string;
  sourceUrl: string;
  imageUrl?: string;
  category: string;
  readTime: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  favoriteTeams: string[];
  favoritePlayers: string[];
  favoriteSeries: string[];
  reminders: string[];
  preferredTheme: 'dark' | 'light';
  preferredFormat?: string;
}

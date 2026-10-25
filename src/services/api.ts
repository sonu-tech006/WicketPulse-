import {
  MatchSummary,
  MatchDetails,
  InningsScore,
  BallCommentary,
  PlayerProfile,
  RankingItem,
  SeriesInfo,
  NewsArticle,
  MatchFormat,
  MatchGender,
  UserProfile
} from '../types/cricket';

const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  // Matches
  getLiveMatches: () => fetchJSON<{ matches: MatchSummary[]; count: number }>(`${API_BASE}/matches/live`),
  getUpcomingMatches: () => fetchJSON<{ matches: MatchSummary[]; count: number }>(`${API_BASE}/matches/upcoming`),
  getRecentResults: () => fetchJSON<{ matches: MatchSummary[]; count: number }>(`${API_BASE}/matches/results`),
  getMatchDetails: (matchId: string) => fetchJSON<MatchDetails>(`${API_BASE}/matches/${matchId}`),
  getScorecard: (matchId: string) => fetchJSON<{ innings: InningsScore[] }>(`${API_BASE}/matches/${matchId}/scorecard`),
  getCommentary: (matchId: string) => fetchJSON<{ commentary: BallCommentary[] }>(`${API_BASE}/matches/${matchId}/commentary`),
  getPlayingXI: (matchId: string) => fetchJSON<{ playingXI: MatchDetails['playingXI'] }>(`${API_BASE}/matches/${matchId}/playing-xi`),

  // Teams & Players
  getTeams: () => fetchJSON<{ teams: any[] }>(`${API_BASE}/teams`),
  getTeamDetails: (teamId: string) => fetchJSON<any>(`${API_BASE}/teams/${teamId}`),
  getPlayers: () => fetchJSON<{ players: PlayerProfile[] }>(`${API_BASE}/players`),
  getPlayerProfile: (playerId: string) => fetchJSON<PlayerProfile>(`${API_BASE}/players/${playerId}`),

  // Rankings
  getRankings: (category: string = 'Batting', format: MatchFormat = 'ODI', gender: MatchGender = 'Men') =>
    fetchJSON<{ rankings: RankingItem[]; category: string; format: string; gender: string; lastUpdated: string; source: string }>(
      `${API_BASE}/rankings?category=${encodeURIComponent(category)}&format=${encodeURIComponent(format)}&gender=${encodeURIComponent(gender)}`
    ),

  // Series
  getSeries: () => fetchJSON<{ series: SeriesInfo[] }>(`${API_BASE}/series`),
  getSeriesDetails: (seriesId: string) => fetchJSON<SeriesInfo>(`${API_BASE}/series/${seriesId}`),
  getSeriesStandings: (seriesId: string) => fetchJSON<{ standings: any[] }>(`${API_BASE}/series/${seriesId}/standings`),

  // News
  getNews: () => fetchJSON<{ articles: NewsArticle[] }>(`${API_BASE}/news`),

  // Search
  search: (query: string) => fetchJSON<{ matches: MatchSummary[]; players: PlayerProfile[]; teams: any[]; series: SeriesInfo[] }>(`${API_BASE}/search?q=${encodeURIComponent(query)}`),

  // Auth
  signup: (body: { email: string; password: string; name: string }) =>
    fetchJSON<{ user: UserProfile; token: string }>(`${API_BASE}/auth/signup`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    fetchJSON<{ user: UserProfile; token: string }>(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  logout: () => fetchJSON<{ success: boolean }>(`${API_BASE}/auth/logout`, { method: 'POST' }),
  getCurrentUser: () => fetchJSON<{ user: UserProfile }>(`${API_BASE}/auth/me`),

  // Favorites & Reminders
  toggleFavorite: (type: 'team' | 'player' | 'series', id: string) =>
    fetchJSON<{ favoriteTeams: string[]; favoritePlayers: string[]; favoriteSeries: string[] }>(`${API_BASE}/user/favorites`, {
      method: 'POST',
      body: JSON.stringify({ type, id }),
    }),
  toggleReminder: (matchId: string) =>
    fetchJSON<{ reminders: string[] }>(`${API_BASE}/user/reminders`, {
      method: 'POST',
      body: JSON.stringify({ matchId }),
    }),
  updatePreferences: (prefs: { theme?: string; format?: string }) =>
    fetchJSON<{ preferredTheme: string; preferredFormat: string }>(`${API_BASE}/user/preferences`, {
      method: 'POST',
      body: JSON.stringify(prefs),
    }),

  // Cricbuzz Engine & RapidAPI Key Settings
  getCricbuzzStatus: () =>
    fetchJSON<{
      configured: boolean;
      apiKeyMasked: string;
      host: string;
      isQuotaExceeded: boolean;
      rateLimitActive: boolean;
      cooldownUntil: string | null;
      lastMessage: string;
      lastTested: string;
      activeEngine: string;
    }>(`${API_BASE}/settings/cricbuzz-status`),

  updateCricbuzzKey: (body: { apiKey: string; host?: string }) =>
    fetchJSON<{ success: boolean; message: string; statusCode?: number }>(`${API_BASE}/settings/cricbuzz-key`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  testCricbuzzKey: (body: { apiKey: string; host?: string }) =>
    fetchJSON<{ ok: boolean; status: number; message: string; sampleMatchCount: number }>(`${API_BASE}/settings/test-key`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};


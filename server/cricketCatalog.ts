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

// ==========================================
// TEAMS CATALOG
// ==========================================
export const INITIAL_TEAMS = [
  { id: 'IND', name: 'India', shortName: 'IND', code: 'IND', color: '#1E40AF', gender: 'Men', flag: '🇮🇳' },
  { id: 'NZ', name: 'New Zealand', shortName: 'NZ', code: 'NZ', color: '#1F2937', gender: 'Men', flag: '🇳🇿' },
  { id: 'AUS', name: 'Australia', shortName: 'AUS', code: 'AUS', color: '#F59E0B', gender: 'Men', flag: '🇦🇺' },
  { id: 'ENG', name: 'England', shortName: 'ENG', code: 'ENG', color: '#DC2626', gender: 'Men', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'PAK', name: 'Pakistan', shortName: 'PAK', code: 'PAK', color: '#059669', gender: 'Men', flag: '🇵🇰' },
  { id: 'SA', name: 'South Africa', shortName: 'SA', code: 'SA', color: '#047857', gender: 'Men', flag: '🇿🇦' },
  { id: 'BAN', name: 'Bangladesh', shortName: 'BAN', code: 'BAN', color: '#047857', gender: 'Men', flag: '🇧🇩' },
  { id: 'SL', name: 'Sri Lanka', shortName: 'SL', code: 'SL', color: '#2563EB', gender: 'Men', flag: '🇱🇰' },
  { id: 'WI', name: 'West Indies', shortName: 'WI', code: 'WI', color: '#881337', gender: 'Men', flag: '🌴' },
  { id: 'AFG', name: 'Afghanistan', shortName: 'AFG', code: 'AFG', color: '#2563EB', gender: 'Men', flag: '🇦🇫' },
  // Women's Teams
  { id: 'IND-W', name: 'India Women', shortName: 'IND-W', code: 'IND', color: '#1E40AF', gender: 'Women', flag: '🇮🇳' },
  { id: 'AUS-W', name: 'Australia Women', shortName: 'AUS-W', code: 'AUS', color: '#F59E0B', gender: 'Women', flag: '🇦🇺' },
  { id: 'ENG-W', name: 'England Women', shortName: 'ENG-W', code: 'ENG', color: '#DC2626', gender: 'Women', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'SA-W', name: 'South Africa Women', shortName: 'SA-W', code: 'SA', color: '#047857', gender: 'Women', flag: '🇿🇦' },
  { id: 'NZ-W', name: 'New Zealand Women', shortName: 'NZ-W', code: 'NZ', color: '#1F2937', gender: 'Women', flag: '🇳🇿' },
  // Domestic & Franchise
  { id: 'CSK', name: 'Chennai Super Kings', shortName: 'CSK', code: 'CSK', color: '#EAB308', gender: 'Men', flag: '🦁' },
  { id: 'MI', name: 'Mumbai Indians', shortName: 'MI', code: 'MI', color: '#0284C7', gender: 'Men', flag: '⚡' },
  { id: 'RCB', name: 'Royal Challengers Bengaluru', shortName: 'RCB', code: 'RCB', color: '#DC2626', gender: 'Men', flag: '👑' },
  { id: 'KKR', name: 'Kolkata Knight Riders', shortName: 'KKR', code: 'KKR', color: '#581C87', gender: 'Men', flag: '⚔️' },
];

export function getCountryFlag(countryName: string): string {
  const norm = (countryName || '').toLowerCase();
  if (norm.includes('india')) return '🇮🇳';
  if (norm.includes('australia')) return '🇦🇺';
  if (norm.includes('england')) return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
  if (norm.includes('new zealand')) return '🇳🇿';
  if (norm.includes('pakistan')) return '🇵🇰';
  if (norm.includes('south africa')) return '🇿🇦';
  if (norm.includes('bangladesh')) return '🇧🇩';
  if (norm.includes('sri lanka')) return '🇱🇰';
  if (norm.includes('west indies')) return '🌴';
  if (norm.includes('afghanistan')) return '🇦🇫';
  if (norm.includes('chennai') || norm.includes('csk')) return '🦁';
  if (norm.includes('mumbai') || norm.includes('mi')) return '⚡';
  if (norm.includes('bengaluru') || norm.includes('rcb')) return '👑';
  if (norm.includes('kolkata') || norm.includes('kkr')) return '⚔️';
  return '🏏';
}

// ==========================================
// PLAYERS CATALOG
// ==========================================
export const INITIAL_PLAYERS: PlayerProfile[] = [
  {
    id: 'rohit-sharma',
    name: 'Rohit Sharma',
    fullName: 'Rohit Gurunath Sharma',
    country: 'India',
    team: 'India',
    gender: 'Men',
    role: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm offbreak',
    born: 'April 30, 1987 (Nagpur)',
    birthPlace: 'Nagpur, Maharashtra',
    ranking: { format: 'ODI', category: 'Batting', rank: 2 },
    stats: {
      test: { matches: 64, runs: 4233, highestScore: '212', average: 43.19, strikeRate: 56.2, centuries: 12, fifties: 18, wickets: 2, bestBowling: '1/26', bowlingAverage: 112.0 },
      odi: { matches: 265, runs: 10866, highestScore: '264', average: 49.16, strikeRate: 92.44, centuries: 31, fifties: 57, wickets: 9, bestBowling: '2/27', bowlingAverage: 64.3 },
      t20i: { matches: 159, runs: 4231, highestScore: '121*', average: 32.05, strikeRate: 140.89, centuries: 5, fifties: 32, wickets: 1, bestBowling: '1/22', bowlingAverage: 113.0 },
    },
    careerHighlights: [
      'Highest individual ODI score: 264 runs',
      'ICC Men’s T20 World Cup Winning Captain 2024',
      'Only player to score 3 double centuries in ODI cricket'
    ]
  },
  {
    id: 'virat-kohli',
    name: 'Virat Kohli',
    fullName: 'Virat Kohli',
    country: 'India',
    team: 'India',
    gender: 'Men',
    role: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    born: 'November 5, 1988 (Delhi)',
    birthPlace: 'Delhi, India',
    ranking: { format: 'ODI', category: 'Batting', rank: 3 },
    stats: {
      test: { matches: 118, runs: 9040, highestScore: '254*', average: 48.08, strikeRate: 55.4, centuries: 29, fifties: 31, wickets: 0, bestBowling: '0/0', bowlingAverage: 0 },
      odi: { matches: 295, runs: 13906, highestScore: '183', average: 58.18, strikeRate: 93.54, centuries: 50, fifties: 72, wickets: 5, bestBowling: '1/13', bowlingAverage: 166.2 },
      t20i: { matches: 125, runs: 4188, highestScore: '122*', average: 48.69, strikeRate: 137.04, centuries: 1, fifties: 38, wickets: 4, bestBowling: '1/13', bowlingAverage: 51.0 },
    },
    careerHighlights: [
      'World-record 50 ODI centuries',
      'Player of the Tournament at ICC T20 World Cups 2014 & 2016',
      'ICC T20 World Cup Champion 2024'
    ]
  },
  {
    id: 'jasprit-bumrah',
    name: 'Jasprit Bumrah',
    fullName: 'Jasprit Jasbirsingh Bumrah',
    country: 'India',
    team: 'India',
    gender: 'Men',
    role: 'Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    born: 'December 6, 1993 (Ahmedabad)',
    birthPlace: 'Ahmedabad, Gujarat',
    ranking: { format: 'Test', category: 'Bowling', rank: 1 },
    stats: {
      test: { matches: 40, runs: 280, highestScore: '34*', average: 8.48, strikeRate: 46.2, centuries: 0, fifties: 0, wickets: 173, bestBowling: '6/27', bowlingAverage: 20.49 },
      odi: { matches: 89, runs: 95, highestScore: '16', average: 5.58, strikeRate: 45.0, centuries: 0, fifties: 0, wickets: 149, bestBowling: '6/19', bowlingAverage: 23.55 },
      t20i: { matches: 70, runs: 12, highestScore: '8*', average: 4.0, strikeRate: 63.1, centuries: 0, fifties: 0, wickets: 89, bestBowling: '3/7', bowlingAverage: 17.74 },
    },
    careerHighlights: [
      'Ranked ICC No. 1 Test Bowler in the world',
      'Player of the Tournament ICC T20 World Cup 2024 (15 wickets at 8.26)'
    ]
  },
  {
    id: 'rachin-ravindra',
    name: 'Rachin Ravindra',
    fullName: 'Rachin Ravindra',
    country: 'New Zealand',
    team: 'New Zealand',
    gender: 'Men',
    role: 'All-Rounder',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Slow left-arm orthodox',
    born: 'November 18, 1999 (Wellington)',
    birthPlace: 'Wellington, New Zealand',
    ranking: { format: 'Test', category: 'Batting', rank: 12 },
    stats: {
      test: { matches: 12, runs: 856, highestScore: '240', average: 44.8, strikeRate: 58.2, centuries: 2, fifties: 3, wickets: 11, bestBowling: '3/33', bowlingAverage: 42.1 },
      odi: { matches: 25, runs: 820, highestScore: '123*', average: 41.0, strikeRate: 108.0, centuries: 3, fifties: 3, wickets: 18, bestBowling: '3/48', bowlingAverage: 38.0 },
      t20i: { matches: 20, runs: 214, highestScore: '68', average: 16.4, strikeRate: 133.0, centuries: 0, fifties: 1, wickets: 11, bestBowling: '3/22', bowlingAverage: 24.5 },
    },
    careerHighlights: [
      'Breakout star of ICC Men’s Cricket World Cup 2023 with 3 centuries',
      'Heroic 134 in historic Bengaluru Test win over India'
    ]
  },
  {
    id: 'pat-cummins',
    name: 'Pat Cummins',
    fullName: 'Patrick James Cummins',
    country: 'Australia',
    team: 'Australia',
    gender: 'Men',
    role: 'Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    born: 'May 8, 1993 (Sydney)',
    birthPlace: 'Sydney, Australia',
    ranking: { format: 'Test', category: 'Bowling', rank: 3 },
    stats: {
      test: { matches: 62, runs: 1290, highestScore: '64*', average: 16.5, strikeRate: 48.0, centuries: 0, fifties: 3, wickets: 269, bestBowling: '6/23', bowlingAverage: 22.53 },
      odi: { matches: 88, runs: 420, highestScore: '36', average: 12.3, strikeRate: 71.0, centuries: 0, fifties: 0, wickets: 141, bestBowling: '5/70', bowlingAverage: 28.0 },
      t20i: { matches: 57, runs: 180, highestScore: '28', average: 10.5, strikeRate: 125.0, centuries: 0, fifties: 0, wickets: 66, bestBowling: '3/15', bowlingAverage: 23.4 },
    },
    careerHighlights: [
      'Captain of Australia’s World Test Championship & World Cup winning teams',
      'ICC Men’s Cricketer of the Year 2023'
    ]
  },
  {
    id: 'smriti-mandhana',
    name: 'Smriti Mandhana',
    fullName: 'Smriti Srinivas Mandhana',
    country: 'India',
    team: 'India Women',
    gender: 'Women',
    role: 'Batter',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Right-arm medium',
    born: 'July 18, 1996 (Mumbai)',
    birthPlace: 'Mumbai, Maharashtra',
    ranking: { format: 'ODI', category: 'Batting', rank: 1 },
    stats: {
      test: { matches: 7, runs: 629, highestScore: '149', average: 57.18, strikeRate: 58.2, centuries: 2, fifties: 3, wickets: 0, bestBowling: '0/0', bowlingAverage: 0 },
      odi: { matches: 85, runs: 3585, highestScore: '136', average: 45.37, strikeRate: 85.2, centuries: 7, fifties: 26, wickets: 0, bestBowling: '0/0', bowlingAverage: 0 },
      t20i: { matches: 141, runs: 3493, highestScore: '87', average: 28.86, strikeRate: 122.42, centuries: 0, fifties: 26, wickets: 0, bestBowling: '0/0', bowlingAverage: 0 },
    },
    careerHighlights: [
      'ICC Women’s Cricketer of the Year twice',
      'Winning captain of WPL Royal Challengers Bengaluru Women'
    ]
  }
];

// ==========================================
// SERIES CATALOG
// ==========================================
export const INITIAL_SERIES: SeriesInfo[] = [
  {
    id: 'nz-tour-of-india-2024-26',
    name: 'New Zealand tour of India Test Series',
    format: 'Test',
    gender: 'Men',
    category: 'International',
    startDate: '2026-10-16',
    endDate: '2026-11-05',
    totalMatches: 3,
    description: 'The high-stakes three-match ICC World Test Championship series between India and New Zealand across Bengaluru, Pune, and Mumbai.',
    teams: [INITIAL_TEAMS[0], INITIAL_TEAMS[1]],
    standings: [
      { rank: 1, team: INITIAL_TEAMS[1], played: 2, won: 1, lost: 0, tied: 0, noResult: 1, points: 12, netRunRate: '+0.450', recentForm: ['W', 'NR'] },
      { rank: 2, team: INITIAL_TEAMS[0], played: 2, won: 0, lost: 1, tied: 0, noResult: 1, points: 4, netRunRate: '-0.450', recentForm: ['L', 'NR'] }
    ]
  },
  {
    id: 'icc-champions-trophy-2026',
    name: 'ICC Champions Trophy 2026',
    format: 'ODI',
    gender: 'Men',
    category: 'International',
    startDate: '2026-10-15',
    endDate: '2026-11-12',
    totalMatches: 15,
    description: 'The pinnacle eight-nation ODI tournament featuring the world’s elite cricket nations.',
    teams: INITIAL_TEAMS.slice(0, 8),
    standings: [
      { rank: 1, team: INITIAL_TEAMS[0], played: 3, won: 3, lost: 0, tied: 0, noResult: 0, points: 6, netRunRate: '+1.428', recentForm: ['W', 'W', 'W'] },
      { rank: 2, team: INITIAL_TEAMS[2], played: 3, won: 2, lost: 1, tied: 0, noResult: 0, points: 4, netRunRate: '+0.812', recentForm: ['W', 'L', 'W'] },
      { rank: 3, team: INITIAL_TEAMS[5], played: 3, won: 2, lost: 1, tied: 0, noResult: 0, points: 4, netRunRate: '+0.231', recentForm: ['L', 'W', 'W'] },
      { rank: 4, team: INITIAL_TEAMS[3], played: 3, won: 1, lost: 2, tied: 0, noResult: 0, points: 2, netRunRate: '-0.145', recentForm: ['L', 'W', 'L'] },
    ]
  },
  {
    id: 'icc-womens-t20-world-cup-2026',
    name: 'ICC Women\'s T20 World Cup 2026',
    format: 'T20I',
    gender: 'Women',
    category: 'International',
    startDate: '2026-10-03',
    endDate: '2026-10-28',
    totalMatches: 23,
    description: 'Premier women’s T20 international championship featuring ten global powerhouses.',
    teams: INITIAL_TEAMS.filter(t => t.gender === 'Women'),
    standings: [
      { rank: 1, team: INITIAL_TEAMS[11], played: 4, won: 4, lost: 0, tied: 0, noResult: 0, points: 8, netRunRate: '+1.884', recentForm: ['W', 'W', 'W', 'W'] },
      { rank: 2, team: INITIAL_TEAMS[10], played: 4, won: 3, lost: 1, tied: 0, noResult: 0, points: 6, netRunRate: '+1.120', recentForm: ['W', 'W', 'L', 'W'] },
    ]
  },
  {
    id: 'indian-premier-league-2026',
    name: 'Indian Premier League 2026',
    format: 'Domestic T20',
    gender: 'Men',
    category: 'Domestic',
    startDate: '2026-03-22',
    endDate: '2026-05-28',
    totalMatches: 74,
    description: 'The world’s most watched franchise cricket tournament.',
    teams: INITIAL_TEAMS.filter(t => ['CSK', 'MI', 'RCB', 'KKR'].includes(t.id))
  }
];

// ==========================================
// NEWS CATALOG
// ==========================================
export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'India vs New Zealand: Santner’s 7-Wicket Haul Sets Up Thrilling 4th Inning Chase in Pune',
    summary: 'Mitchell Santner rips through India with career-best figures on a dry Pune surface. India require 359 runs in the fourth innings with Ashwin and Jadeja leading a spirited counter-attack.',
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    publisher: 'Cricbuzz Desk',
    sourceUrl: 'https://cricbuzz.com/cricket-news/ind-vs-nz-pune-test-report',
    category: 'Test Cricket',
    readTime: '3 min read'
  },
  {
    id: 'news-2',
    title: 'ICC Champions Trophy: Kohli Magic Puts India On Verge of Epic Chase Against Australia',
    summary: 'Virat Kohli smashes sublime 94* under the lights at Gaddafi Stadium in Lahore, steering India toward an unforgettable 287-run target against Cummins’ Australia.',
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    publisher: 'International Cricket Council',
    sourceUrl: 'https://cricbuzz.com/cricket-news/champions-trophy-ind-vs-aus',
    category: 'Tournament',
    readTime: '4 min read'
  },
  {
    id: 'news-3',
    title: 'Women’s T20 World Cup Semi-Final: Mandhana and Harmanpreet Stage Grandstand Finish vs Australia',
    summary: 'Smriti Mandhana’s 68 and Harmanpreet Kaur’s blistering late assault bring India within touching distance of the ICC Women’s T20 World Cup Final in Dubai.',
    publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    publisher: 'WicketPulse Live Desk',
    sourceUrl: 'https://cricbuzz.com/cricket-news/ausw-vs-indw-semifinal',
    category: 'Women’s Cricket',
    readTime: '4 min read'
  },
  {
    id: 'news-4',
    title: 'Pakistan Clinch Memorable 9-Wicket Win Over England in Rawalpindi Decider',
    summary: 'Noman Ali and Sajid Khan combine for 19 wickets on a turning Rawalpindi deck as Shan Masood’s men seal the series 2-1 against Ben Stokes’ England.',
    publishedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    publisher: 'Cricket Global',
    sourceUrl: 'https://cricbuzz.com/cricket-news/pak-vs-eng-3rd-test-result',
    category: 'Test Cricket',
    readTime: '5 min read'
  }
];

import { MatchDetails, BallCommentary, InningsScore } from '../src/types/cricket.js';
import { INITIAL_TEAMS } from './cricketCatalog.js';

export function createRichMatchCatalog(): { matches: Map<string, MatchDetails>; commentary: Map<string, BallCommentary[]> } {
  const matches = new Map<string, MatchDetails>();
  const commentary = new Map<string, BallCommentary[]>();

  // ========================================================
  // MATCH 1: India vs New Zealand, 2nd Test - Day 3 (Pune)
  // Current high-profile live clash
  // ========================================================
  const m1Id = 'match-ind-nz-test-live';
  const m1Comms: BallCommentary[] = [
    {
      id: 'comm-nz-1',
      matchId: m1Id,
      innings: 4,
      over: 59,
      ball: 6,
      bowlerName: 'Mitchell Santner',
      bowlerId: 'mitchell-santner',
      strikerName: 'Ravichandran Ashwin',
      strikerId: 'ravichandran-ashwin',
      runs: 1,
      isFour: false,
      isSix: false,
      isWicket: false,
      isExtra: false,
      commentaryText: 'Tossed up full on off-stump, Ashwin leans forward and caresses it past mid-off for a calm single. Keeps strike for the next over.',
      timestamp: new Date(Date.now() - 15000).toISOString(),
      speedKph: 86.4
    },
    {
      id: 'comm-nz-2',
      matchId: m1Id,
      innings: 4,
      over: 59,
      ball: 5,
      bowlerName: 'Mitchell Santner',
      bowlerId: 'mitchell-santner',
      strikerName: 'Ravichandran Ashwin',
      strikerId: 'ravichandran-ashwin',
      runs: 4,
      isFour: true,
      isSix: false,
      isWicket: false,
      isExtra: false,
      commentaryText: 'FOUR! Delightful from Ashwin! Reads the arm ball early, presses back and cuts crisply behind point. The sweeper gives chase in vain!',
      timestamp: new Date(Date.now() - 40000).toISOString(),
      speedKph: 88.0
    },
    {
      id: 'comm-nz-3',
      matchId: m1Id,
      innings: 4,
      over: 59,
      ball: 4,
      bowlerName: 'Mitchell Santner',
      bowlerId: 'mitchell-santner',
      strikerName: 'Ravichandran Ashwin',
      strikerId: 'ravichandran-ashwin',
      runs: 0,
      isFour: false,
      isSix: false,
      isWicket: false,
      isExtra: false,
      commentaryText: 'Drifting into the pads, turned with the spin toward backward square leg. No run on offer.',
      timestamp: new Date(Date.now() - 75000).toISOString(),
      speedKph: 84.8
    },
    {
      id: 'comm-nz-4',
      matchId: m1Id,
      innings: 4,
      over: 59,
      ball: 3,
      bowlerName: 'Mitchell Santner',
      bowlerId: 'mitchell-santner',
      strikerName: 'Ravindra Jadeja',
      strikerId: 'ravindra-jadeja',
      runs: 1,
      isFour: false,
      isSix: false,
      isWicket: false,
      isExtra: false,
      commentaryText: 'Flighted outside off, Jadeja taps it softly into the covers and scampers across for a sharp single.',
      timestamp: new Date(Date.now() - 105000).toISOString(),
      speedKph: 85.5
    },
    {
      id: 'comm-nz-5',
      matchId: m1Id,
      innings: 4,
      over: 59,
      ball: 2,
      bowlerName: 'Mitchell Santner',
      bowlerId: 'mitchell-santner',
      strikerName: 'Ravindra Jadeja',
      strikerId: 'ravindra-jadeja',
      runs: 0,
      isFour: false,
      isSix: false,
      isWicket: false,
      isExtra: false,
      commentaryText: 'Sharp turn! Pitches on middle and spins past the outside edge as Jadeja plays inside the line. Oohs and aahs from the slip cordon.',
      timestamp: new Date(Date.now() - 135000).toISOString(),
      speedKph: 87.2
    }
  ];

  const m1: MatchDetails = {
    id: m1Id,
    title: 'India vs New Zealand, 2nd Test - Day 3',
    seriesId: 'nz-tour-of-india-2024-26',
    seriesName: 'New Zealand tour of India Test Series',
    format: 'Test',
    gender: 'Men',
    matchType: 'International',
    status: 'Live',
    statusNote: 'Day 3: India need 153 runs with 3 wickets in hand',
    venue: 'Maharashtra Cricket Association Stadium',
    city: 'Pune',
    startTime: '2026-10-24T04:00:00Z',
    team1: INITIAL_TEAMS[1], // NZ
    team2: INITIAL_TEAMS[0], // IND
    tossWinnerId: 'NZ',
    tossDecision: 'bat',
    team1Score: '259 & 255',
    team2Score: '156 & 206/7',
    team1Overs: '79.1 & 69.4',
    team2Overs: '45.3 & 59.6',
    currentInnings: 4,
    battingTeamId: 'IND',
    bowlingTeamId: 'NZ',
    currentRunRate: 3.44,
    requiredRunRate: 3.65,
    target: 359,
    currentStriker: {
      playerId: 'ravichandran-ashwin',
      name: 'Ravichandran Ashwin',
      runs: 18,
      balls: 24,
      fours: 2,
      sixes: 0,
      strikeRate: 75.0,
      isOut: false,
      isStriker: true
    },
    currentNonStriker: {
      playerId: 'ravindra-jadeja',
      name: 'Ravindra Jadeja',
      runs: 15,
      balls: 29,
      fours: 1,
      sixes: 0,
      strikeRate: 51.72,
      isOut: false,
      isStriker: false
    },
    currentBowler: {
      playerId: 'mitchell-santner',
      name: 'Mitchell Santner',
      overs: 24.0,
      maidens: 3,
      runsConceded: 78,
      wickets: 5,
      economy: 3.25,
      isBowling: true
    },
    recentBalls: ['0', '1', '0', '4', '1', '1'],
    isLive: true,
    lastUpdated: new Date().toISOString(),
    partnership: {
      runs: 28,
      balls: 41,
      batter1: { name: 'Ravichandran Ashwin', runs: 16, balls: 20 },
      batter2: { name: 'Ravindra Jadeja', runs: 12, balls: 21 }
    },
    playingXI: {
      team1: [
        { playerId: 'tom-latham', name: 'Tom Latham', role: 'Batter', isCaptain: true },
        { playerId: 'devon-conway', name: 'Devon Conway', role: 'Batter' },
        { playerId: 'will-young', name: 'Will Young', role: 'Batter' },
        { playerId: 'rachin-ravindra', name: 'Rachin Ravindra', role: 'All-Rounder' },
        { playerId: 'daryl-mitchell', name: 'Daryl Mitchell', role: 'All-Rounder' },
        { playerId: 'tom-blundell', name: 'Tom Blundell', role: 'Wicketkeeper-Batter', isKeeper: true },
        { playerId: 'glenn-phillips', name: 'Glenn Phillips', role: 'All-Rounder' },
        { playerId: 'mitchell-santner', name: 'Mitchell Santner', role: 'All-Rounder' },
        { playerId: 'tim-southee', name: 'Tim Southee', role: 'Bowler' },
        { playerId: 'ajaz-patel', name: 'Ajaz Patel', role: 'Bowler' },
        { playerId: 'will-orourke', name: 'William O’Rourke', role: 'Bowler' }
      ],
      team2: [
        { playerId: 'rohit-sharma', name: 'Rohit Sharma', role: 'Batter', isCaptain: true },
        { playerId: 'yashasvi-jaiswal', name: 'Yashasvi Jaiswal', role: 'Batter' },
        { playerId: 'shubman-gill', name: 'Shubman Gill', role: 'Batter' },
        { playerId: 'virat-kohli', name: 'Virat Kohli', role: 'Batter' },
        { playerId: 'rishabh-pant', name: 'Rishabh Pant', role: 'Wicketkeeper-Batter', isKeeper: true },
        { playerId: 'sarfaraz-khan', name: 'Sarfaraz Khan', role: 'Batter' },
        { playerId: 'ravindra-jadeja', name: 'Ravindra Jadeja', role: 'All-Rounder' },
        { playerId: 'washington-sundar', name: 'Washington Sundar', role: 'All-Rounder' },
        { playerId: 'ravichandran-ashwin', name: 'Ravichandran Ashwin', role: 'All-Rounder' },
        { playerId: 'jasprit-bumrah', name: 'Jasprit Bumrah', role: 'Bowler' },
        { playerId: 'akash-deep', name: 'Akash Deep', role: 'Bowler' }
      ]
    },
    umpires: ['Richard Illingworth', 'Nitin Menon'],
    referee: 'Javagal Srinath',
    commentaryRecent: m1Comms,
    innings: [
      {
        teamId: 'NZ',
        inningsNumber: 1,
        runs: 259,
        wickets: 10,
        overs: 79.1,
        extras: { wides: 4, noBalls: 1, byes: 6, legByes: 5, total: 16 },
        batting: [
          { playerId: 'tom-latham', name: 'Tom Latham', runs: 15, balls: 51, fours: 2, sixes: 0, strikeRate: 29.41, dismissal: 'lbw b Ashwin', isOut: true },
          { playerId: 'devon-conway', name: 'Devon Conway', runs: 76, balls: 141, fours: 11, sixes: 0, strikeRate: 53.9, dismissal: 'c Pant b Ashwin', isOut: true },
          { playerId: 'rachin-ravindra', name: 'Rachin Ravindra', runs: 65, balls: 105, fours: 5, sixes: 1, strikeRate: 61.9, dismissal: 'b Sundar', isOut: true },
          { playerId: 'mitchell-santner', name: 'Mitchell Santner', runs: 33, balls: 51, fours: 3, sixes: 0, strikeRate: 64.71, dismissal: 'b Sundar', isOut: true }
        ],
        bowling: [
          { playerId: 'washington-sundar', name: 'Washington Sundar', overs: 23.1, maidens: 4, runsConceded: 59, wickets: 7, economy: 2.55 },
          { playerId: 'ravichandran-ashwin', name: 'Ravichandran Ashwin', overs: 24, maidens: 2, runsConceded: 64, wickets: 3, economy: 2.67 }
        ],
        fallOfWickets: [
          { wicketNumber: 1, score: 32, overs: 7.5, playerName: 'Tom Latham' },
          { wicketNumber: 2, score: 138, overs: 43.2, playerName: 'Devon Conway' },
          { wicketNumber: 3, score: 197, overs: 59.1, playerName: 'Rachin Ravindra' }
        ]
      },
      {
        teamId: 'IND',
        inningsNumber: 2,
        runs: 156,
        wickets: 10,
        overs: 45.3,
        extras: { wides: 2, noBalls: 0, byes: 4, legByes: 2, total: 8 },
        batting: [
          { playerId: 'rohit-sharma', name: 'Rohit Sharma', runs: 0, balls: 9, fours: 0, sixes: 0, strikeRate: 0.0, dismissal: 'b Southee', isOut: true },
          { playerId: 'yashasvi-jaiswal', name: 'Yashasvi Jaiswal', runs: 30, balls: 60, fours: 4, sixes: 0, strikeRate: 50.0, dismissal: 'c Mitchell b Santner', isOut: true },
          { playerId: 'shubman-gill', name: 'Shubman Gill', runs: 30, balls: 72, fours: 2, sixes: 0, strikeRate: 41.67, dismissal: 'lbw b Santner', isOut: true },
          { playerId: 'virat-kohli', name: 'Virat Kohli', runs: 1, balls: 9, fours: 0, sixes: 0, strikeRate: 11.11, dismissal: 'b Santner', isOut: true },
          { playerId: 'ravindra-jadeja', name: 'Ravindra Jadeja', runs: 38, balls: 46, fours: 3, sixes: 2, strikeRate: 82.61, dismissal: 'lbw b Santner', isOut: true }
        ],
        bowling: [
          { playerId: 'mitchell-santner', name: 'Mitchell Santner', overs: 19.3, maidens: 1, runsConceded: 53, wickets: 7, economy: 2.72 },
          { playerId: 'glenn-phillips', name: 'Glenn Phillips', overs: 6, maidens: 0, runsConceded: 26, wickets: 2, economy: 4.33 }
        ],
        fallOfWickets: [
          { wicketNumber: 1, score: 1, overs: 2.6, playerName: 'Rohit Sharma' },
          { wicketNumber: 2, score: 50, overs: 21.3, playerName: 'Shubman Gill' },
          { wicketNumber: 3, score: 56, overs: 23.4, playerName: 'Virat Kohli' }
        ]
      },
      {
        teamId: 'NZ',
        inningsNumber: 3,
        runs: 255,
        wickets: 10,
        overs: 69.4,
        extras: { wides: 3, noBalls: 0, byes: 8, legByes: 4, total: 15 },
        batting: [
          { playerId: 'tom-latham', name: 'Tom Latham', runs: 86, balls: 133, fours: 10, sixes: 0, strikeRate: 64.66, dismissal: 'lbw b Sundar', isOut: true },
          { playerId: 'glenn-phillips', name: 'Glenn Phillips', runs: 48, balls: 82, fours: 4, sixes: 1, strikeRate: 58.54, dismissal: 'not out', isOut: false }
        ],
        bowling: [
          { playerId: 'washington-sundar', name: 'Washington Sundar', overs: 19, maidens: 0, runsConceded: 56, wickets: 4, economy: 2.95 },
          { playerId: 'ravindra-jadeja', name: 'Ravindra Jadeja', overs: 19.4, maidens: 3, runsConceded: 72, wickets: 3, economy: 3.66 }
        ],
        fallOfWickets: []
      },
      {
        teamId: 'IND',
        inningsNumber: 4,
        runs: 206,
        wickets: 7,
        overs: 60,
        extras: { wides: 4, noBalls: 1, byes: 2, legByes: 4, total: 11 },
        batting: [
          { playerId: 'yashasvi-jaiswal', name: 'Yashasvi Jaiswal', runs: 77, balls: 65, fours: 9, sixes: 3, strikeRate: 118.46, dismissal: 'c Mitchell b Santner', isOut: true },
          { playerId: 'rohit-sharma', name: 'Rohit Sharma', runs: 8, balls: 16, fours: 1, sixes: 0, strikeRate: 50.0, dismissal: 'c Young b Santner', isOut: true },
          { playerId: 'shubman-gill', name: 'Shubman Gill', runs: 23, balls: 31, fours: 4, sixes: 0, strikeRate: 74.19, dismissal: 'c Mitchell b Santner', isOut: true },
          { playerId: 'virat-kohli', name: 'Virat Kohli', runs: 17, balls: 40, fours: 2, sixes: 0, strikeRate: 42.5, dismissal: 'lbw b Santner', isOut: true },
          { playerId: 'rishabh-pant', name: 'Rishabh Pant', runs: 0, balls: 3, fours: 0, sixes: 0, strikeRate: 0.0, dismissal: 'run out (Santner)', isOut: true },
          { playerId: 'sarfaraz-khan', name: 'Sarfaraz Khan', runs: 9, balls: 15, fours: 1, sixes: 0, strikeRate: 60.0, dismissal: 'b Santner', isOut: true },
          { playerId: 'washington-sundar', name: 'Washington Sundar', runs: 21, balls: 47, fours: 2, sixes: 0, strikeRate: 44.68, dismissal: 'c Young b Phillips', isOut: true },
          { playerId: 'ravindra-jadeja', name: 'Ravindra Jadeja', runs: 15, balls: 29, fours: 1, sixes: 0, strikeRate: 51.72, dismissal: 'batting', isOut: false, isStriker: false },
          { playerId: 'ravichandran-ashwin', name: 'Ravichandran Ashwin', runs: 18, balls: 24, fours: 2, sixes: 0, strikeRate: 75.0, dismissal: 'batting', isOut: false, isStriker: true }
        ],
        bowling: [
          { playerId: 'mitchell-santner', name: 'Mitchell Santner', overs: 24, maidens: 3, runsConceded: 78, wickets: 5, economy: 3.25, isBowling: true },
          { playerId: 'glenn-phillips', name: 'Glenn Phillips', overs: 16, maidens: 1, runsConceded: 54, wickets: 1, economy: 3.38 },
          { playerId: 'ajaz-patel', name: 'Ajaz Patel', overs: 12, maidens: 0, runsConceded: 45, wickets: 0, economy: 3.75 },
          { playerId: 'tim-southee', name: 'Tim Southee', overs: 8, maidens: 1, runsConceded: 23, wickets: 0, economy: 2.88 }
        ],
        fallOfWickets: [
          { wicketNumber: 1, score: 34, overs: 5.4, playerName: 'Rohit Sharma' },
          { wicketNumber: 2, score: 96, overs: 15.3, playerName: 'Shubman Gill' },
          { wicketNumber: 3, score: 127, overs: 21.2, playerName: 'Yashasvi Jaiswal' },
          { wicketNumber: 4, score: 147, overs: 29.5, playerName: 'Rishabh Pant' },
          { wicketNumber: 5, score: 147, overs: 30.2, playerName: 'Virat Kohli' },
          { wicketNumber: 6, score: 165, overs: 35.5, playerName: 'Sarfaraz Khan' },
          { wicketNumber: 7, score: 178, overs: 43.1, playerName: 'Washington Sundar' }
        ]
      }
    ]
  };

  matches.set(m1Id, m1);
  commentary.set(m1Id, m1Comms);

  // ========================================================
  // MATCH 2: India vs Australia, Match 12 (Champions Trophy)
  // ========================================================
  const m2Id = 'match-ind-aus-live';
  const m2Comms: BallCommentary[] = [
    {
      id: 'comm-aus-1',
      matchId: m2Id,
      innings: 2,
      over: 46,
      ball: 1,
      bowlerName: 'Pat Cummins',
      bowlerId: 'pat-cummins',
      strikerName: 'Virat Kohli',
      strikerId: 'virat-kohli',
      runs: 4,
      isFour: true,
      isSix: false,
      isWicket: false,
      isExtra: false,
      commentaryText: 'FOUR! Majestic Kohli! Reaches to a 140kph full delivery outside off and carves it between cover and point with immaculate timing! Moves to 94!',
      timestamp: new Date(Date.now() - 18000).toISOString(),
      speedKph: 140.2
    },
    {
      id: 'comm-aus-2',
      matchId: m2Id,
      innings: 2,
      over: 45,
      ball: 6,
      bowlerName: 'Mitchell Starc',
      bowlerId: 'mitchell-starc',
      strikerName: 'Ravindra Jadeja',
      strikerId: 'ravindra-jadeja',
      runs: 1,
      isFour: false,
      isSix: false,
      isWicket: false,
      isExtra: false,
      commentaryText: 'Toe-crushing yorker on middle stump! Jadeja jams it out into the off-side and steals a quick single.',
      timestamp: new Date(Date.now() - 48000).toISOString(),
      speedKph: 146.5
    }
  ];

  const m2: MatchDetails = {
    id: m2Id,
    title: 'India vs Australia, Match 12',
    seriesId: 'icc-champions-trophy-2026',
    seriesName: 'ICC Champions Trophy 2026',
    format: 'ODI',
    gender: 'Men',
    matchType: 'International',
    status: 'Live',
    statusNote: 'India need 29 runs in 23 balls with 4 wickets in hand',
    venue: 'Gaddafi Stadium',
    city: 'Lahore',
    startTime: '2026-10-24T08:30:00Z',
    team1: INITIAL_TEAMS[2], // AUS
    team2: INITIAL_TEAMS[0], // IND
    tossWinnerId: 'AUS',
    tossDecision: 'bat',
    team1Score: '286/8',
    team2Score: '258/6',
    team1Overs: '50.0',
    team2Overs: '46.1',
    currentInnings: 2,
    battingTeamId: 'IND',
    bowlingTeamId: 'AUS',
    currentRunRate: 5.58,
    requiredRunRate: 7.56,
    target: 287,
    currentStriker: {
      playerId: 'virat-kohli',
      name: 'Virat Kohli',
      runs: 94,
      balls: 83,
      fours: 9,
      sixes: 2,
      strikeRate: 113.25,
      isOut: false,
      isStriker: true
    },
    currentNonStriker: {
      playerId: 'ravindra-jadeja',
      name: 'Ravindra Jadeja',
      runs: 26,
      balls: 22,
      fours: 2,
      sixes: 0,
      strikeRate: 118.18,
      isOut: false,
      isStriker: false
    },
    currentBowler: {
      playerId: 'pat-cummins',
      name: 'Pat Cummins',
      overs: 9.1,
      maidens: 0,
      runsConceded: 54,
      wickets: 2,
      economy: 5.89,
      isBowling: true
    },
    recentBalls: ['1', '2', '1', '6', '1', '4'],
    isLive: true,
    lastUpdated: new Date().toISOString(),
    partnership: {
      runs: 55,
      balls: 45,
      batter1: { name: 'Virat Kohli', runs: 33, balls: 25 },
      batter2: { name: 'Ravindra Jadeja', runs: 22, balls: 20 }
    },
    playingXI: {
      team1: [
        { playerId: 'travis-head', name: 'Travis Head', role: 'Batter' },
        { playerId: 'mitchell-marsh', name: 'Mitchell Marsh', role: 'All-Rounder', isCaptain: true },
        { playerId: 'steve-smith', name: 'Steve Smith', role: 'Batter' },
        { playerId: 'marnus-labuschagne', name: 'Marnus Labuschagne', role: 'Batter' },
        { playerId: 'glenn-maxwell', name: 'Glenn Maxwell', role: 'All-Rounder' },
        { playerId: 'alex-carey', name: 'Alex Carey', role: 'Wicketkeeper-Batter', isKeeper: true },
        { playerId: 'marcus-stoinis', name: 'Marcus Stoinis', role: 'All-Rounder' },
        { playerId: 'pat-cummins', name: 'Pat Cummins', role: 'Bowler' },
        { playerId: 'mitchell-starc', name: 'Mitchell Starc', role: 'Bowler' },
        { playerId: 'adam-zampa', name: 'Adam Zampa', role: 'Bowler' },
        { playerId: 'josh-hazlewood', name: 'Josh Hazlewood', role: 'Bowler' }
      ],
      team2: [
        { playerId: 'rohit-sharma', name: 'Rohit Sharma', role: 'Batter', isCaptain: true },
        { playerId: 'shubman-gill', name: 'Shubman Gill', role: 'Batter' },
        { playerId: 'virat-kohli', name: 'Virat Kohli', role: 'Batter' },
        { playerId: 'shreyas-iyer', name: 'Shreyas Iyer', role: 'Batter' },
        { playerId: 'kl-rahul', name: 'KL Rahul', role: 'Wicketkeeper-Batter', isKeeper: true },
        { playerId: 'hardik-pandya', name: 'Hardik Pandya', role: 'All-Rounder' },
        { playerId: 'ravindra-jadeja', name: 'Ravindra Jadeja', role: 'All-Rounder' },
        { playerId: 'kuldeep-yadav', name: 'Kuldeep Yadav', role: 'Bowler' },
        { playerId: 'jasprit-bumrah', name: 'Jasprit Bumrah', role: 'Bowler' },
        { playerId: 'mohammed-shami', name: 'Mohammed Shami', role: 'Bowler' },
        { playerId: 'mohammed-siraj', name: 'Mohammed Siraj', role: 'Bowler' }
      ]
    },
    umpires: ['Kumar Dharmasena', 'Richard Kettleborough'],
    referee: 'Andy Pycroft',
    commentaryRecent: m2Comms,
    innings: [
      {
        teamId: 'AUS',
        inningsNumber: 1,
        runs: 286,
        wickets: 8,
        overs: 50,
        extras: { wides: 8, noBalls: 1, byes: 4, legByes: 6, total: 19 },
        batting: [
          { playerId: 'travis-head', name: 'Travis Head', runs: 64, balls: 52, fours: 7, sixes: 3, strikeRate: 123.07, dismissal: 'c Rahul b Bumrah', isOut: true },
          { playerId: 'mitchell-marsh', name: 'Mitchell Marsh', runs: 32, balls: 40, fours: 3, sixes: 1, strikeRate: 80.0, dismissal: 'c Iyer b Siraj', isOut: true },
          { playerId: 'steve-smith', name: 'Steve Smith', runs: 71, balls: 84, fours: 6, sixes: 0, strikeRate: 84.52, dismissal: 'lbw b Kuldeep', isOut: true },
          { playerId: 'marnus-labuschagne', name: 'Marnus Labuschagne', runs: 28, balls: 36, fours: 2, sixes: 0, strikeRate: 77.78, dismissal: 'b Jadeja', isOut: true },
          { playerId: 'glenn-maxwell', name: 'Glenn Maxwell', runs: 42, balls: 24, fours: 3, sixes: 3, strikeRate: 175.0, dismissal: 'c & b Shami', isOut: true },
          { playerId: 'alex-carey', name: 'Alex Carey', runs: 16, balls: 19, fours: 1, sixes: 0, strikeRate: 84.21, dismissal: 'c Gill b Bumrah', isOut: true },
          { playerId: 'pat-cummins', name: 'Pat Cummins', runs: 14, balls: 12, fours: 1, sixes: 0, strikeRate: 116.67, dismissal: 'not out', isOut: false },
          { playerId: 'mitchell-starc', name: 'Mitchell Starc', runs: 0, balls: 1, fours: 0, sixes: 0, strikeRate: 0.0, dismissal: 'b Bumrah', isOut: true }
        ],
        bowling: [
          { playerId: 'jasprit-bumrah', name: 'Jasprit Bumrah', overs: 10, maidens: 1, runsConceded: 42, wickets: 3, economy: 4.2 },
          { playerId: 'mohammed-siraj', name: 'Mohammed Siraj', overs: 9, maidens: 0, runsConceded: 58, wickets: 1, economy: 6.44 },
          { playerId: 'mohammed-shami', name: 'Mohammed Shami', overs: 10, maidens: 0, runsConceded: 54, wickets: 2, economy: 5.4 },
          { playerId: 'kuldeep-yadav', name: 'Kuldeep Yadav', overs: 10, maidens: 0, runsConceded: 51, wickets: 1, economy: 5.1 },
          { playerId: 'ravindra-jadeja', name: 'Ravindra Jadeja', overs: 10, maidens: 0, runsConceded: 48, wickets: 1, economy: 4.8 }
        ],
        fallOfWickets: [
          { wicketNumber: 1, score: 78, overs: 11.2, playerName: 'Mitchell Marsh' },
          { wicketNumber: 2, score: 124, overs: 19.4, playerName: 'Travis Head' },
          { wicketNumber: 3, score: 189, overs: 33.1, playerName: 'Marnus Labuschagne' },
          { wicketNumber: 4, score: 232, overs: 41.5, playerName: 'Steve Smith' },
          { wicketNumber: 5, score: 262, overs: 46.2, playerName: 'Glenn Maxwell' }
        ]
      },
      {
        teamId: 'IND',
        inningsNumber: 2,
        runs: 258,
        wickets: 6,
        overs: 46.1,
        extras: { wides: 6, noBalls: 0, byes: 2, legByes: 5, total: 13 },
        batting: [
          { playerId: 'rohit-sharma', name: 'Rohit Sharma', runs: 47, balls: 41, fours: 5, sixes: 2, strikeRate: 114.63, dismissal: 'c Maxwell b Starc', isOut: true },
          { playerId: 'shubman-gill', name: 'Shubman Gill', runs: 31, balls: 38, fours: 4, sixes: 0, strikeRate: 81.58, dismissal: 'c Carey b Hazlewood', isOut: true },
          { playerId: 'virat-kohli', name: 'Virat Kohli', runs: 94, balls: 83, fours: 9, sixes: 2, strikeRate: 113.25, dismissal: 'batting', isOut: false, isStriker: true },
          { playerId: 'shreyas-iyer', name: 'Shreyas Iyer', runs: 12, balls: 16, fours: 1, sixes: 0, strikeRate: 75.0, dismissal: 'b Cummins', isOut: true },
          { playerId: 'kl-rahul', name: 'KL Rahul', runs: 28, balls: 32, fours: 2, sixes: 1, strikeRate: 87.5, dismissal: 'c Smith b Zampa', isOut: true },
          { playerId: 'hardik-pandya', name: 'Hardik Pandya', runs: 14, balls: 11, fours: 1, sixes: 1, strikeRate: 127.27, dismissal: 'c Head b Cummins', isOut: true },
          { playerId: 'ravindra-jadeja', name: 'Ravindra Jadeja', runs: 26, balls: 22, fours: 2, sixes: 0, strikeRate: 118.18, dismissal: 'batting', isOut: false, isStriker: false }
        ],
        bowling: [
          { playerId: 'mitchell-starc', name: 'Mitchell Starc', overs: 9, maidens: 0, runsConceded: 58, wickets: 1, economy: 6.44 },
          { playerId: 'josh-hazlewood', name: 'Josh Hazlewood', overs: 10, maidens: 1, runsConceded: 46, wickets: 1, economy: 4.6 },
          { playerId: 'pat-cummins', name: 'Pat Cummins', overs: 9.1, maidens: 0, runsConceded: 54, wickets: 2, economy: 5.89, isBowling: true },
          { playerId: 'adam-zampa', name: 'Adam Zampa', overs: 10, maidens: 0, runsConceded: 52, wickets: 1, economy: 5.2 },
          { playerId: 'glenn-maxwell', name: 'Glenn Maxwell', overs: 8, maidens: 0, runsConceded: 41, wickets: 0, economy: 5.12 }
        ],
        fallOfWickets: [
          { wicketNumber: 1, score: 68, overs: 10.3, playerName: 'Rohit Sharma' },
          { wicketNumber: 2, score: 96, overs: 16.1, playerName: 'Shubman Gill' },
          { wicketNumber: 3, score: 122, overs: 22.4, playerName: 'Shreyas Iyer' },
          { wicketNumber: 4, score: 178, overs: 33.2, playerName: 'KL Rahul' },
          { wicketNumber: 5, score: 203, overs: 38.1, playerName: 'Hardik Pandya' }
        ]
      }
    ]
  };

  matches.set(m2Id, m2);
  commentary.set(m2Id, m2Comms);

  // ========================================================
  // MATCH 3: England vs Pakistan, 3rd Test - Day 3 (Rawalpindi)
  // ========================================================
  const m3Id = 'match-eng-pak-test-live';
  const m3Comms: BallCommentary[] = [
    {
      id: 'comm-pak-1',
      matchId: m3Id,
      innings: 4,
      over: 3,
      ball: 1,
      bowlerName: 'Jack Leach',
      bowlerId: 'jack-leach',
      strikerName: 'Shan Masood',
      strikerId: 'shan-masood',
      runs: 4,
      isFour: true,
      isSix: false,
      isWicket: false,
      isExtra: false,
      commentaryText: 'FOUR! Shan Masood comes down the track and thumps Leach straight over mid-on to seal a glorious victory for Pakistan!',
      timestamp: new Date(Date.now() - 30000).toISOString(),
      speedKph: 84.0
    }
  ];

  const m3: MatchDetails = {
    id: m3Id,
    title: 'England vs Pakistan, 3rd Test - Day 3',
    seriesId: 'eng-tour-of-pakistan-2024-26',
    seriesName: 'England tour of Pakistan Test Series',
    format: 'Test',
    gender: 'Men',
    matchType: 'International',
    status: 'Completed',
    statusNote: 'Pakistan won by 9 wickets (Series won 2-1)',
    venue: 'Rawalpindi Cricket Stadium',
    city: 'Rawalpindi',
    startTime: '2026-10-24T05:00:00Z',
    team1: INITIAL_TEAMS[3], // ENG
    team2: INITIAL_TEAMS[4], // PAK
    team1Score: '267 & 112',
    team2Score: '344 & 37/1',
    team1Overs: '68.2 & 37.2',
    team2Overs: '96.4 & 3.1',
    currentInnings: 4,
    battingTeamId: 'PAK',
    bowlingTeamId: 'ENG',
    winnerTeamId: 'PAK',
    winMargin: '9 wickets',
    playerOfTheMatch: {
      playerId: 'sajid-khan',
      name: 'Sajid Khan',
      team: 'Pakistan',
      performance: '6/128 & 4/48'
    },
    isLive: false,
    lastUpdated: new Date().toISOString(),
    playingXI: {
      team1: [
        { playerId: 'zak-crawley', name: 'Zak Crawley', role: 'Batter' },
        { playerId: 'ben-duckett', name: 'Ben Duckett', role: 'Batter' },
        { playerId: 'ollie-pope', name: 'Ollie Pope', role: 'Batter' },
        { playerId: 'joe-root', name: 'Joe Root', role: 'Batter' },
        { playerId: 'harry-brook', name: 'Harry Brook', role: 'Batter' },
        { playerId: 'ben-stokes', name: 'Ben Stokes', role: 'All-Rounder', isCaptain: true },
        { playerId: 'jamie-smith', name: 'Jamie Smith', role: 'Wicketkeeper-Batter', isKeeper: true },
        { playerId: 'rehan-ahmed', name: 'Rehan Ahmed', role: 'Bowler' },
        { playerId: 'jack-leach', name: 'Jack Leach', role: 'Bowler' },
        { playerId: 'gus-atkinson', name: 'Gus Atkinson', role: 'Bowler' },
        { playerId: 'shoalb-bashir', name: 'Shoaib Bashir', role: 'Bowler' }
      ],
      team2: [
        { playerId: 'saim-ayub', name: 'Saim Ayub', role: 'Batter' },
        { playerId: 'abdullah-shafique', name: 'Abdullah Shafique', role: 'Batter' },
        { playerId: 'shan-masood', name: 'Shan Masood', role: 'Batter', isCaptain: true },
        { playerId: 'kamran-ghulam', name: 'Kamran Ghulam', role: 'Batter' },
        { playerId: 'saud-shakeel', name: 'Saud Shakeel', role: 'Batter' },
        { playerId: 'mohammad-rizwan', name: 'Mohammad Rizwan', role: 'Wicketkeeper-Batter', isKeeper: true },
        { playerId: 'agha-salman', name: 'Agha Salman', role: 'All-Rounder' },
        { playerId: 'aamer-jamal', name: 'Aamer Jamal', role: 'All-Rounder' },
        { playerId: 'noman-ali', name: 'Noman Ali', role: 'Bowler' },
        { playerId: 'sajid-khan', name: 'Sajid Khan', role: 'Bowler' },
        { playerId: 'zahid-mahmood', name: 'Zahid Mahmood', role: 'Bowler' }
      ]
    },
    innings: [],
    commentaryRecent: m3Comms
  };

  matches.set(m3Id, m3);
  commentary.set(m3Id, m3Comms);

  // ========================================================
  // MATCH 4: Australia Women vs India Women (T20 World Cup SF)
  // ========================================================
  const m4Id = 'match-aus-ind-women-live';
  const m4Comms: BallCommentary[] = [
    {
      id: 'comm-w-1',
      matchId: m4Id,
      innings: 2,
      over: 18,
      ball: 5,
      bowlerName: 'Sophie Molineux',
      bowlerId: 'sophie-molineux',
      strikerName: 'Harmanpreet Kaur',
      strikerId: 'harmanpreet-kaur',
      runs: 4,
      isFour: true,
      isSix: false,
      isWicket: false,
      isExtra: false,
      commentaryText: 'FOUR! Harmanpreet executes the sweep to perfection! Flat trajectories from Molineux and Kaur fetches it past short fine leg!',
      timestamp: new Date(Date.now() - 20000).toISOString(),
      speedKph: 83.2
    }
  ];

  const m4: MatchDetails = {
    id: m4Id,
    title: 'Australia Women vs India Women, 1st Semi-Final',
    seriesId: 'icc-womens-t20-world-cup-2026',
    seriesName: 'ICC Women\'s T20 World Cup 2026',
    format: 'T20I',
    gender: 'Women',
    matchType: 'International',
    status: 'Live',
    statusNote: 'India Women need 10 runs in 7 balls with 4 wickets in hand',
    venue: 'Dubai International Cricket Stadium',
    city: 'Dubai',
    startTime: '2026-10-24T14:00:00Z',
    team1: INITIAL_TEAMS[11], // AUS-W
    team2: INITIAL_TEAMS[10], // IND-W
    tossWinnerId: 'IND-W',
    tossDecision: 'bowl',
    team1Score: '151/8',
    team2Score: '142/6',
    team1Overs: '20.0',
    team2Overs: '18.5',
    currentInnings: 2,
    battingTeamId: 'IND-W',
    bowlingTeamId: 'AUS-W',
    currentRunRate: 7.54,
    requiredRunRate: 8.57,
    target: 152,
    currentStriker: {
      playerId: 'harmanpreet-kaur',
      name: 'Harmanpreet Kaur',
      runs: 46,
      balls: 33,
      fours: 5,
      sixes: 1,
      strikeRate: 139.39,
      isOut: false,
      isStriker: true
    },
    currentNonStriker: {
      playerId: 'richa-ghosh',
      name: 'Richa Ghosh',
      runs: 12,
      balls: 8,
      fours: 1,
      sixes: 0,
      strikeRate: 150.0,
      isOut: false,
      isStriker: false
    },
    currentBowler: {
      playerId: 'sophie-molineux',
      name: 'Sophie Molineux',
      overs: 3.5,
      maidens: 0,
      runsConceded: 28,
      wickets: 2,
      economy: 7.3,
      isBowling: true
    },
    recentBalls: ['1', '0', '4', '2', '4'],
    isLive: true,
    lastUpdated: new Date().toISOString(),
    partnership: {
      runs: 29,
      balls: 19,
      batter1: { name: 'Harmanpreet Kaur', runs: 18, balls: 11 },
      batter2: { name: 'Richa Ghosh', runs: 11, balls: 8 }
    },
    playingXI: {
      team1: [
        { playerId: 'alyssa-healy', name: 'Alyssa Healy', role: 'Wicketkeeper-Batter', isCaptain: true, isKeeper: true },
        { playerId: 'beth-mooney', name: 'Beth Mooney', role: 'Batter' },
        { playerId: 'ellyse-perry', name: 'Ellyse Perry', role: 'All-Rounder' },
        { playerId: 'ashleigh-gardner', name: 'Ashleigh Gardner', role: 'All-Rounder' },
        { playerId: 'phoebe-litchfield', name: 'Phoebe Litchfield', role: 'Batter' },
        { playerId: 'tahlia-mcgrath', name: 'Tahlia McGrath', role: 'All-Rounder' },
        { playerId: 'annabel-sutherland', name: 'Annabel Sutherland', role: 'All-Rounder' },
        { playerId: 'georgia-wareham', name: 'Georgia Wareham', role: 'Bowler' },
        { playerId: 'sophie-molineux', name: 'Sophie Molineux', role: 'Bowler' },
        { playerId: 'megan-schutt', name: 'Megan Schutt', role: 'Bowler' },
        { playerId: 'darcie-brown', name: 'Darcie Brown', role: 'Bowler' }
      ],
      team2: [
        { playerId: 'smriti-mandhana', name: 'Smriti Mandhana', role: 'Batter' },
        { playerId: 'shafali-verma', name: 'Shafali Verma', role: 'Batter' },
        { playerId: 'jemimah-rodrigues', name: 'Jemimah Rodrigues', role: 'Batter' },
        { playerId: 'harmanpreet-kaur', name: 'Harmanpreet Kaur', role: 'Batter', isCaptain: true },
        { playerId: 'richa-ghosh', name: 'Richa Ghosh', role: 'Wicketkeeper-Batter', isKeeper: true },
        { playerId: 'deepti-sharma', name: 'Deepti Sharma', role: 'All-Rounder' },
        { playerId: 'pooja-vastrakar', name: 'Pooja Vastrakar', role: 'All-Rounder' },
        { playerId: 'shreyanka-patil', name: 'Shreyanka Patil', role: 'Bowler' },
        { playerId: 'radha-yadav', name: 'Radha Yadav', role: 'Bowler' },
        { playerId: 'renuka-singh', name: 'Renuka Singh Thakur', role: 'Bowler' },
        { playerId: 'arundhati-reddy', name: 'Arundhati Reddy', role: 'Bowler' }
      ]
    },
    innings: [
      {
        teamId: 'AUS-W',
        inningsNumber: 1,
        runs: 151,
        wickets: 8,
        overs: 20,
        extras: { wides: 6, noBalls: 0, byes: 1, legByes: 2, total: 9 },
        batting: [
          { playerId: 'beth-mooney', name: 'Beth Mooney', runs: 44, balls: 38, fours: 5, sixes: 0, strikeRate: 115.79, dismissal: 'c Mandhana b Deepti', isOut: true },
          { playerId: 'ellyse-perry', name: 'Ellyse Perry', runs: 32, balls: 23, fours: 3, sixes: 1, strikeRate: 139.13, dismissal: 'c Ghosh b Renuka', isOut: true }
        ],
        bowling: [
          { playerId: 'deepti-sharma', name: 'Deepti Sharma', overs: 4, maidens: 0, runsConceded: 24, wickets: 2, economy: 6.0 },
          { playerId: 'renuka-singh', name: 'Renuka Singh Thakur', overs: 4, maidens: 0, runsConceded: 29, wickets: 2, economy: 7.25 }
        ],
        fallOfWickets: []
      },
      {
        teamId: 'IND-W',
        inningsNumber: 2,
        runs: 142,
        wickets: 6,
        overs: 18.5,
        extras: { wides: 4, noBalls: 0, byes: 1, legByes: 3, total: 8 },
        batting: [
          { playerId: 'smriti-mandhana', name: 'Smriti Mandhana', runs: 68, balls: 48, fours: 8, sixes: 2, strikeRate: 141.67, dismissal: 'c Perry b Molineux', isOut: true },
          { playerId: 'harmanpreet-kaur', name: 'Harmanpreet Kaur', runs: 46, balls: 33, fours: 5, sixes: 1, strikeRate: 139.39, dismissal: 'batting', isOut: false, isStriker: true },
          { playerId: 'richa-ghosh', name: 'Richa Ghosh', runs: 12, balls: 8, fours: 1, sixes: 0, strikeRate: 150.0, dismissal: 'batting', isOut: false, isStriker: false }
        ],
        bowling: [
          { playerId: 'sophie-molineux', name: 'Sophie Molineux', overs: 3.5, maidens: 0, runsConceded: 28, wickets: 2, economy: 7.3, isBowling: true }
        ],
        fallOfWickets: []
      }
    ],
    commentaryRecent: m4Comms
  };

  matches.set(m4Id, m4);
  commentary.set(m4Id, m4Comms);

  // ========================================================
  // MATCH 5: CSK vs MI (Upcoming IPL Blockbuster)
  // ========================================================
  const m5Id = 'match-csk-mi-upcoming';
  const m5: MatchDetails = {
    id: m5Id,
    title: 'Chennai Super Kings vs Mumbai Indians, Match 1',
    seriesId: 'indian-premier-league-2026',
    seriesName: 'Indian Premier League 2026',
    format: 'Domestic T20',
    gender: 'Men',
    matchType: 'Domestic',
    status: 'Scheduled',
    statusNote: 'Match starts at 19:30 IST · MA Chidambaram Stadium, Chepauk',
    venue: 'MA Chidambaram Stadium',
    city: 'Chennai',
    startTime: '2026-10-26T14:00:00Z',
    team1: INITIAL_TEAMS[15], // CSK
    team2: INITIAL_TEAMS[16], // MI
    isLive: false,
    lastUpdated: new Date().toISOString(),
    playingXI: {
      team1: [
        { playerId: 'ruturaj-gaikwad', name: 'Ruturaj Gaikwad', role: 'Batter', isCaptain: true },
        { playerId: 'devon-conway', name: 'Devon Conway', role: 'Batter' },
        { playerId: 'shivam-dube', name: 'Shivam Dube', role: 'All-Rounder' },
        { playerId: 'ravindra-jadeja', name: 'Ravindra Jadeja', role: 'All-Rounder' },
        { playerId: 'ms-dhoni', name: 'MS Dhoni', role: 'Wicketkeeper-Batter', isKeeper: true },
        { playerId: 'matheesha-pathirana', name: 'Matheesha Pathirana', role: 'Bowler' }
      ],
      team2: [
        { playerId: 'rohit-sharma', name: 'Rohit Sharma', role: 'Batter' },
        { playerId: 'ishan-kishan', name: 'Ishan Kishan', role: 'Wicketkeeper-Batter', isKeeper: true },
        { playerId: 'suryakumar-yadav', name: 'Suryakumar Yadav', role: 'Batter' },
        { playerId: 'hardik-pandya', name: 'Hardik Pandya', role: 'All-Rounder', isCaptain: true },
        { playerId: 'tilak-varma', name: 'Tilak Varma', role: 'Batter' },
        { playerId: 'jasprit-bumrah', name: 'Jasprit Bumrah', role: 'Bowler' }
      ]
    },
    innings: [],
    commentaryRecent: []
  };

  matches.set(m5Id, m5);

  // ========================================================
  // MATCH 6: South Africa vs Bangladesh, 2nd Test (Result)
  // ========================================================
  const m6Id = 'match-sa-ban-result';
  const m6: MatchDetails = {
    id: m6Id,
    title: 'South Africa vs Bangladesh, 2nd Test',
    seriesId: 'sa-tour-of-ban-2024-26',
    seriesName: 'South Africa tour of Bangladesh 2024/2026',
    format: 'Test',
    gender: 'Men',
    matchType: 'International',
    status: 'Completed',
    statusNote: 'South Africa won by an innings and 273 runs',
    venue: 'Zohur Ahmed Chowdhury Stadium',
    city: 'Chattogram',
    startTime: '2026-10-21T04:00:00Z',
    team1: INITIAL_TEAMS[5], // SA
    team2: INITIAL_TEAMS[6], // BAN
    team1Score: '575/6d',
    team2Score: '159 & 143 (f/o)',
    team1Overs: '144.2',
    team2Overs: '45.2 & 43.4',
    winnerTeamId: 'SA',
    winMargin: 'Innings & 273 runs',
    playerOfTheMatch: {
      playerId: 'tony-de-zorzi',
      name: 'Tony de Zorzi',
      team: 'South Africa',
      performance: '177 (269b, 22x4, 4x6)'
    },
    isLive: false,
    lastUpdated: new Date().toISOString(),
    playingXI: { team1: [], team2: [] },
    innings: [],
    commentaryRecent: []
  };

  matches.set(m6Id, m6);

  // ========================================================
  // MATCH 7: Australia vs Pakistan, 1st ODI (Result)
  // ========================================================
  const m7Id = 'match-aus-pak-result';
  const m7: MatchDetails = {
    id: m7Id,
    title: 'Australia vs Pakistan, 1st ODI',
    seriesId: 'pak-tour-of-aus-2024-26',
    seriesName: 'Pakistan tour of Australia ODI Series',
    format: 'ODI',
    gender: 'Men',
    matchType: 'International',
    status: 'Completed',
    statusNote: 'Australia won by 2 wickets with 99 balls remaining',
    venue: 'Melbourne Cricket Ground',
    city: 'Melbourne',
    startTime: '2026-10-22T03:30:00Z',
    team1: INITIAL_TEAMS[4], // PAK
    team2: INITIAL_TEAMS[2], // AUS
    team1Score: '203',
    team2Score: '204/8',
    team1Overs: '46.4',
    team2Overs: '33.3',
    winnerTeamId: 'AUS',
    winMargin: '2 wickets',
    playerOfTheMatch: {
      playerId: 'mitchell-starc',
      name: 'Mitchell Starc',
      team: 'Australia',
      performance: '3/33 (10 ov) & 2 catches'
    },
    isLive: false,
    lastUpdated: new Date().toISOString(),
    playingXI: { team1: [], team2: [] },
    innings: [],
    commentaryRecent: []
  };

  matches.set(m7Id, m7);

  return { matches, commentary };
}

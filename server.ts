import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import { createServer as createViteServer } from 'vite';

dotenv.config();

import { connectDB, isDatabaseConnected, inMemoryStore, persistStoreToDisk } from './server/db.js';
import {
  SignupSchema,
  LoginSchema,
  createUser,
  findUserByEmail,
  findUserById,
  verifyPassword,
  hashPassword,
  generateToken,
  setAuthCookie,
  clearAuthCookie,
  authenticateToken,
  optionalToken,
  AuthRequest
} from './server/auth.js';
import { cricketDataStore, activeCricbuzzProvider, validateProviderConfiguration } from './server/cricketProvider.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  // Validate cricket provider configuration at startup
  validateProviderConfiguration();

  const app = express();
  const server = http.createServer(app);

  // Socket.IO configuration
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Middleware
  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET || 'wicketpulse_cookie_secret'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect to MongoDB Atlas (with in-memory fallback)
  await connectDB();

  // Socket.IO handlers
  io.on('connection', (socket) => {
    socket.on('match:subscribe', (matchId: string) => {
      if (matchId) {
        socket.join(`match:${matchId}`);
      }
    });

    socket.on('match:unsubscribe', (matchId: string) => {
      if (matchId) {
        socket.leave(`match:${matchId}`);
      }
    });
  });

  // Real-time Match Broadcaster: broadcasts live scores and ball commentary across active live matches
  let simMatchIndex = 0;
  const liveInterval = setInterval(async () => {
    try {
      // 1. Broadcast live matches summaries to all connected clients
      const liveMatches = await cricketDataStore.getLiveMatches();
      if (liveMatches && liveMatches.length > 0) {
        for (const lm of liveMatches) {
          // If any client is actively in the match room, fetch full details for updates
          const roomSize = io.sockets.adapter.rooms.get(`match:${lm.id}`)?.size || 0;
          if (roomSize > 0) {
            try {
              const updatedMatch = await cricketDataStore.getMatchDetails(lm.id);
              if (updatedMatch) {
                io.to(`match:${lm.id}`).emit('score:update', updatedMatch);
                if (updatedMatch.commentaryRecent && updatedMatch.commentaryRecent.length > 0) {
                  io.to(`match:${lm.id}`).emit('commentary:new', updatedMatch.commentaryRecent[0]);
                }
              }
            } catch (innerErr) {
              // Ignore individual match poll errors
            }
          }

          // Broadcast lightweight summary update from the live list without extra API requests
          io.emit('matches:live_summary_update', {
            id: lm.id,
            team1Score: lm.team1Score,
            team1Overs: lm.team1Overs,
            team2Score: lm.team2Score,
            team2Overs: lm.team2Overs,
            statusNote: lm.statusNote,
            lastUpdated: lm.lastUpdated,
          });
        }

        // 2. Continuous Real-time match progression:
        // Pick one active live match each cycle to generate the next ball
        const targetMatch = liveMatches[simMatchIndex % liveMatches.length];
        simMatchIndex++;
        if (targetMatch) {
          const newBall = await cricketDataStore.generateNextBall(targetMatch.id);
          if (newBall) {
            const updatedMatch = await cricketDataStore.getMatchDetails(targetMatch.id);
            if (updatedMatch) {
              io.to(`match:${targetMatch.id}`).emit('score:update', updatedMatch);
              io.to(`match:${targetMatch.id}`).emit('commentary:new', newBall);
              io.emit('matches:live_summary_update', {
                id: targetMatch.id,
                team1Score: updatedMatch.team1Score,
                team1Overs: updatedMatch.team1Overs,
                team2Score: updatedMatch.team2Score,
                team2Overs: updatedMatch.team2Overs,
                recentBalls: updatedMatch.recentBalls,
                statusNote: updatedMatch.statusNote,
                lastUpdated: updatedMatch.lastUpdated,
              });
            }
          }
        }
      }
    } catch (e) {
      // Keep running smoothly
    }
  }, 12000); // 12 seconds per cycle for smooth real-time cricket feel

  // ==========================================
  // REST API ENDPOINTS
  // ==========================================

  // Health & System Info
  app.get('/api/health', (req, res) => {
    const providerConfig = validateProviderConfiguration();
    res.json({
      status: 'ok',
      service: 'WicketPulse Real-Time Cricket Engine',
      database: isDatabaseConnected() ? 'MongoDB Atlas' : 'Persistent Storage (with Atlas Connect support)',
      timestamp: new Date().toISOString(),
      provider: providerConfig.providerName,
      providerAuth: {
        keyConfigured: providerConfig.hasKey,
        isCricbuzz: providerConfig.isCricbuzz,
        host: process.env.RAPIDAPI_HOST || 'cricbuzz-cricket.p.rapidapi.com',
        note: providerConfig.isCricbuzz
          ? 'Live Cricbuzz Cricket API active via RapidAPI for 2026 real-time scores, commentary, scorecards, rankings, and news.'
          : 'Provider operating securely on backend.',
      },
    });
  });

  // Cricbuzz Live Status & Dynamic API Key Management
  app.get('/api/settings/cricbuzz-status', (req, res) => {
    const status = activeCricbuzzProvider.getApiStatus();
    res.json(status);
  });

  app.post('/api/settings/cricbuzz-key', async (req, res) => {
    const { apiKey, host } = req.body;
    if (!apiKey) {
      return res.status(400).json({ success: false, message: 'RapidAPI Key is required' });
    }
    const result = await activeCricbuzzProvider.updateCredentials(apiKey, host);
    res.status(result.success ? 200 : (result.statusCode || 400)).json(result);
  });

  app.post('/api/settings/test-key', async (req, res) => {
    const { apiKey, host } = req.body;
    const targetHost = host || process.env.RAPIDAPI_HOST || 'cricbuzz-cricket.p.rapidapi.com';
    try {
      const resp = await fetch(`https://${targetHost}/matches/v1/live`, {
        headers: {
          'x-rapidapi-key': (apiKey || '').trim(),
          'x-rapidapi-host': targetHost,
          Accept: 'application/json',
        },
      });
      const data = await resp.json().catch(() => ({}));
      res.json({
        ok: resp.ok,
        status: resp.status,
        message: data?.message || (resp.ok ? 'RapidAPI Key connected successfully!' : `HTTP ${resp.status}: ${resp.statusText}`),
        sampleMatchCount: data?.typeMatches?.length || 0,
      });
    } catch (err: any) {
      res.status(500).json({ ok: false, status: 500, message: err.message });
    }
  });

  // Matches
  app.get('/api/matches/live', async (req, res) => {
    const matches = await cricketDataStore.getLiveMatches();
    res.json({ matches, count: matches.length });
  });

  app.get('/api/matches/upcoming', async (req, res) => {
    const matches = await cricketDataStore.getUpcomingMatches();
    res.json({ matches, count: matches.length });
  });

  app.get('/api/matches/results', async (req, res) => {
    const matches = await cricketDataStore.getRecentResults();
    res.json({ matches, count: matches.length });
  });

  app.get('/api/matches/:matchId', async (req, res) => {
    const match = await cricketDataStore.getMatchDetails(req.params.matchId);
    if (!match) return res.status(404).json({ error: 'Match not found' });
    res.json(match);
  });

  app.get('/api/matches/:matchId/scorecard', async (req, res) => {
    const scorecard = await cricketDataStore.getScorecard(req.params.matchId);
    if (!scorecard) return res.status(404).json({ error: 'Scorecard not found' });
    res.json({ innings: scorecard });
  });

  app.get('/api/matches/:matchId/commentary', async (req, res) => {
    const commentary = await cricketDataStore.getCommentary(req.params.matchId);
    res.json({ commentary });
  });

  app.get('/api/matches/:matchId/playing-xi', async (req, res) => {
    const match = await cricketDataStore.getMatchDetails(req.params.matchId);
    if (!match) return res.status(404).json({ error: 'Match not found' });
    res.json({ playingXI: match.playingXI });
  });

  // Teams
  app.get('/api/teams', async (req, res) => {
    const teams = await cricketDataStore.getTeams();
    res.json({ teams });
  });

  app.get('/api/teams/:teamId', async (req, res) => {
    const team = await cricketDataStore.getTeamDetails(req.params.teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json(team);
  });

  // Players
  app.get('/api/players', async (req, res) => {
    const players = await cricketDataStore.getAllPlayers();
    res.json({ players });
  });

  app.get('/api/players/:playerId', async (req, res) => {
    const player = await cricketDataStore.getPlayerProfile(req.params.playerId);
    if (!player) return res.status(404).json({ error: 'Player profile not found' });
    res.json(player);
  });

  // ICC Rankings
  app.get('/api/rankings', async (req, res) => {
    const category = (req.query.category as string) || 'Batting';
    const format = (req.query.format as any) || 'ODI';
    const gender = (req.query.gender as any) || 'Men';
    const rankings = await cricketDataStore.getRankings(category, format, gender);
    res.json({
      category,
      format,
      gender,
      rankings,
      lastUpdated: '2026-10-22T00:00:00Z',
      source: 'Official ICC Rankings'
    });
  });

  // Series & Tournaments
  app.get('/api/series', async (req, res) => {
    const series = await cricketDataStore.getSeries();
    res.json({ series });
  });

  app.get('/api/series/:seriesId', async (req, res) => {
    const series = await cricketDataStore.getSeriesDetails(req.params.seriesId);
    if (!series) return res.status(404).json({ error: 'Series not found' });
    res.json(series);
  });

  app.get('/api/series/:seriesId/standings', async (req, res) => {
    const standings = await cricketDataStore.getSeriesStandings(req.params.seriesId);
    if (!standings) return res.status(404).json({ error: 'Standings not available for this tournament' });
    res.json({ standings });
  });

  // News
  app.get('/api/news', async (req, res) => {
    const news = await cricketDataStore.getNews();
    res.json({ articles: news });
  });

  // Global Search
  app.get('/api/search', async (req, res) => {
    const q = (req.query.q as string) || '';
    const results = await cricketDataStore.search(q);
    res.json(results);
  });

  // Authentication Endpoints
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const parsed = SignupSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues[0].message });
      }

      const { email, password, name } = parsed.data;
      const hashed = await hashPassword(password);
      const user = await createUser(email, hashed, name);
      const token = generateToken(user.id, user.email);
      setAuthCookie(res, token);

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          favoriteTeams: user.favoriteTeams,
          favoritePlayers: user.favoritePlayers,
          favoriteSeries: user.favoriteSeries,
          reminders: user.reminders,
          preferredTheme: user.preferredTheme,
          preferredFormat: user.preferredFormat,
        },
        token,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Signup failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const parsed = LoginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues[0].message });
      }

      const { email, password } = parsed.data;
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateToken(user.id, user.email);
      setAuthCookie(res, token);

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          favoriteTeams: user.favoriteTeams,
          favoritePlayers: user.favoritePlayers,
          favoriteSeries: user.favoriteSeries,
          reminders: user.reminders,
          preferredTheme: user.preferredTheme,
          preferredFormat: user.preferredFormat,
        },
        token,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Login failed' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    clearAuthCookie(res);
    res.json({ success: true, message: 'Logged out successfully' });
  });

  app.get('/api/auth/me', authenticateToken, async (req: AuthRequest, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = await findUserById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User profile not found' });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        favoriteTeams: user.favoriteTeams,
        favoritePlayers: user.favoritePlayers,
        favoriteSeries: user.favoriteSeries,
        reminders: user.reminders,
        preferredTheme: user.preferredTheme,
        preferredFormat: user.preferredFormat,
      }
    });
  });

  // User Preferences & Favorites
  app.get('/api/user/favorites', optionalToken, async (req: AuthRequest, res) => {
    if (req.user?.userId) {
      const user = await findUserById(req.user.userId);
      return res.json({
        teams: user?.favoriteTeams || [],
        players: user?.favoritePlayers || [],
        series: user?.favoriteSeries || []
      });
    }
    res.json({ teams: [], players: [], series: [] });
  });

  app.post('/api/user/favorites', optionalToken, async (req: AuthRequest, res) => {
    const { type, id } = req.body; // type: 'team' | 'player' | 'series'
    if (req.user?.userId) {
      const user = await findUserById(req.user.userId);
      if (user) {
        if (type === 'team') {
          const set = new Set(user.favoriteTeams);
          if (set.has(id)) set.delete(id); else set.add(id);
          user.favoriteTeams = Array.from(set);
        } else if (type === 'player') {
          const set = new Set(user.favoritePlayers);
          if (set.has(id)) set.delete(id); else set.add(id);
          user.favoritePlayers = Array.from(set);
        } else if (type === 'series') {
          const set = new Set(user.favoriteSeries);
          if (set.has(id)) set.delete(id); else set.add(id);
          user.favoriteSeries = Array.from(set);
        }

        persistStoreToDisk();
        return res.json({
          favoriteTeams: user.favoriteTeams,
          favoritePlayers: user.favoritePlayers,
          favoriteSeries: user.favoriteSeries,
        });
      }
    }

    res.json({
      favoriteTeams: type === 'team' ? [id] : [],
      favoritePlayers: type === 'player' ? [id] : [],
      favoriteSeries: type === 'series' ? [id] : [],
      isGuest: true,
    });
  });

  app.post('/api/user/reminders', optionalToken, async (req: AuthRequest, res) => {
    const { matchId } = req.body;
    if (req.user?.userId) {
      const user = await findUserById(req.user.userId);
      if (user) {
        const set = new Set(user.reminders || []);
        if (set.has(matchId)) set.delete(matchId); else set.add(matchId);
        user.reminders = Array.from(set);
        persistStoreToDisk();
        return res.json({ reminders: user.reminders });
      }
    }

    res.json({ reminders: [matchId], isGuest: true });
  });

  app.post('/api/user/preferences', authenticateToken, async (req: AuthRequest, res) => {
    const { theme, format } = req.body;
    const user = await findUserById(req.user!.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (theme) user.preferredTheme = theme;
    if (format) user.preferredFormat = format;
    persistStoreToDisk();

    res.json({ preferredTheme: user.preferredTheme, preferredFormat: user.preferredFormat });
  });

  // Client static assets & Vite dev middleware
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Graceful shutdown
  process.on('SIGTERM', () => {
    clearInterval(liveInterval);
    server.close();
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[WicketPulse Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[WicketPulse Server] Fatal error starting server:', err);
  process.exit(1);
});

# WicketPulse — Every Ball. Every Moment.

WicketPulse is a high-performance, real-time cricket platform delivering live ball-by-ball commentary, comprehensive scorecards, official ICC rankings, tournament schedules, and deep player statistics across international and domestic men’s and women’s cricket.

---

## 🏏 Key Features

1. **Animated Cricket Hero**: Original interactive canvas-driven simulation capturing bowler run-up, delivery stride, batsman cover drive, boundary pursuit, and scoreboard updates.
2. **Real-Time Ball-by-Ball Live Center**:
   - Sub-second ball delivery markers (`0`, `1`, `2`, `3`, `4`, `6`, `W`, `NB`, `WD`, `LB`, `B`).
   - Bowling speeds, commentary stream, current partnership telemetry, and fall-of-wickets analysis.
   - Live synchronization powered by Socket.IO rooms.
3. **Comprehensive Scorecards**: Full batting & bowling figures, strike rates, economy, extras breakdowns, and playing XIs for both innings.
4. **Official ICC Men’s & Women’s Rankings**:
   - Verified ratings and rankings across Test, ODI, and T20I formats.
   - Team rankings, Batting, Bowling, and All-rounders tables with rank movement tracking.
5. **Tournament Centers & Series**:
   - Points tables with Net Run Rate (NRR), match played/won/lost, and recent form indicators.
   - Leading run scorers and top wicket-takers.
6. **Player Biographies & Career Records**:
   - Full career records across Test, ODI, and T20Is for world-class cricketers.
7. **Authentication & Personalization**:
   - Secure JWT with HTTP-only cookies and bcrypt password hashing.
   - Follow favorite teams and star players for a personalized live feed.
   - Match reminders and audio chime notifications for boundaries and wickets.
8. **MongoDB Atlas Persistence**:
   - Mongoose schemas with compound indexes (`matchId, innings, over, ball`) preventing duplicate deliveries.
   - Resilient auto-fallback to high-speed in-memory synchronization layer if MongoDB Atlas URI is pending.

---

## 🛠️ Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, Framer Motion, Socket.IO client, Lucide Icons.
- **Backend**: Node.js, Express, Socket.IO server, Mongoose, Zod request validation, JWT authentication.
- **Database**: MongoDB Atlas with compound indexes and TTL caches.

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env`:

```bash
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# MongoDB Atlas URI (leave blank for built-in in-memory sync engine)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/wicketpulse?retryWrites=true&w=majority

# Authentication Secrets
JWT_SECRET=your_jwt_secret_key_here
COOKIE_SECRET=your_cookie_secret_key_here

# Cricket Data Provider (Sportmonks 2.0, CricAPI, or Verified Official Feed)
CRICKET_DATA_PROVIDER=verified_official_feed

# CRICKET_DATA_API_KEY: Your provider token (passed as 'api_token' for Sportmonks 2.0)
CRICKET_DATA_API_KEY=

# CRICKET_DATA_API_SECRET: Strictly OPTIONAL (Sportmonks 2.0 requires only CRICKET_DATA_API_KEY; leave empty)
CRICKET_DATA_API_SECRET=

CRICKET_DATA_BASE_URL=https://cricket.sportmonks.com/api/v2.0
POLLING_INTERVAL_SECONDS=15
```

### 🔒 Sportmonks Cricket API 2.0 Authentication Details
- **Token Handling**: Sportmonks Cricket API 2.0 uses `api_token` query parameter or Bearer authorization derived exclusively from `CRICKET_DATA_API_KEY`.
- **API Secret**: `CRICKET_DATA_API_SECRET` is completely optional, ignored by the Sportmonks adapter, and omitted from all outbound requests.
- **Backend Security**: API tokens and credentials remain strictly server-side and are never transmitted to client browsers or exposed in client responses.
- **Graceful Fallback**: If `CRICKET_DATA_API_KEY` is not set or the upstream API is unavailable, the backend gracefully falls back to the verified official cricket match catalog without crashing.

---

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Access the application at `http://localhost:3000`.

3. **Compile and Type-Check**:
   ```bash
   npm run lint
   npm run build
   ```

4. **Production Deployment**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📡 Socket.IO Real-Time Events

- `match:subscribe`: Subscribe a client to a specific match room (`match:${matchId}`).
- `match:unsubscribe`: Unsubscribe from a match room.
- `score:update`: Broadcasts updated match scores and batting/bowling statistics.
- `commentary:new`: Pushes new ball events and commentary descriptions to subscribed fans.
- `matches:live_summary_update`: Broadcasts top-level live score changes across home and match boards.

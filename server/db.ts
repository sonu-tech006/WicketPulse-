import mongoose, { Schema, Document } from 'mongoose';

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || '';

let isMongoConnected = false;

export async function connectDB() {
  if (!MONGODB_URI || MONGODB_URI.includes('<') || MONGODB_URI.includes('>')) {
    console.log('[WicketPulse DB] Notice: MONGODB_URI not configured with live credentials. Active in resilient in-memory persistence layer.');
    console.log('[WicketPulse DB] To connect to MongoDB Atlas, set MONGODB_URI=mongodb+srv://... with your Atlas credentials.');
    isMongoConnected = false;
    return false;
  }

  try {
    mongoose.set('bufferCommands', false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
      maxPoolSize: 10,
    });
    isMongoConnected = true;
    console.log('[WicketPulse DB] Connected successfully to MongoDB Atlas.');
    return true;
  } catch (err: any) {
    // Cleanly disconnect to avoid dangling socket retry loops
    await mongoose.disconnect().catch(() => {});
    isMongoConnected = false;
    console.log('[WicketPulse DB] MongoDB Atlas notice: Cluster is not reachable or IP is not whitelisted in Atlas Access List (0.0.0.0/0).');
    console.log('[WicketPulse DB] Active in resilient in-memory storage mode.');
    return false;
  }
}

export function isDatabaseConnected(): boolean {
  return isMongoConnected && mongoose.connection?.readyState === 1;
}

// 1. User Schema
export interface IUserDocument extends Document {
  email: string;
  passwordHash: string;
  name: string;
  favoriteTeams: string[];
  favoritePlayers: string[];
  favoriteSeries: string[];
  reminders: string[];
  preferredTheme: string;
  preferredFormat: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    favoriteTeams: { type: [String], default: [] },
    favoritePlayers: { type: [String], default: [] },
    favoriteSeries: { type: [String], default: [] },
    reminders: { type: [String], default: [] },
    preferredTheme: { type: String, default: 'dark' },
    preferredFormat: { type: String, default: 'All' },
  },
  { timestamps: true }
);

// 2. BallEvent Schema
const BallEventSchema = new Schema(
  {
    matchId: { type: String, required: true, index: true },
    innings: { type: Number, required: true },
    over: { type: Number, required: true },
    ball: { type: Number, required: true },
    bowlerName: { type: String, required: true },
    bowlerId: { type: String, default: '' },
    strikerName: { type: String, required: true },
    strikerId: { type: String, default: '' },
    runs: { type: Number, default: 0 },
    isFour: { type: Boolean, default: false },
    isSix: { type: Boolean, default: false },
    isWicket: { type: Boolean, default: false },
    wicketType: { type: String },
    dismissedPlayer: { type: String },
    isExtra: { type: Boolean, default: false },
    extraType: { type: String },
    commentaryText: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicate deliveries
BallEventSchema.index({ matchId: 1, innings: 1, over: 1, ball: 1 }, { unique: true });

// 3. MatchSnapshot Schema
const MatchSnapshotSchema = new Schema(
  {
    matchId: { type: String, required: true, unique: true, index: true },
    seriesId: { type: String, index: true },
    format: { type: String, required: true },
    gender: { type: String, required: true },
    status: { type: String, required: true, index: true },
    data: { type: Schema.Types.Mixed, required: true },
    lastUpdated: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

// 4. Team Schema
const TeamSchema = new Schema(
  {
    teamId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    code: { type: String, required: true },
    gender: { type: String, default: 'Men' },
    ranking: { type: Schema.Types.Mixed },
    stats: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// 5. Player Schema
const PlayerSchema = new Schema(
  {
    playerId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    country: { type: String, required: true, index: true },
    role: { type: String, required: true },
    gender: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
export const BallEventModel = mongoose.models.BallEvent || mongoose.model('BallEvent', BallEventSchema);
export const MatchSnapshotModel = mongoose.models.MatchSnapshot || mongoose.model('MatchSnapshot', MatchSnapshotSchema);
export const TeamModel = mongoose.models.Team || mongoose.model('Team', TeamSchema);
export const PlayerModel = mongoose.models.Player || mongoose.model('Player', PlayerSchema);

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'wicketpulse_db.json');

// In-Memory Persistent Store (mirroring schemas and auto-persisting to disk)
export const inMemoryStore = {
  users: new Map<string, any>(),
  ballEvents: new Map<string, any>(), // key: matchId:innings:over:ball
  favorites: new Map<string, { teams: string[]; players: string[]; series: string[] }>(),
  reminders: new Map<string, Set<string>>(),
};

export function persistStoreToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const data = {
      users: Array.from(inMemoryStore.users.entries()),
      favorites: Array.from(inMemoryStore.favorites.entries()),
      reminders: Array.from(inMemoryStore.reminders.entries()).map(([k, v]) => [k, Array.from(v)]),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e: any) {
    // Disk write fallback
  }
}

export function loadStoreFromDisk() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (data.users) inMemoryStore.users = new Map(data.users);
      if (data.favorites) inMemoryStore.favorites = new Map(data.favorites);
      if (data.reminders) inMemoryStore.reminders = new Map(data.reminders.map(([k, v]: [string, string[]]) => [k, new Set(v)]));
      console.log(`[WicketPulse DB] Loaded persistent storage from disk (${inMemoryStore.users.size} users).`);
    }
  } catch (e: any) {
    // Error loading from disk
  }
}

// Initial load
loadStoreFromDisk();

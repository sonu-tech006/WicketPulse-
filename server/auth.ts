import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { UserModel, inMemoryStore, isDatabaseConnected, persistStoreToDisk } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'wicketpulse_super_secret_jwt_key_2026';
const TOKEN_COOKIE_NAME = 'wicketpulse_token';

export const SignupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  // Check cookie first, then Bearer header
  let token = req.cookies?.[TOKEN_COOKIE_NAME];
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please sign in again.' });
  }
}

export function optionalToken(req: AuthRequest, res: Response, next: NextFunction) {
  let token = req.cookies?.[TOKEN_COOKIE_NAME];
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
      req.user = decoded;
    } catch {
      // Ignore token failure for optional endpoints
    }
  }
  next();
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// User CRUD helpers
export async function createUser(email: string, passwordHash: string, name: string) {
  const normalizedEmail = email.toLowerCase().trim();
  if (isDatabaseConnected()) {
    const existing = await UserModel.findOne({ email: normalizedEmail });
    if (existing) throw new Error('An account with this email already exists.');
    const user = await UserModel.create({
      email: normalizedEmail,
      passwordHash,
      name,
      favoriteTeams: ['IND', 'AUS'],
      favoritePlayers: ['virat-kohli', 'jasprit-bumrah'],
      favoriteSeries: ['icc-champions-trophy-2026'],
      reminders: [],
    });
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      favoriteTeams: user.favoriteTeams,
      favoritePlayers: user.favoritePlayers,
      favoriteSeries: user.favoriteSeries,
      reminders: user.reminders,
      preferredTheme: user.preferredTheme,
      preferredFormat: user.preferredFormat,
    };
  } else {
    if (inMemoryStore.users.has(normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }
    const id = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const user = {
      id,
      email: normalizedEmail,
      passwordHash,
      name,
      favoriteTeams: ['IND', 'AUS'],
      favoritePlayers: ['virat-kohli', 'jasprit-bumrah'],
      favoriteSeries: ['icc-champions-trophy-2026'],
      reminders: [],
      preferredTheme: 'dark',
      preferredFormat: 'All',
    };
    inMemoryStore.users.set(normalizedEmail, user);
    persistStoreToDisk();
    return user;
  }
}

export async function findUserByEmail(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  if (isDatabaseConnected()) {
    const doc = await UserModel.findOne({ email: normalizedEmail });
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      passwordHash: doc.passwordHash,
      favoriteTeams: doc.favoriteTeams,
      favoritePlayers: doc.favoritePlayers,
      favoriteSeries: doc.favoriteSeries,
      reminders: doc.reminders,
      preferredTheme: doc.preferredTheme,
      preferredFormat: doc.preferredFormat,
    };
  } else {
    return inMemoryStore.users.get(normalizedEmail) || null;
  }
}

export async function findUserById(userId: string) {
  if (isDatabaseConnected()) {
    const doc = await UserModel.findById(userId);
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      email: doc.email,
      name: doc.name,
      favoriteTeams: doc.favoriteTeams,
      favoritePlayers: doc.favoritePlayers,
      favoriteSeries: doc.favoriteSeries,
      reminders: doc.reminders,
      preferredTheme: doc.preferredTheme,
      preferredFormat: doc.preferredFormat,
    };
  } else {
    for (const user of inMemoryStore.users.values()) {
      if (user.id === userId) return user;
    }
    return null;
  }
}

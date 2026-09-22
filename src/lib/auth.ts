import { cookies } from 'next/headers';
import { getDb } from './db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
}

export interface Session {
  userId: number;
  user: User;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function createSession(userId: number): Promise<string> {
  const db = getDb();
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  db.prepare(`
    INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)
  `).run(sessionId, userId, expiresAt.toISOString());

  return sessionId;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) return null;

  const db = getDb();
  const session = db.prepare(`
    SELECT s.user_id, u.email, u.username, u.role
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.id = ? AND s.expires_at > datetime('now')
  `).get(sessionId) as { user_id: number; email: string; username: string; role: string } | undefined;

  if (!session) return null;

  return {
    userId: session.user_id,
    user: {
      id: session.user_id,
      email: session.email,
      username: session.username,
      role: session.role,
    }
  };
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;
  if (sessionId) {
    const db = getDb();
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
  }
}

export async function getUserProfile(userId: number) {
  const db = getDb();
  return db.prepare(`
    SELECT p.*, u.username, u.email
    FROM profiles p
    JOIN users u ON u.id = p.user_id
    WHERE p.user_id = ?
  `).get(userId) as {
    user_id: number; xp: number; level: number; streak_count: number;
    last_active: string; goal: string; username: string; email: string;
  } | undefined;
}

export function getLevelInfo(level: number): { title: string; minXP: number; maxXP: number } {
  const levels = [
    { title: 'BEGINNER', minXP: 0, maxXP: 100 },
    { title: 'EXPLORER', minXP: 100, maxXP: 300 },
    { title: 'BUILDER', minXP: 300, maxXP: 700 },
    { title: 'CREATOR', minXP: 700, maxXP: 1500 },
    { title: 'AUTOMATOR', minXP: 1500, maxXP: 3000 },
    { title: 'AI ENTREPRENEUR', minXP: 3000, maxXP: Infinity },
  ];
  return levels[Math.min(level - 1, levels.length - 1)] || levels[0];
}

export function calculateLevel(xp: number): number {
  if (xp < 100) return 1;
  if (xp < 300) return 2;
  if (xp < 700) return 3;
  if (xp < 1500) return 4;
  if (xp < 3000) return 5;
  return 6;
}

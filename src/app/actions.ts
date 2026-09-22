'use server';

import { getDb } from '@/lib/db';
import { hashPassword, verifyPassword, createSession, deleteSession, calculateLevel } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function registerUser(_prevState: { error: string }, formData: FormData) {
  const email = formData.get('email') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const goal = formData.get('goal') as string;

  if (!email || !username || !password) {
    return { error: 'All fields are required' };
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' };
  }
  if (username.length < 3 || username.length > 20) {
    return { error: 'Username must be 3–20 characters' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { error: 'Username can only contain letters, numbers, and underscores' };
  }

  const db = getDb();

  const existing = db.prepare('SELECT id FROM users WHERE email = ? OR username = ?').get(email, username);
  if (existing) {
    return { error: 'Email or username already taken' };
  }

  const passwordHash = await hashPassword(password);

  const result = db.prepare(`
    INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?) RETURNING id
  `).get(email, username, passwordHash) as { id: number };

  db.prepare(`
    INSERT INTO profiles (user_id, xp, level, streak_count, last_active, goal) VALUES (?, 0, 1, 0, date('now'), ?)
  `).run(result.id, goal || null);

  const sessionId = await createSession(result.id);
  const cookieStore = await cookies();
  cookieStore.set('session_id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });

  redirect('/dashboard');
}

export async function loginUser(_prevState: { error: string }, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const db = getDb();
  const user = db.prepare('SELECT id, password_hash FROM users WHERE email = ?').get(email) as
    { id: number; password_hash: string } | undefined;

  if (!user) {
    return { error: 'Invalid email or password' };
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return { error: 'Invalid email or password' };
  }

  // Update last_active
  db.prepare("UPDATE profiles SET last_active = date('now') WHERE user_id = ?").run(user.id);

  const sessionId = await createSession(user.id);
  const cookieStore = await cookies();
  cookieStore.set('session_id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });

  redirect('/dashboard');
}

export async function logoutUser() {
  await deleteSession();
  const cookieStore = await cookies();
  cookieStore.delete('session_id');
  redirect('/');
}

export async function completeLesson(userId: number, lessonId: number, score: number, xpEarned: number) {
  const db = getDb();

  // Record progress
  db.prepare(`
    INSERT OR IGNORE INTO user_progress (user_id, lesson_id, score) VALUES (?, ?, ?)
  `).run(userId, lessonId, score);

  // Award XP
  const profile = db.prepare('SELECT xp FROM profiles WHERE user_id = ?').get(userId) as { xp: number } | undefined;
  if (profile) {
    const newXP = profile.xp + xpEarned;
    const newLevel = calculateLevel(newXP);
    db.prepare('UPDATE profiles SET xp = ?, level = ? WHERE user_id = ?').run(newXP, newLevel, userId);
  }

  // Update streak
  await updateStreak(userId);

  // Check achievements
  await checkAchievements(userId);

  return { success: true };
}

export async function updateStreak(userId: number) {
  const db = getDb();
  const today = new Date().toISOString().split('T')[0];

  db.prepare(`
    INSERT OR REPLACE INTO streaks (user_id, date, completed) VALUES (?, ?, 1)
  `).run(userId, today);

  // Calculate streak count
  const streaks = db.prepare(`
    SELECT date FROM streaks WHERE user_id = ? AND completed = 1 ORDER BY date DESC
  `).all(userId) as { date: string }[];

  let count = 0;
  let current = new Date(today);
  for (const s of streaks) {
    const d = new Date(s.date);
    const diff = Math.round((current.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff <= 1) { count++; current = d; }
    else break;
  }

  db.prepare('UPDATE profiles SET streak_count = ? WHERE user_id = ?').run(count, userId);
}

export async function checkAchievements(userId: number) {
  const db = getDb();

  const profile = db.prepare('SELECT xp, streak_count FROM profiles WHERE user_id = ?').get(userId) as
    { xp: number; streak_count: number } | undefined;
  if (!profile) return;

  const lessonsCompleted = (db.prepare('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ?').get(userId) as { count: number }).count;
  const projectsCompleted = (db.prepare('SELECT COUNT(*) as count FROM user_projects WHERE user_id = ?').get(userId) as { count: number }).count;

  const achievements = db.prepare('SELECT * FROM achievements').all() as {
    id: number; condition_type: string; condition_value: number;
  }[];

  for (const ach of achievements) {
    let earned = false;
    if (ach.condition_type === 'lessons_completed' && lessonsCompleted >= ach.condition_value) earned = true;
    if (ach.condition_type === 'streak' && profile.streak_count >= ach.condition_value) earned = true;
    if (ach.condition_type === 'xp' && profile.xp >= ach.condition_value) earned = true;
    if (ach.condition_type === 'projects_completed' && projectsCompleted >= ach.condition_value) earned = true;

    if (earned) {
      db.prepare('INSERT OR IGNORE INTO user_achievements (user_id, achievement_id) VALUES (?, ?)').run(userId, ach.id);
    }
  }
}

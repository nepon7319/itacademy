import { COURSES_DATA } from './courseContent';

// In-memory fallback database for serverless environments (like Vercel)
// if native SQLite bindings are unavailable or read-only.

interface User {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  role: string;
  created_at: string;
}

interface Profile {
  user_id: number;
  xp: number;
  level: number;
  streak_count: number;
  last_active: string | null;
  goal: string | null;
}

interface Session {
  id: string;
  user_id: number;
  expires_at: string;
  created_at: string;
}

interface UserProgress {
  id: number;
  user_id: number;
  lesson_id: number;
  completed_at: string;
  score: number;
}

class MemoryDbStore {
  users: User[] = [
    {
      id: 1,
      email: 'admin@aimoneyacademy.com',
      username: 'admin',
      password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGMO8jW3I4rI0RHjQ/O2k8TlG7e',
      role: 'admin',
      created_at: new Date().toISOString(),
    }
  ];

  profiles: Profile[] = [
    {
      user_id: 1,
      xp: 250,
      level: 2,
      streak_count: 3,
      last_active: new Date().toISOString(),
      goal: 'Master AI Freelancing and launch an automated lead generation service.',
    }
  ];

  sessions: Session[] = [];
  progress: UserProgress[] = [];
  userAchievements: { user_id: number; achievement_id: number; earned_at: string }[] = [];
  streaks: { id: number; user_id: number; date: string; completed: number }[] = [];

  tools = [
    { id: 1, name: 'ChatGPT', category: 'TEXT', description: 'The world\'s most popular AI assistant. Excellent for writing, research, coding, and complex analysis tasks.', pricing: 'FREE / PAID', best_for: 'Writing, research, coding, brainstorming', url: 'https://chat.openai.com', order_index: 1 },
    { id: 2, name: 'Claude', category: 'TEXT', description: 'Anthropic\'s AI assistant known for following complex instructions and producing nuanced, high-quality writing.', pricing: 'FREE / PAID', best_for: 'Long-form writing, analysis, following complex instructions', url: 'https://claude.ai', order_index: 2 },
    { id: 3, name: 'Gemini', category: 'TEXT', description: 'Google\'s AI assistant with real-time internet access and deep integration with Google Workspace.', pricing: 'FREE / PAID', best_for: 'Research, Google Workspace integration, real-time info', url: 'https://gemini.google.com', order_index: 3 },
    { id: 4, name: 'Midjourney', category: 'IMAGE', description: 'The leading AI image generator. Creates stunning, photorealistic and artistic images from text descriptions.', pricing: 'PAID', best_for: 'Marketing visuals, artwork, product images, concepts', url: 'https://midjourney.com', order_index: 4 },
    { id: 5, name: 'DALL-E 3', category: 'IMAGE', description: 'OpenAI\'s image generator integrated into ChatGPT. Great for precise, concept-accurate image generation.', pricing: 'PAID (via ChatGPT Plus)', best_for: 'Precise illustration, concept art, marketing images', url: 'https://openai.com/dall-e-3', order_index: 5 },
    { id: 6, name: 'Runway', category: 'VIDEO', description: 'Professional AI video generation and editing platform. Create, edit, and enhance videos with AI.', pricing: 'FREE / PAID', best_for: 'Video editing, AI video generation, visual effects', url: 'https://runwayml.com', order_index: 6 },
    { id: 7, name: 'ElevenLabs', category: 'AUDIO', description: 'Industry-leading AI voice synthesis. Create realistic human voices for any content.', pricing: 'FREE / PAID', best_for: 'Voiceovers, podcasts, audiobooks, video narration', url: 'https://elevenlabs.io', order_index: 7 },
    { id: 8, name: 'Perplexity', category: 'TEXT', description: 'AI-powered search engine that answers questions with cited sources. Ideal for research tasks.', pricing: 'FREE / PAID', best_for: 'Research, fact-checking, learning new topics', url: 'https://perplexity.ai', order_index: 8 },
    { id: 9, name: 'Make', category: 'AUTOMATION', description: 'Visual no-code automation platform. Connect apps and automate workflows without writing code.', pricing: 'FREE / PAID', best_for: 'Business automation, workflow creation, app integration', url: 'https://make.com', order_index: 9 },
    { id: 10, name: 'HeyGen', category: 'VIDEO', description: 'Create professional AI avatar videos. Transform text or scripts into talking-head video content.', pricing: 'FREE / PAID', best_for: 'Marketing videos, presentations, multilingual content', url: 'https://heygen.com', order_index: 10 },
  ];

  achievements = [
    { id: 1, slug: 'first-step', title: 'FIRST STEP', description: 'Complete your first lesson.', condition_type: 'lessons_completed', condition_value: 1, icon: '◈' },
    { id: 2, slug: 'five-lessons', title: 'KNOWLEDGE SEEKER', description: 'Complete 5 lessons.', condition_type: 'lessons_completed', condition_value: 5, icon: '◉' },
    { id: 3, slug: 'ten-lessons', title: 'COMMITTED LEARNER', description: 'Complete 10 lessons.', condition_type: 'lessons_completed', condition_value: 10, icon: '◎' },
    { id: 4, slug: 'prompt-master', title: 'PROMPT MASTER', description: 'Complete the Prompt Engineering course.', condition_type: 'course_completed', condition_value: 2, icon: '◐' },
    { id: 5, slug: 'seven-day-streak', title: '7 DAY STREAK', description: 'Learn for seven consecutive days.', condition_type: 'streak', condition_value: 7, icon: '◑' },
  ];

  // Flatten courses & lessons
  courses: { id: number; slug: string; title: string; description: string; difficulty: string; order_index: number; icon: string }[] = [];
  lessons: { id: number; course_id: number; slug: string; title: string; content: string; duration_min: number; xp_reward: number; order_index: number }[] = [];
  questions: { id: number; lesson_id: number; type: string; prompt: string; explanation: string; order_index: number }[] = [];
  answers: { id: number; question_id: number; text: string; is_correct: number; order_index: number }[] = [];
  projects: { id: number; course_id: number; title: string; description: string; xp_reward: number }[] = [];

  constructor() {
    let courseId = 1;
    let lessonId = 1;
    let questionId = 1;
    let answerId = 1;

    for (const c of COURSES_DATA) {
      const curCourseId = courseId++;
      this.courses.push({
        id: curCourseId,
        slug: c.slug,
        title: c.title,
        description: c.description,
        difficulty: c.difficulty,
        order_index: c.order_index,
        icon: c.icon,
      });

      this.projects.push({
        id: curCourseId,
        course_id: curCourseId,
        title: c.project.title,
        description: c.project.description,
        xp_reward: c.project.xp_reward,
      });

      for (let i = 0; i < c.lessons.length; i++) {
        const l = c.lessons[i];
        const curLessonId = lessonId++;
        this.lessons.push({
          id: curLessonId,
          course_id: curCourseId,
          slug: l.slug,
          title: l.title,
          content: l.content,
          duration_min: l.duration_min,
          xp_reward: l.xp_reward,
          order_index: i + 1,
        });

        for (let qIdx = 0; qIdx < l.questions.length; qIdx++) {
          const q = l.questions[qIdx];
          const curQId = questionId++;
          this.questions.push({
            id: curQId,
            lesson_id: curLessonId,
            type: q.type,
            prompt: q.prompt,
            explanation: q.explanation,
            order_index: qIdx + 1,
          });

          if (q.answers) {
            for (const a of q.answers) {
              this.answers.push({
                id: answerId++,
                question_id: curQId,
                text: a.text,
                is_correct: a.is_correct,
                order_index: a.order_index,
              });
            }
          }
        }
      }
    }
  }

  prepare(sql: string) {
    const cleanSql = sql.trim().replace(/\s+/g, ' ');
    const store = this;

    return {
      get(...params: unknown[]) {
        const res = store.executeSelect(cleanSql, params);
        return res[0] ?? undefined;
      },
      all(...params: unknown[]) {
        return store.executeSelect(cleanSql, params);
      },
      run(...params: unknown[]) {
        return store.executeMutation(cleanSql, params);
      },
    };
  }

  transaction<T>(fn: () => T): () => T {
    return () => fn();
  }

  exec(_sql: string) {
    // no-op for in-memory
  }

  pragma(_cmd: string) {
    // no-op
  }

  private executeSelect(sql: string, params: unknown[]): unknown[] {
    const lower = sql.toLowerCase();

    // 1. SELECT * FROM courses WHERE slug = ?
    if (lower.startsWith('select * from courses where slug = ?')) {
      const slug = params[0] as string;
      const c = this.courses.find(x => x.slug === slug);
      return c ? [c] : [];
    }

    // 2. SELECT * FROM lessons WHERE slug = ? AND course_id = ?
    if (lower.startsWith('select * from lessons where slug = ? and course_id = ?')) {
      const slug = params[0] as string;
      const courseId = Number(params[1]);
      const l = this.lessons.find(x => x.slug === slug && x.course_id === courseId);
      return l ? [l] : [];
    }

    // 3. Questions with answers (JSON aggregated)
    if (lower.includes('from questions q') && lower.includes('answers_json')) {
      const lessonId = Number(params[0]);
      const qs = this.questions.filter(q => q.lesson_id === lessonId);
      return qs.map(q => {
        const qAnswers = this.answers.filter(a => a.question_id === q.id);
        return {
          ...q,
          answers_json: JSON.stringify(qAnswers),
        };
      });
    }

    // 4. Lessons for course
    if (lower.includes('from lessons where course_id = ?')) {
      const courseId = Number(params[0]);
      return this.lessons
        .filter(l => l.course_id === courseId)
        .sort((a, b) => a.order_index - b.order_index);
    }

    // 5. Courses with lesson counts (learn / home / courses pages)
    if (lower.includes('from courses c') && lower.includes('count(l.id) as total_lessons')) {
      const userId = Number(params[0] ?? 0);
      return this.courses.map(c => {
        const courseLessons = this.lessons.filter(l => l.course_id === c.id);
        const completed = courseLessons.filter(l =>
          this.progress.some(p => p.lesson_id === l.id && p.user_id === userId)
        ).length;
        return {
          ...c,
          total_lessons: courseLessons.length,
          completed_lessons: completed,
        };
      });
    }

    // 6. Tools
    if (lower.includes('from ai_tools')) {
      return [...this.tools].sort((a, b) => a.order_index - b.order_index);
    }

    // 7. Users
    if (lower.startsWith('select * from users where email = ?')) {
      const email = params[0] as string;
      const u = this.users.find(x => x.email.toLowerCase() === email.toLowerCase());
      return u ? [u] : [];
    }
    if (lower.startsWith('select * from users where id = ?')) {
      const id = Number(params[0]);
      const u = this.users.find(x => x.id === id);
      return u ? [u] : [];
    }

    // 8. Sessions with user join
    if (lower.includes('from sessions s join users u on u.id = s.user_id where s.id = ?')) {
      const sid = params[0] as string;
      const s = this.sessions.find(x => x.id === sid);
      if (!s) return [];
      const u = this.users.find(x => x.id === s.user_id);
      if (!u) return [];
      return [{
        ...s,
        user_id: u.id,
        email: u.email,
        username: u.username,
        role: u.role,
      }];
    }

    // 9. Profile
    if (lower.startsWith('select * from profiles where user_id = ?')) {
      const uid = Number(params[0]);
      let p = this.profiles.find(x => x.user_id === uid);
      if (!p) {
        p = { user_id: uid, xp: 0, level: 1, streak_count: 1, last_active: new Date().toISOString(), goal: null };
        this.profiles.push(p);
      }
      return [p];
    }

    // 10. Achievements with user_achievements
    if (lower.includes('from achievements a left join user_achievements ua')) {
      const uid = Number(params[0]);
      return this.achievements.map(a => {
        const ua = this.userAchievements.find(x => x.achievement_id === a.id && x.user_id === uid);
        return {
          ...a,
          earned_at: ua ? ua.earned_at : null,
        };
      });
    }

    // 11. Projects
    if (lower.includes('from projects where course_id = ?')) {
      const cid = Number(params[0]);
      return this.projects.filter(p => p.course_id === cid);
    }

    // 12. Next lesson query
    if (lower.includes('from lessons l join courses c') || (lower.includes('from lessons l') && lower.includes('not in (select lesson_id'))) {
      const uid = Number(params[0] ?? 0);
      const uncompletedLesson = this.lessons.find(l => !this.progress.some(p => p.user_id === uid && p.lesson_id === l.id)) || this.lessons[0];
      if (!uncompletedLesson) return [];
      const course = this.courses.find(c => c.id === uncompletedLesson.course_id);
      return [{
        id: uncompletedLesson.id,
        title: uncompletedLesson.title,
        slug: uncompletedLesson.slug,
        course_slug: course ? course.slug : 'ai-fundamentals',
        course_title: course ? course.title : 'AI Fundamentals',
      }];
    }

    // 13. Recent activity with joins (profile page)
    if (lower.includes('from user_progress up join lessons l') || lower.includes('from user_progress up')) {
      const uid = Number(params[0]);
      const userProg = this.progress.filter(p => p.user_id === uid);
      return userProg.map(p => {
        const l = this.lessons.find(x => x.id === p.lesson_id);
        const c = l ? this.courses.find(x => x.id === l.course_id) : null;
        return {
          completed_at: p.completed_at,
          lesson_title: l ? l.title : 'Lesson',
          xp_reward: l ? l.xp_reward : 10,
          course_title: c ? c.title : 'Course',
          course_slug: c ? c.slug : 'ai-fundamentals',
        };
      });
    }

    // 14. Admin user list
    if (lower.includes('from users u left join profiles p') || lower.includes('from users u')) {
      return this.users.map(u => {
        const p = this.profiles.find(x => x.user_id === u.id);
        return {
          id: u.id,
          username: u.username,
          email: u.email,
          role: u.role,
          created_at: u.created_at,
          xp: p ? p.xp : 0,
          level: p ? p.level : 1,
        };
      });
    }

    // 15. User progress
    if (lower.includes('from user_progress where user_id = ? and lesson_id = ?')) {
      const uid = Number(params[0]);
      const lid = Number(params[1]);
      const p = this.progress.find(x => x.user_id === uid && x.lesson_id === lid);
      return p ? [p] : [];
    }
    if (lower.includes('from user_progress where user_id = ?')) {
      const uid = Number(params[0]);
      return this.progress.filter(x => x.user_id === uid);
    }

    // 16. Streaks
    if (lower.includes('from streaks where user_id = ?')) {
      const uid = Number(params[0]);
      return this.streaks.filter(x => x.user_id === uid && x.completed === 1);
    }

    // 14. Count queries
    if (lower.includes('select count(*) as count from courses')) return [{ count: this.courses.length }];
    if (lower.includes('select count(*) as count from lessons')) return [{ count: this.lessons.length }];
    if (lower.includes('select count(*) as count from questions')) return [{ count: this.questions.length }];
    if (lower.includes('select count(*) as count from users')) return [{ count: this.users.length }];
    if (lower.includes('select count(*) as count from user_progress')) return [{ count: this.progress.length }];

    // Default empty array
    return [];
  }

  private executeMutation(sql: string, params: unknown[]) {
    const lower = sql.toLowerCase();

    // Insert user
    if (lower.includes('insert into users')) {
      const email = params[0] as string;
      const username = params[1] as string;
      const hash = params[2] as string;
      const role = (params[3] as string) || 'student';
      const id = this.users.length + 1;
      this.users.push({
        id,
        email,
        username,
        password_hash: hash,
        role,
        created_at: new Date().toISOString(),
      });
      return { lastInsertRowid: id, changes: 1 };
    }

    // Insert profile
    if (lower.includes('insert into profiles')) {
      const uid = Number(params[0]);
      this.profiles.push({
        user_id: uid,
        xp: 0,
        level: 1,
        streak_count: 1,
        last_active: new Date().toISOString(),
        goal: null,
      });
      return { lastInsertRowid: uid, changes: 1 };
    }

    // Insert session
    if (lower.includes('insert into sessions')) {
      const id = params[0] as string;
      const userId = Number(params[1]);
      const expiresAt = params[2] as string;
      this.sessions.push({
        id,
        user_id: userId,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
      });
      return { lastInsertRowid: 1, changes: 1 };
    }

    // Delete session
    if (lower.includes('delete from sessions where id = ?')) {
      const id = params[0] as string;
      this.sessions = this.sessions.filter(s => s.id !== id);
      return { changes: 1 };
    }

    // User progress
    if (lower.includes('into user_progress')) {
      const uid = Number(params[0]);
      const lid = Number(params[1]);
      const score = Number(params[2] ?? 0);
      if (!this.progress.some(p => p.user_id === uid && p.lesson_id === lid)) {
        this.progress.push({
          id: this.progress.length + 1,
          user_id: uid,
          lesson_id: lid,
          completed_at: new Date().toISOString(),
          score,
        });
      }
      return { changes: 1 };
    }

    // Update profile XP
    if (lower.includes('update profiles set xp = xp + ?')) {
      const addXp = Number(params[0]);
      const lastActive = params[1] as string;
      const uid = Number(params[2]);
      const prof = this.profiles.find(p => p.user_id === uid);
      if (prof) {
        prof.xp += addXp;
        prof.level = Math.floor(prof.xp / 100) + 1;
        prof.last_active = lastActive;
      }
      return { changes: 1 };
    }

    return { changes: 1, lastInsertRowid: 1 };
  }
}

// Global singleton instance
const globalMemoryStore = new MemoryDbStore();

export function getMemoryDb() {
  return globalMemoryStore;
}

import path from 'path';
import fs from 'fs';
import { COURSES_DATA } from './courseContent';
import { getMemoryDb } from './memoryDb';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dbInstance: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDb(): any {
  if (dbInstance) return dbInstance;

  try {
    // Attempt to load better-sqlite3 dynamically
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require('better-sqlite3');
    const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    let dbPath: string;

    if (isVercel) {
      dbPath = path.join('/tmp', 'academy.db');
      const sourceDbPath = path.join(process.cwd(), 'database', 'academy.db');
      if (fs.existsSync(/*turbopackIgnore: true*/ sourceDbPath) && !fs.existsSync(/*turbopackIgnore: true*/ dbPath)) {
        try {
          fs.copyFileSync(sourceDbPath, dbPath);
        } catch {
          // Ignore copy errors
        }
      }
    } else {
      dbPath = path.join(process.cwd(), 'database', 'academy.db');
      const dir = path.dirname(dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    const d = new Database(dbPath);
    try {
      d.pragma('journal_mode = WAL');
      d.pragma('foreign_keys = ON');
    } catch {
      // WAL mode may fail on certain mounted or read-only filesystems
    }

    initializeSchema(d);
    dbInstance = d;
    return dbInstance;
  } catch (err) {
    console.warn('⚠️ Notice: better-sqlite3 native driver unavailable on this host, falling back to seamless in-memory database engine:', err);
    dbInstance = getMemoryDb();
    return dbInstance;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function initializeSchema(d: any) {

  d.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profiles (
      user_id INTEGER PRIMARY KEY,
      xp INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      streak_count INTEGER NOT NULL DEFAULT 0,
      last_active DATE,
      goal TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      difficulty TEXT NOT NULL DEFAULT 'BEGINNER',
      order_index INTEGER NOT NULL DEFAULT 0,
      icon TEXT DEFAULT '◈'
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      duration_min INTEGER NOT NULL DEFAULT 5,
      xp_reward INTEGER NOT NULL DEFAULT 10,
      order_index INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      prompt TEXT NOT NULL,
      explanation TEXT,
      order_index INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      is_correct INTEGER NOT NULL DEFAULT 0,
      order_index INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id INTEGER NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      score INTEGER DEFAULT 0,
      UNIQUE(user_id, lesson_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      condition_type TEXT NOT NULL,
      condition_value INTEGER NOT NULL DEFAULT 1,
      icon TEXT DEFAULT '◈'
    );

    CREATE TABLE IF NOT EXISTS user_achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      achievement_id INTEGER NOT NULL,
      earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, achievement_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS streaks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date DATE NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, date),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      xp_reward INTEGER NOT NULL DEFAULT 50,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      project_id INTEGER NOT NULL,
      submission TEXT,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, project_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ai_tools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      pricing TEXT NOT NULL DEFAULT 'FREE',
      best_for TEXT,
      url TEXT,
      order_index INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Seed data if empty or if stub lessons need updating
  const courseCount = (d.prepare('SELECT COUNT(*) as count FROM courses').get() as { count: number }).count;
  const questionCount = (d.prepare('SELECT COUNT(*) as count FROM questions').get() as { count: number }).count;
  const hasStubs = (d.prepare("SELECT COUNT(*) as count FROM lessons WHERE content LIKE '%coming soon%'").get() as { count: number }).count;

  if (courseCount === 0 || questionCount < 30 || hasStubs > 0) {
    seedData(d);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function seedData(d: any) {
  const insertOrUpdateCourse = d.prepare(`
    INSERT INTO courses (slug, title, description, difficulty, order_index, icon)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      description = excluded.description,
      difficulty = excluded.difficulty,
      order_index = excluded.order_index,
      icon = excluded.icon
  `);

  const getCourse = d.prepare('SELECT id FROM courses WHERE slug = ?');

  const getLesson = d.prepare('SELECT id FROM lessons WHERE course_id = ? AND slug = ?');

  const updateLessonContent = d.prepare(`
    UPDATE lessons SET
      title = ?,
      content = ?,
      duration_min = ?,
      xp_reward = ?,
      order_index = ?
    WHERE id = ?
  `);

  const insertLesson = d.prepare(`
    INSERT INTO lessons (course_id, slug, title, content, duration_min, xp_reward, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const deleteQuestionsForLesson = d.prepare('DELETE FROM questions WHERE lesson_id = ?');

  const insertQuestion = d.prepare(`
    INSERT INTO questions (lesson_id, type, prompt, explanation, order_index)
    VALUES (?, ?, ?, ?, ?)
    RETURNING id
  `);

  const insertAnswer = d.prepare(`
    INSERT INTO answers (question_id, text, is_correct, order_index)
    VALUES (?, ?, ?, ?)
  `);

  const insertProject = d.prepare(`
    INSERT INTO projects (course_id, title, description, xp_reward)
    VALUES (?, ?, ?, ?)
  `);

  const getProject = d.prepare('SELECT id FROM projects WHERE course_id = ?');

  const updateProject = d.prepare(`
    UPDATE projects SET title = ?, description = ?, xp_reward = ? WHERE id = ?
  `);

  const runAll = d.transaction(() => {
    for (const c of COURSES_DATA) {
      insertOrUpdateCourse.run(c.slug, c.title, c.description, c.difficulty, c.order_index, c.icon);
      const courseRow = getCourse.get(c.slug) as { id: number };
      const courseId = courseRow.id;

      // Project upsert
      const existingProject = getProject.get(courseId) as { id: number } | undefined;
      if (existingProject) {
        updateProject.run(c.project.title, c.project.description, c.project.xp_reward, existingProject.id);
      } else {
        insertProject.run(courseId, c.project.title, c.project.description, c.project.xp_reward);
      }

      // Lessons upsert
      c.lessons.forEach((l, idx) => {
        const lessonRow = getLesson.get(courseId, l.slug) as { id: number } | undefined;
        let lessonId: number;

        if (lessonRow) {
          lessonId = lessonRow.id;
          updateLessonContent.run(l.title, l.content, l.duration_min, l.xp_reward, idx + 1, lessonId);
        } else {
          const res = insertLesson.run(courseId, l.slug, l.title, l.content, l.duration_min, l.xp_reward, idx + 1);
          lessonId = Number(res.lastInsertRowid);
        }

        // Refresh questions for this lesson
        deleteQuestionsForLesson.run(lessonId);

        l.questions.forEach((q, qIdx) => {
          const qRow = insertQuestion.get(lessonId, q.type, q.prompt, q.explanation, qIdx + 1) as { id: number };
          if (q.answers && q.answers.length > 0) {
            for (const a of q.answers) {
              insertAnswer.run(qRow.id, a.text, a.is_correct, a.order_index);
            }
          }
        });
      });
    }
  });

  runAll();

  // ========== ACHIEVEMENTS ==========
  const insertAchievement = d.prepare(`
    INSERT OR IGNORE INTO achievements (slug, title, description, condition_type, condition_value, icon)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const achievements = [
    ['first-step', 'FIRST STEP', 'Complete your first lesson.', 'lessons_completed', 1, '◈'],
    ['five-lessons', 'KNOWLEDGE SEEKER', 'Complete 5 lessons.', 'lessons_completed', 5, '◉'],
    ['ten-lessons', 'COMMITTED LEARNER', 'Complete 10 lessons.', 'lessons_completed', 10, '◎'],
    ['prompt-master', 'PROMPT MASTER', 'Complete the Prompt Engineering course.', 'course_completed', 2, '◐'],
    ['seven-day-streak', '7 DAY STREAK', 'Learn for seven consecutive days.', 'streak', 7, '◑'],
    ['thirty-day-streak', '30 DAY STREAK', 'Learn for thirty consecutive days.', 'streak', 30, '◒'],
    ['first-project', 'FIRST PROJECT', 'Complete your first practical project.', 'projects_completed', 1, '▣'],
    ['five-projects', 'AI BUILDER', 'Complete five projects.', 'projects_completed', 5, '▤'],
    ['xp-500', 'RISING STAR', 'Earn 500 XP.', 'xp', 500, '▥'],
    ['xp-2000', 'AI EXPERT', 'Earn 2000 XP.', 'xp', 2000, '▦'],
    ['ai-entrepreneur', 'AI ENTREPRENEUR', 'Complete the final capstone project.', 'final_project', 1, '★'],
  ];
  achievements.forEach(a => insertAchievement.run(...a));

  // ========== AI TOOLS ==========
  const insertTool = d.prepare(`
    INSERT OR IGNORE INTO ai_tools (name, category, description, pricing, best_for, url, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const tools = [
    ['ChatGPT', 'TEXT', 'The world\'s most popular AI assistant. Excellent for writing, research, coding, and complex analysis tasks.', 'FREE / PAID', 'Writing, research, coding, brainstorming', 'https://chat.openai.com', 1],
    ['Claude', 'TEXT', 'Anthropic\'s AI assistant known for following complex instructions and producing nuanced, high-quality writing.', 'FREE / PAID', 'Long-form writing, analysis, following complex instructions', 'https://claude.ai', 2],
    ['Gemini', 'TEXT', 'Google\'s AI assistant with real-time internet access and deep integration with Google Workspace.', 'FREE / PAID', 'Research, Google Workspace integration, real-time info', 'https://gemini.google.com', 3],
    ['Midjourney', 'IMAGE', 'The leading AI image generator. Creates stunning, photorealistic and artistic images from text descriptions.', 'PAID', 'Marketing visuals, artwork, product images, concepts', 'https://midjourney.com', 4],
    ['DALL-E 3', 'IMAGE', 'OpenAI\'s image generator integrated into ChatGPT. Great for precise, concept-accurate image generation.', 'PAID (via ChatGPT Plus)', 'Precise illustration, concept art, marketing images', 'https://openai.com/dall-e-3', 5],
    ['Runway', 'VIDEO', 'Professional AI video generation and editing platform. Create, edit, and enhance videos with AI.', 'FREE / PAID', 'Video editing, AI video generation, visual effects', 'https://runwayml.com', 6],
    ['ElevenLabs', 'AUDIO', 'Industry-leading AI voice synthesis. Create realistic human voices for any content.', 'FREE / PAID', 'Voiceovers, podcasts, audiobooks, video narration', 'https://elevenlabs.io', 7],
    ['Perplexity', 'TEXT', 'AI-powered search engine that answers questions with cited sources. Ideal for research tasks.', 'FREE / PAID', 'Research, fact-checking, learning new topics', 'https://perplexity.ai', 8],
    ['GitHub Copilot', 'CODE', 'AI coding assistant that suggests code as you type. Works inside VS Code and other editors.', 'PAID', 'Coding, code review, learning programming', 'https://github.com/features/copilot', 9],
    ['Make', 'AUTOMATION', 'Visual no-code automation platform. Connect apps and automate workflows without writing code.', 'FREE / PAID', 'Business automation, workflow creation, app integration', 'https://make.com', 10],
    ['Zapier', 'AUTOMATION', 'The most popular automation platform. Connect 6,000+ apps and automate repetitive tasks easily.', 'FREE / PAID', 'Simple automations, app connections, business workflows', 'https://zapier.com', 11],
    ['HeyGen', 'VIDEO', 'Create professional AI avatar videos. Transform text or scripts into talking-head video content.', 'FREE / PAID', 'Marketing videos, presentations, multilingual content', 'https://heygen.com', 12],
    ['Notion AI', 'TEXT', 'AI writing assistant built directly into Notion. Summarize, write, brainstorm, and organize directly in your workspace.', 'PAID (add-on)', 'Note-taking, documentation, team knowledge bases', 'https://notion.so/ai', 13],
    ['Adobe Firefly', 'IMAGE', 'Adobe\'s AI image generation tool trained on licensed content. Safe for commercial use.', 'FREE / PAID', 'Commercial-safe images, design assets, photo editing', 'https://firefly.adobe.com', 14],
    ['Descript', 'AUDIO', 'Edit audio and video by editing text. Remove filler words, clone your voice, and produce professional content.', 'FREE / PAID', 'Podcast editing, video content, voice cloning', 'https://descript.com', 15],
    ['Copy.ai', 'TEXT', 'AI marketing copywriter. Generate ad copy, product descriptions, email campaigns and social content fast.', 'FREE / PAID', 'Marketing copy, ad campaigns, product descriptions', 'https://copy.ai', 16],
  ];
  tools.forEach(t => insertTool.run(...t));

  // Create demo admin user
  d.prepare(`INSERT OR IGNORE INTO users (email, username, password_hash, role) VALUES (?, ?, ?, ?)`).run(
    'admin@aimoneyacademy.com',
    'admin',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGMO8jW3I4rI0RHjQ/O2k8TlG7e',
    'admin'
  );
}

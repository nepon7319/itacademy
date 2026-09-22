import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from './admin.module.css';

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');
  if (session.user.role !== 'admin') redirect('/dashboard');

  const db = getDb();

  const stats = {
    users: (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c,
    courses: (db.prepare('SELECT COUNT(*) as c FROM courses').get() as { c: number }).c,
    lessons: (db.prepare('SELECT COUNT(*) as c FROM lessons').get() as { c: number }).c,
    completions: (db.prepare('SELECT COUNT(*) as c FROM user_progress').get() as { c: number }).c,
    tools: (db.prepare('SELECT COUNT(*) as c FROM ai_tools').get() as { c: number }).c,
    achievements: (db.prepare('SELECT COUNT(*) as c FROM achievements').get() as { c: number }).c,
  };

  const recentUsers = db.prepare(`
    SELECT u.id, u.username, u.email, u.role, u.created_at,
      p.xp, p.level, p.streak_count
    FROM users u
    LEFT JOIN profiles p ON p.user_id = u.id
    ORDER BY u.created_at DESC
    LIMIT 10
  `).all() as {
    id: number; username: string; email: string; role: string;
    created_at: string; xp: number; level: number; streak_count: number;
  }[];

  const courses = db.prepare(`
    SELECT c.*, COUNT(l.id) as lesson_count
    FROM courses c
    LEFT JOIN lessons l ON l.course_id = c.id
    GROUP BY c.id ORDER BY c.order_index
  `).all() as {
    id: number; slug: string; title: string; difficulty: string;
    order_index: number; lesson_count: number;
  }[];

  const tools = db.prepare('SELECT * FROM ai_tools ORDER BY order_index').all() as {
    id: number; name: string; category: string; pricing: string;
  }[];

  return (
    <div className={styles.page}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.sidebarLogo}>AI MONEY ACADEMY</Link>
        <nav className={styles.sidebarNav}>
          <Link href="/admin" className={`${styles.sidebarLink} ${styles.active}`}>◈ Overview</Link>
          <Link href="/admin/users" className={styles.sidebarLink}>◉ Users</Link>
          <Link href="/admin/courses" className={styles.sidebarLink}>◎ Courses</Link>
          <Link href="/admin/tools" className={styles.sidebarLink}>◐ AI Tools</Link>
          <Link href="/admin/achievements" className={styles.sidebarLink}>◑ Achievements</Link>
        </nav>
        <div className={styles.sidebarBottom}>
          <Link href="/dashboard" className={styles.sidebarLink}>← Back to Dashboard</Link>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>ADMIN DASHBOARD</h1>
          <span className="badge badge-outline">ADMIN</span>
        </div>

        <div className={styles.content}>
          {/* STATS */}
          <div className={styles.statsGrid}>
            {[
              { label: 'Total Users', value: stats.users },
              { label: 'Courses', value: stats.courses },
              { label: 'Lessons', value: stats.lessons },
              { label: 'Lesson Completions', value: stats.completions },
              { label: 'AI Tools', value: stats.tools },
              { label: 'Achievements', value: stats.achievements },
            ].map(s => (
              <div key={s.label} className={styles.statCard}>
                <p className="text-label">{s.label}</p>
                <p className={styles.statVal}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* COURSES */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Courses</h2>
              <button className="btn btn-secondary btn-sm" disabled>+ Add Course</button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Lessons</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c.id}>
                    <td className={styles.mono}>{String(c.order_index).padStart(2,'0')}</td>
                    <td style={{fontWeight:600,color:'var(--white)'}}>{c.title}</td>
                    <td><span className="badge badge-outline">{c.difficulty}</span></td>
                    <td>{c.lesson_count}</td>
                    <td><Link href={`/learn/${c.slug}`} className="btn btn-ghost btn-sm">View →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* USERS */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Users</h2>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Level</th>
                  <th>XP</th>
                  <th>Streak</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(u => (
                  <tr key={u.id}>
                    <td style={{fontWeight:600,color:'var(--white)'}}>{u.username}</td>
                    <td className={styles.muted}>{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'badge-white' : 'badge-outline'}`}>{u.role}</span></td>
                    <td>{u.level ?? 1}</td>
                    <td>{(u.xp ?? 0).toLocaleString()}</td>
                    <td>{u.streak_count ?? 0}</td>
                    <td className={styles.muted}>{u.created_at?.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI TOOLS */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>AI Tools ({tools.length})</h2>
              <button className="btn btn-secondary btn-sm" disabled>+ Add Tool</button>
            </div>
            <div className={styles.toolsGrid}>
              {tools.map(t => (
                <div key={t.id} className={styles.toolChip}>
                  <span style={{fontWeight:600,color:'var(--white)',fontSize:'0.8rem'}}>{t.name}</span>
                  <span className="badge badge-outline">{t.category}</span>
                  <span className="badge badge-outline">{t.pricing}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

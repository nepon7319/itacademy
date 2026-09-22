import { getSession, getUserProfile, getLevelInfo } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logoutUser } from '@/app/actions';
import styles from './dashboard.module.css';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const db = getDb();
  const profile = await getUserProfile(session.userId);
  if (!profile) redirect('/auth/login');

  const levelInfo = getLevelInfo(profile.level);

  // XP progress within level
  const xpInLevel = profile.xp - levelInfo.minXP;
  const xpNeeded = levelInfo.maxXP === Infinity ? 1000 : levelInfo.maxXP - levelInfo.minXP;
  const levelProgress = levelInfo.maxXP === Infinity ? 100 : Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  // Stats
  const lessonsCompleted = (db.prepare('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ?').get(session.userId) as { count: number }).count;
  const totalLessons = (db.prepare('SELECT COUNT(*) as count FROM lessons').get() as { count: number }).count;
  const projectsCompleted = (db.prepare('SELECT COUNT(*) as count FROM user_projects WHERE user_id = ?').get(session.userId) as { count: number }).count;
  const totalProgress = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;

  // Next lesson
  const nextLesson = db.prepare(`
    SELECT l.id, l.title, l.slug, c.slug as course_slug, c.title as course_title
    FROM lessons l
    JOIN courses c ON c.id = l.course_id
    WHERE l.id NOT IN (SELECT lesson_id FROM user_progress WHERE user_id = ?)
    ORDER BY c.order_index, l.order_index
    LIMIT 1
  `).get(session.userId) as { id: number; title: string; slug: string; course_slug: string; course_title: string } | undefined;

  // Recent achievements
  const recentAchievements = db.prepare(`
    SELECT a.title, a.description, a.icon, ua.earned_at
    FROM user_achievements ua
    JOIN achievements a ON a.id = ua.achievement_id
    WHERE ua.user_id = ?
    ORDER BY ua.earned_at DESC
    LIMIT 3
  `).all(session.userId) as { title: string; description: string; icon: string; earned_at: string }[];

  // Streak calendar (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const streakDays = db.prepare(`
    SELECT date FROM streaks WHERE user_id = ? AND date >= ? AND completed = 1
  `).all(session.userId, last7Days[0]) as { date: string }[];
  const streakSet = new Set(streakDays.map(s => s.date));

  // Today's goal
  const todayDone = streakSet.has(new Date().toISOString().split('T')[0]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  return (
    <div className={styles.page}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.sidebarLogo}>AI MONEY ACADEMY</Link>
        <nav className={styles.sidebarNav}>
          {[
            { href: '/dashboard', label: 'Dashboard', icon: '◈' },
            { href: '/learn', label: 'Learn', icon: '◉' },
            { href: '/tools', label: 'AI Tools', icon: '◎' },
            { href: '/earn', label: 'Ways to Earn', icon: '◐' },
            { href: '/profile', label: 'Profile', icon: '◑' },
          ].map(item => (
            <Link key={item.href} href={item.href} className={styles.sidebarLink}>
              <span className={styles.sidebarIcon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarBottom}>
          <div className={styles.sidebarUser}>
            <div className={styles.sidebarAvatar}>{profile.username[0].toUpperCase()}</div>
            <div>
              <p style={{fontSize: '0.8rem', fontWeight: 600, color: 'var(--white)'}}>{profile.username}</p>
              <p style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}>{levelInfo.title}</p>
            </div>
          </div>
          <form action={logoutUser}>
            <button type="submit" className={styles.logoutBtn}>Log out</button>
          </form>
        </div>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>
        {/* TOP BAR */}
        <div className={styles.topBar}>
          <div>
            <p className={styles.greeting}>{greeting}, {profile.username}.</p>
            <p className="text-small">Continue your AI journey.</p>
          </div>
          <div className={styles.topBarStats}>
            <div className={styles.topStat}>
              <span className={styles.topStatIcon}>◑</span>
              <span className={styles.topStatVal}>{profile.streak_count} day streak</span>
            </div>
            <div className={styles.topStat}>
              <span className={styles.topStatIcon}>◈</span>
              <span className={styles.topStatVal}>{profile.xp} XP</span>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {/* TOP ROW */}
          <div className={styles.topRow}>
            {/* PROGRESS CARD */}
            <div className={`${styles.card} ${styles.progressCard}`}>
              <p className="text-label">Your Progress</p>
              <div className={styles.progressCircleRow}>
                <div className={styles.progressBig}>
                  <span className={styles.progressPct}>{totalProgress}%</span>
                  <span className="text-small">{lessonsCompleted} / {totalLessons} lessons</span>
                </div>
                <div className={styles.progressDetails}>
                  <div className={styles.progressDetail}>
                    <span className="text-label">Level</span>
                    <span style={{fontSize: '0.9rem', fontWeight: 700, color: 'var(--white)'}}>{profile.level} — {levelInfo.title}</span>
                  </div>
                  <div className={styles.progressDetail}>
                    <span className="text-label">Level XP</span>
                    <div>
                      <div className="progress-bar" style={{marginBottom: '4px'}}>
                        <div className="progress-bar-fill" style={{width: `${levelProgress}%`}}></div>
                      </div>
                      <span className="text-small">{levelProgress}%</span>
                    </div>
                  </div>
                </div>
              </div>
              {nextLesson && (
                <Link href={`/learn/${nextLesson.course_slug}/${nextLesson.slug}`} className={`btn btn-primary ${styles.continueBtn}`}>
                  Continue: {nextLesson.title} →
                </Link>
              )}
            </div>

            {/* TODAY */}
            <div className={`${styles.card} ${styles.todayCard}`}>
              <p className="text-label">Today&apos;s Goal</p>
              <div className={styles.dailyGoal}>
                <div className={`${styles.goalStatus} ${todayDone ? styles.goalDone : ''}`}>
                  {todayDone ? '✓' : '○'}
                </div>
                <div>
                  <p style={{fontWeight: 600, color: 'var(--white)', fontSize: '0.875rem'}}>
                    {todayDone ? 'Goal Complete!' : 'Complete 1 lesson'}
                  </p>
                  <p className="text-small">{todayDone ? '1 / 1 done' : '0 / 1 done'}</p>
                </div>
              </div>

              <p className="text-label" style={{marginTop: 'var(--space-4)'}}>Streak</p>
              <div className={styles.streakCalendar}>
                {['M','T','W','T','F','S','S'].map((d, i) => {
                  const dateStr = last7Days[i];
                  const done = streakSet.has(dateStr);
                  return (
                    <div key={i} className={`${styles.streakDay} ${done ? styles.streakDayDone : ''}`}>
                      <span className={styles.streakDayLabel}>{d}</span>
                      <div className={styles.streakDot}></div>
                    </div>
                  );
                })}
              </div>
              <p style={{fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--white)'}}>
                {profile.streak_count} <span style={{fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-secondary)'}}>DAYS</span>
              </p>
            </div>
          </div>

          {/* STATS ROW */}
          <div className={styles.statsRow}>
            {[
              { label: 'Total XP', value: `${profile.xp.toLocaleString()} XP`, icon: '◈' },
              { label: 'Level', value: `${profile.level} — ${levelInfo.title}`, icon: '◉' },
              { label: 'Lessons Done', value: `${lessonsCompleted}`, icon: '◎' },
              { label: 'Projects', value: `${projectsCompleted}`, icon: '◐' },
            ].map(s => (
              <div key={s.label} className={`${styles.card} ${styles.statCard}`}>
                <span className={styles.statCardIcon}>{s.icon}</span>
                <p className="text-label">{s.label}</p>
                <p className={styles.statCardVal}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* BOTTOM ROW */}
          <div className={styles.bottomRow}>
            {/* CONTINUE LEARNING */}
            <div className={`${styles.card} ${styles.continueCard}`}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'var(--space-4)'}}>
                <p className="text-label">Continue Learning</p>
                <Link href="/learn" className="btn btn-ghost btn-sm">View all →</Link>
              </div>
              <CoursesProgress userId={session.userId} />
            </div>

            {/* ACHIEVEMENTS */}
            <div className={`${styles.card} ${styles.achievementsCard}`}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'var(--space-4)'}}>
                <p className="text-label">Recent Achievements</p>
                <Link href="/profile" className="btn btn-ghost btn-sm">All →</Link>
              </div>
              {recentAchievements.length === 0 ? (
                <div className={styles.emptyAchievements}>
                  <span style={{fontSize: '1.5rem', color: 'var(--text-tertiary)'}}>◈</span>
                  <p className="text-small">Complete your first lesson to earn achievements.</p>
                </div>
              ) : (
                <div className={styles.achievementsList}>
                  {recentAchievements.map(a => (
                    <div key={a.title} className={styles.achievementItem}>
                      <div className={styles.achievementIcon}>{a.icon}</div>
                      <div>
                        <p style={{fontSize: '0.8rem', fontWeight: 700, color: 'var(--white)'}}>{a.title}</p>
                        <p className="text-small" style={{fontSize: '0.75rem'}}>{a.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE NAV */}
      <nav className="mobile-nav">
        <MobileNavLinks />
      </nav>
    </div>
  );
}

async function CoursesProgress({ userId }: { userId: number }) {
  const db = getDb();
  const courses = db.prepare(`
    SELECT c.id, c.slug, c.title, c.icon,
      COUNT(l.id) as total_lessons,
      COUNT(up.lesson_id) as completed_lessons
    FROM courses c
    LEFT JOIN lessons l ON l.course_id = c.id
    LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = ?
    GROUP BY c.id
    ORDER BY c.order_index
    LIMIT 6
  `).all(userId) as { id: number; slug: string; title: string; icon: string; total_lessons: number; completed_lessons: number }[];

  return (
    <div className={styles.coursesList}>
      {courses.map(c => {
        const progress = c.total_lessons > 0 ? Math.round((c.completed_lessons / c.total_lessons) * 100) : 0;
        return (
          <Link href={`/learn/${c.slug}`} key={c.id} className={styles.courseRow}>
            <span className={styles.courseRowIcon}>{c.icon}</span>
            <div className={styles.courseRowContent}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                <span style={{fontSize:'0.8rem',fontWeight:700,color:'var(--white)'}}>{c.title}</span>
                <span className="text-small" style={{fontSize:'0.75rem'}}>{progress}%</span>
              </div>
              <div className="progress-bar"><div className="progress-bar-fill" style={{width:`${progress}%`}}></div></div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function MobileNavLinks() {
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',width:'100%'}}>
      {[
        {href:'/dashboard',label:'Home',icon:'◈'},
        {href:'/learn',label:'Learn',icon:'◉'},
        {href:'/tools',label:'Tools',icon:'◎'},
        {href:'/earn',label:'Earn',icon:'◐'},
        {href:'/profile',label:'Profile',icon:'◑'},
      ].map(n => (
        <Link key={n.href} href={n.href} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',padding:'8px',color:'var(--text-secondary)',fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase'}}>
          <span style={{fontSize:'1rem'}}>{n.icon}</span>
          {n.label}
        </Link>
      ))}
    </div>
  );
}

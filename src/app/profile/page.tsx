import { getSession, getUserProfile, getLevelInfo } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logoutUser } from '@/app/actions';
import styles from './profile.module.css';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const db = getDb();
  const profile = await getUserProfile(session.userId);
  if (!profile) redirect('/auth/login');

  const levelInfo = getLevelInfo(profile.level);
  const xpInLevel = profile.xp - levelInfo.minXP;
  const xpNeeded = levelInfo.maxXP === Infinity ? 1000 : levelInfo.maxXP - levelInfo.minXP;
  const levelProgress = levelInfo.maxXP === Infinity ? 100 : Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  const lessonsCompleted = (db.prepare('SELECT COUNT(*) as count FROM user_progress WHERE user_id = ?').get(session.userId) as { count: number }).count;
  const projectsCompleted = (db.prepare('SELECT COUNT(*) as count FROM user_projects WHERE user_id = ?').get(session.userId) as { count: number }).count;

  const allAchievements = db.prepare(`
    SELECT a.*, 
      CASE WHEN ua.user_id IS NOT NULL THEN 1 ELSE 0 END as earned,
      ua.earned_at
    FROM achievements a
    LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = ?
    ORDER BY earned DESC, a.id
  `).all(session.userId) as {
    id: number; slug: string; title: string; description: string;
    icon: string; earned: number; earned_at: string;
  }[];

  // Last 30 days streak
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  const streakData = db.prepare(`
    SELECT date FROM streaks WHERE user_id = ? AND date >= ? AND completed = 1
  `).all(session.userId, last30[0]) as { date: string }[];
  const streakSet = new Set(streakData.map(s => s.date));

  const levelNames = ['BEGINNER', 'EXPLORER', 'BUILDER', 'CREATOR', 'AUTOMATOR', 'AI ENTREPRENEUR'];

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.sidebarLogo}>AI MONEY ACADEMY</Link>
        <nav className={styles.sidebarNav}>
          {[
            { href: '/dashboard', label: 'Dashboard', icon: '◈' },
            { href: '/learn', label: 'Learn', icon: '◉' },
            { href: '/tools', label: 'AI Tools', icon: '◎' },
            { href: '/earn', label: 'Ways to Earn', icon: '◐' },
            { href: '/profile', label: 'Profile', icon: '◑', active: true },
          ].map(item => (
            <Link key={item.href} href={item.href} className={`${styles.sidebarLink} ${item.active ? styles.sidebarLinkActive : ''}`}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarBottom}>
          <form action={logoutUser}>
            <button type="submit" className={styles.logoutBtn}>Log out</button>
          </form>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topBar}>
          <h1 className={styles.pageTitle}>PROFILE</h1>
        </div>

        <div className={styles.content}>
          {/* Profile Hero */}
          <div className={styles.profileHero}>
            <div className={styles.avatar}>{profile.username[0].toUpperCase()}</div>
            <div className={styles.profileInfo}>
              <h2 className={styles.username}>{profile.username}</h2>
              <p className="text-small">{profile.email}</p>
              <div style={{display:'flex',gap:'var(--space-3)',marginTop:'var(--space-3)',flexWrap:'wrap'}}>
                <span className="badge badge-white">LEVEL {profile.level} — {levelInfo.title}</span>
                <span className="badge badge-outline">{profile.xp} XP</span>
                <span className="badge badge-outline">{profile.streak_count} DAY STREAK</span>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className={styles.card}>
            <p className="text-label" style={{marginBottom:'var(--space-4)'}}>Level Progress</p>
            <div className={styles.levelTrack}>
              {levelNames.map((name, i) => (
                <div key={name} className={`${styles.levelStep} ${i + 1 <= profile.level ? styles.levelStepDone : ''} ${i + 1 === profile.level ? styles.levelStepCurrent : ''}`}>
                  <div className={styles.levelStepDot}>{i + 1 <= profile.level ? '✓' : i + 1}</div>
                  <span className={styles.levelStepName}>{name}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:'var(--space-5)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'var(--space-2)'}}>
                <span className="text-small">Progress to next level</span>
                <span className="text-small">{levelProgress}%</span>
              </div>
              <div className="progress-bar" style={{height:'6px'}}>
                <div className="progress-bar-fill" style={{width:`${levelProgress}%`}}></div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsGrid}>
            {[
              { label: 'Total XP', value: profile.xp.toLocaleString() },
              { label: 'Current Level', value: `${profile.level}` },
              { label: 'Day Streak', value: `${profile.streak_count}` },
              { label: 'Lessons Done', value: `${lessonsCompleted}` },
              { label: 'Projects', value: `${projectsCompleted}` },
              { label: 'Goal', value: profile.goal || 'Not set' },
            ].map(s => (
              <div key={s.label} className={`${styles.card} ${styles.statCard}`}>
                <p className="text-label">{s.label}</p>
                <p className={styles.statVal}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Streak Calendar */}
          <div className={styles.card}>
            <p className="text-label" style={{marginBottom:'var(--space-4)'}}>30-Day Activity</p>
            <div className={styles.streakGrid}>
              {last30.map(date => (
                <div
                  key={date}
                  className={`${styles.streakCell} ${streakSet.has(date) ? styles.streakCellDone : ''}`}
                  title={date}
                ></div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className={styles.card}>
            <p className="text-label" style={{marginBottom:'var(--space-5)'}}>Achievements ({allAchievements.filter(a => a.earned).length}/{allAchievements.length})</p>
            <div className={styles.achievementsGrid}>
              {allAchievements.map(a => (
                <div key={a.id} className={`${styles.achievementCard} ${!a.earned ? styles.achievementLocked : ''}`}>
                  <div className={styles.achievementIcon}>{a.icon}</div>
                  <div>
                    <p className={styles.achievementTitle}>{a.title}</p>
                    <p className="text-small" style={{fontSize:'0.75rem'}}>{a.description}</p>
                    {a.earned && <p style={{fontSize:'0.65rem',color:'var(--text-tertiary)',marginTop:'4px'}}>Earned</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <nav className="mobile-nav">
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',width:'100%'}}>
          {[{href:'/dashboard',label:'Home',icon:'◈'},{href:'/learn',label:'Learn',icon:'◉'},{href:'/tools',label:'Tools',icon:'◎'},{href:'/earn',label:'Earn',icon:'◐'},{href:'/profile',label:'Profile',icon:'◑'}].map(n=>(
            <Link key={n.href} href={n.href} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',padding:'8px',color:n.href==='/profile'?'var(--white)':'var(--text-secondary)',fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase'}}>
              <span style={{fontSize:'1rem'}}>{n.icon}</span>{n.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

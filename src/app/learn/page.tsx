import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import styles from './learn.module.css';
import { logoutUser } from '@/app/actions';

export default async function LearnPage() {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const db = getDb();

  const courses = db.prepare(`
    SELECT c.id, c.slug, c.title, c.description, c.difficulty, c.order_index, c.icon,
      COUNT(l.id) as total_lessons,
      COUNT(up.lesson_id) as completed_lessons
    FROM courses c
    LEFT JOIN lessons l ON l.course_id = c.id
    LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = ?
    GROUP BY c.id
    ORDER BY c.order_index
  `).all(session.userId) as {
    id: number; slug: string; title: string; description: string;
    difficulty: string; order_index: number; icon: string;
    total_lessons: number; completed_lessons: number;
  }[];

  return (
    <div className={styles.page}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.sidebarLogo}>AI MONEY ACADEMY</Link>
        <nav className={styles.sidebarNav}>
          {[
            { href: '/dashboard', label: 'Dashboard', icon: '◈' },
            { href: '/learn', label: 'Learn', icon: '◉', active: true },
            { href: '/tools', label: 'AI Tools', icon: '◎' },
            { href: '/earn', label: 'Ways to Earn', icon: '◐' },
            { href: '/profile', label: 'Profile', icon: '◑' },
          ].map(item => (
            <Link key={item.href} href={item.href} className={`${styles.sidebarLink} ${item.active ? styles.sidebarLinkActive : ''}`}>
              <span className={styles.sidebarIcon}>{item.icon}</span>
              {item.label}
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
          <div>
            <h1 className={styles.pageTitle}>YOUR AI JOURNEY</h1>
            <p className="text-small">Complete courses in order to unlock new levels.</p>
          </div>
        </div>

        <div className={styles.content}>
          {/* Learning path visual */}
          <div className={styles.pathContainer}>
            {courses.map((course, index) => {
              const progress = course.total_lessons > 0
                ? Math.round((course.completed_lessons / course.total_lessons) * 100) : 0;
              const isCompleted = progress === 100;
              const isCurrent = !isCompleted && (index === 0 || courses[index - 1]?.completed_lessons > 0);
              const isLocked = !isCompleted && !isCurrent && index > 0 && courses[index - 1]?.completed_lessons === 0;
              const statusLabel = isCompleted ? 'COMPLETED' : isCurrent ? 'CURRENT' : 'LOCKED';

              return (
                <div key={course.id} className={styles.pathItem}>
                  {/* Connector line */}
                  {index > 0 && (
                    <div className={`${styles.connector} ${isCompleted || isCurrent ? styles.connectorActive : ''}`}></div>
                  )}

                  <Link
                    href={isLocked ? '#' : `/learn/${course.slug}`}
                    className={`${styles.courseNode} ${isCompleted ? styles.courseCompleted : ''} ${isCurrent ? styles.courseCurrent : ''} ${isLocked ? styles.courseLocked : ''}`}
                  >
                    <div className={styles.courseNodeLeft}>
                      <div className={`${styles.courseNodeIcon} ${isCompleted ? styles.iconCompleted : ''} ${isCurrent ? styles.iconCurrent : ''}`}>
                        {isCompleted ? '✓' : isLocked ? '🔒' : course.icon}
                      </div>
                      <div className={styles.courseNodeInfo}>
                        <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)',marginBottom:'4px'}}>
                          <span className={styles.courseNum}>
                            {String(course.order_index).padStart(2, '0')}
                          </span>
                          <span className={`badge ${statusLabel === 'COMPLETED' ? 'badge-white' : statusLabel === 'CURRENT' ? 'badge-outline' : 'badge-outline'}`}>
                            {statusLabel}
                          </span>
                          <span className="badge badge-outline">{course.difficulty}</span>
                        </div>
                        <h2 className={styles.courseNodeTitle}>{course.title}</h2>
                        <p className="text-small" style={{marginTop:'4px'}}>{course.description}</p>
                      </div>
                    </div>

                    <div className={styles.courseNodeRight}>
                      <div className={styles.courseProgress}>
                        <div className="progress-bar" style={{width:'120px'}}>
                          <div className="progress-bar-fill" style={{width:`${progress}%`}}></div>
                        </div>
                        <span className="text-small">{course.completed_lessons} / {course.total_lessons}</span>
                      </div>
                      <span className={styles.courseArrow}>
                        {isLocked ? '' : '→'}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <nav className="mobile-nav">
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',width:'100%'}}>
          {[
            {href:'/dashboard',label:'Home',icon:'◈'},
            {href:'/learn',label:'Learn',icon:'◉'},
            {href:'/tools',label:'Tools',icon:'◎'},
            {href:'/earn',label:'Earn',icon:'◐'},
            {href:'/profile',label:'Profile',icon:'◑'},
          ].map(n => (
            <Link key={n.href} href={n.href} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',padding:'8px',color: n.href === '/learn' ? 'var(--white)' : 'var(--text-secondary)',fontSize:'0.6rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase'}}>
              <span style={{fontSize:'1rem'}}>{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

import { getDb } from '@/lib/db';
import Link from 'next/link';
import styles from './courses.module.css';

export default function CoursesPage() {
  const db = getDb();
  const courses = db.prepare('SELECT * FROM courses ORDER BY order_index').all() as {
    id: number; slug: string; title: string; description: string;
    difficulty: string; order_index: number; icon: string;
  }[];

  const lessonCounts = courses.map(c => {
    const count = (db.prepare('SELECT COUNT(*) as count FROM lessons WHERE course_id = ?').get(c.id) as { count: number }).count;
    return { ...c, lessonCount: count };
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/" className={styles.logo}>AI MONEY ACADEMY</Link>
          <nav className={styles.nav}>
            <Link href="/courses" className={styles.navLink} style={{color:'var(--white)'}}>Courses</Link>
            <Link href="/tools" className={styles.navLink}>AI Tools</Link>
            <Link href="/earn" className={styles.navLink}>Ways to Earn</Link>
          </nav>
          <div style={{display:'flex',gap:'var(--space-2)'}}>
            <Link href="/auth/login" className="btn btn-ghost btn-sm">Log in</Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm">Start Free →</Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <p className="text-label">Structured Learning</p>
            <h1 className={`text-headline ${styles.pageTitle}`}>COURSES</h1>
            <p className="text-body" style={{maxWidth:'560px',marginTop:'var(--space-4)'}}>
              Six levels of practical AI mastery. Each course builds on the previous one, taking you from complete beginner to someone who can build real AI-powered products.
            </p>
          </div>

          <div className={styles.coursesGrid}>
            {lessonCounts.map((course, i) => (
              <Link key={course.id} href={`/auth/register`} className={styles.courseCard} style={{animationDelay:`${i*70}ms`}}>
                <div className={styles.courseCardTop}>
                  <span className={styles.courseNum}>{String(course.order_index).padStart(2, '0')}</span>
                  <span className={`badge ${course.difficulty === 'ADVANCED' ? 'badge-white' : 'badge-outline'}`}>{course.difficulty}</span>
                </div>
                <div className={styles.courseIcon}>{course.icon}</div>
                <h2 className={styles.courseTitle}>{course.title}</h2>
                <p className="text-small">{course.description}</p>
                <div className={styles.courseFooter}>
                  <span className="text-small">{course.lessonCount} lessons</span>
                  <span className={styles.courseArrow}>→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className={styles.cta}>
            <h2 className="text-headline" style={{color:'var(--white)'}}>READY TO START?</h2>
            <p className="text-body" style={{maxWidth:'400px',marginTop:'var(--space-3)',textAlign:'center'}}>
              Create a free account and begin your first lesson in the next 2 minutes.
            </p>
            <Link href="/auth/register" className="btn btn-primary btn-lg" style={{marginTop:'var(--space-6)'}}>
              Start Learning Free →
            </Link>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <Link href="/" className={styles.logo}>AI MONEY ACADEMY</Link>
          <div style={{display:'flex',gap:'var(--space-6)'}}>
            <Link href="/tools" className={styles.navLink}>AI Tools</Link>
            <Link href="/earn" className={styles.navLink}>Ways to Earn</Link>
            <Link href="/auth/register" className={styles.navLink}>Start Free</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

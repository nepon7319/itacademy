import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './course.module.css';

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const db = getDb();

  const course = db.prepare('SELECT * FROM courses WHERE slug = ?').get(courseId) as {
    id: number; slug: string; title: string; description: string; difficulty: string; icon: string;
  } | undefined;

  if (!course) notFound();

  const lessons = db.prepare(`
    SELECT l.*,
      CASE WHEN up.lesson_id IS NOT NULL THEN 1 ELSE 0 END as completed
    FROM lessons l
    LEFT JOIN user_progress up ON up.lesson_id = l.id AND up.user_id = ?
    WHERE l.course_id = ?
    ORDER BY l.order_index
  `).all(session.userId, course.id) as {
    id: number; slug: string; title: string; duration_min: number;
    xp_reward: number; order_index: number; completed: number;
  }[];

  const project = db.prepare(`
    SELECT p.*,
      CASE WHEN up.project_id IS NOT NULL THEN 1 ELSE 0 END as completed
    FROM projects p
    LEFT JOIN user_projects up ON up.project_id = p.id AND up.user_id = ?
    WHERE p.course_id = ?
    LIMIT 1
  `).get(session.userId, course.id) as {
    id: number; title: string; description: string; xp_reward: number; completed: number;
  } | undefined;

  const completedCount = lessons.filter(l => l.completed).length;
  const progress = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const nextLesson = lessons.find(l => !l.completed);

  return (
    <div className={styles.page}>
      {/* Back nav */}
      <div className={styles.backBar}>
        <Link href="/learn" className={styles.backLink}>← Back to Learning Path</Link>
      </div>

      <div className={styles.courseHeader}>
        <div className={styles.courseHeaderLeft}>
          <span className={styles.courseIcon}>{course.icon}</span>
          <div>
            <div style={{display:'flex',gap:'var(--space-3)',alignItems:'center',marginBottom:'8px'}}>
              <span className="badge badge-outline">{course.difficulty}</span>
              <span className="text-label">{lessons.length} lessons</span>
            </div>
            <h1 className={styles.courseTitle}>{course.title}</h1>
            <p className="text-body" style={{marginTop:'8px',maxWidth:'600px'}}>{course.description}</p>
          </div>
        </div>
        <div className={styles.courseHeaderRight}>
          <div className={styles.courseProgressCircle}>
            <span className={styles.courseProgressPct}>{progress}%</span>
            <span className="text-small">{completedCount}/{lessons.length}</span>
          </div>
          {nextLesson && (
            <Link href={`/learn/${course.slug}/${nextLesson.slug}`} className="btn btn-primary">
              {completedCount === 0 ? 'Start Course →' : 'Continue →'}
            </Link>
          )}
          {completedCount === lessons.length && lessons.length > 0 && (
            <div className="badge badge-white">✓ COMPLETED</div>
          )}
        </div>
      </div>

      <div className={styles.lessonsList}>
        <p className="text-label" style={{marginBottom:'var(--space-4)'}}>Lessons</p>
        {lessons.map((lesson, index) => {
          const isAccessible = index === 0 || lessons[index - 1]?.completed;
          return (
            <Link
              key={lesson.id}
              href={isAccessible ? `/learn/${course.slug}/${lesson.slug}` : '#'}
              className={`${styles.lessonRow} ${lesson.completed ? styles.lessonCompleted : ''} ${!isAccessible ? styles.lessonLocked : ''}`}
            >
              <div className={styles.lessonRowLeft}>
                <div className={`${styles.lessonStatus} ${lesson.completed ? styles.lessonStatusDone : ''}`}>
                  {lesson.completed ? '✓' : !isAccessible ? '🔒' : String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <p className={styles.lessonTitle}>{lesson.title}</p>
                  <p className="text-small" style={{fontSize:'0.75rem'}}>{lesson.duration_min} min</p>
                </div>
              </div>
              <div className={styles.lessonRowRight}>
                <span className="badge badge-outline">+{lesson.xp_reward} XP</span>
                {isAccessible && !lesson.completed && <span className={styles.lessonArrow}>→</span>}
              </div>
            </Link>
          );
        })}

        {/* PROJECT */}
        {project && (
          <div className={styles.projectCard}>
            <div className={styles.projectTop}>
              <span className="badge badge-outline">PRACTICAL PROJECT</span>
              <span className="badge badge-outline">+{project.xp_reward} XP</span>
            </div>
            <h3 className={styles.projectTitle}>{project.title}</h3>
            <p className="text-body">{project.description}</p>
            {project.completed ? (
              <div className="badge badge-white" style={{marginTop:'var(--space-4)',width:'fit-content'}}>✓ PROJECT COMPLETED</div>
            ) : (
              <div style={{marginTop:'var(--space-4)',opacity: completedCount < lessons.length ? 0.5 : 1}}>
                <Link
                  href={completedCount >= lessons.length ? `/learn/${course.slug}/project` : '#'}
                  className="btn btn-secondary btn-sm"
                >
                  {completedCount >= lessons.length ? 'Start Project →' : `Complete all ${lessons.length} lessons first`}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { getSession } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { redirect, notFound } from 'next/navigation';
import LessonClient from './LessonClient';

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const db = getDb();

  const course = db.prepare('SELECT * FROM courses WHERE slug = ?').get(courseId) as {
    id: number; slug: string; title: string; icon: string;
  } | undefined;
  if (!course) notFound();

  const lesson = db.prepare('SELECT * FROM lessons WHERE slug = ? AND course_id = ?').get(lessonId, course.id) as {
    id: number; slug: string; title: string; content: string;
    duration_min: number; xp_reward: number; order_index: number;
  } | undefined;
  if (!lesson) notFound();

  const questions = db.prepare(`
    SELECT q.*, 
      json_group_array(json_object('id', a.id, 'text', a.text, 'is_correct', a.is_correct, 'order_index', a.order_index)) as answers_json
    FROM questions q
    LEFT JOIN answers a ON a.question_id = q.id
    WHERE q.lesson_id = ?
    GROUP BY q.id
    ORDER BY q.order_index
  `).all(lesson.id) as {
    id: number; type: string; prompt: string; explanation: string;
    order_index: number; answers_json: string;
  }[];

  const questionsWithAnswers = questions.map(q => ({
    ...q,
    answers: JSON.parse(q.answers_json).sort((a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index),
  }));

  // Total lessons in course for progress display
  const allLessons = db.prepare('SELECT id, slug, title, order_index FROM lessons WHERE course_id = ? ORDER BY order_index').all(course.id) as {
    id: number; slug: string; title: string; order_index: number;
  }[];

  const lessonIndex = allLessons.findIndex(l => l.id === lesson.id);
  const nextLesson = allLessons[lessonIndex + 1];
  const prevLesson = allLessons[lessonIndex - 1];

  const alreadyCompleted = db.prepare('SELECT id FROM user_progress WHERE user_id = ? AND lesson_id = ?')
    .get(session.userId, lesson.id) !== undefined;

  return (
    <LessonClient
      course={course}
      lesson={lesson}
      questions={questionsWithAnswers}
      nextLesson={nextLesson}
      prevLesson={prevLesson}
      lessonIndex={lessonIndex}
      totalLessons={allLessons.length}
      userId={session.userId}
      alreadyCompleted={alreadyCompleted}
    />
  );
}

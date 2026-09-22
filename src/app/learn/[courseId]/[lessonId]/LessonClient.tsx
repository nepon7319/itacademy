'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { completeLesson } from '@/app/actions';
import PromptChallenge from '@/components/PromptChallenge';
import styles from './lesson.module.css';

interface Answer { id: number; text: string; is_correct: number; order_index: number; }
interface Question { id: number; type: string; prompt: string; explanation: string; answers: Answer[]; }

interface Props {
  course: { id: number; slug: string; title: string; icon: string };
  lesson: { id: number; slug: string; title: string; content: string; duration_min: number; xp_reward: number; order_index: number };
  questions: Question[];
  nextLesson?: { id: number; slug: string; title: string };
  prevLesson?: { id: number; slug: string; title: string };
  lessonIndex: number;
  totalLessons: number;
  userId: number;
  alreadyCompleted: boolean;
}

type Phase = 'reading' | 'quiz' | 'complete';

export default function LessonClient({ course, lesson, questions, nextLesson, prevLesson, lessonIndex, totalLessons, userId, alreadyCompleted }: Props) {
  const [phase, setPhase] = useState<Phase>('reading');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showXpPop, setShowXpPop] = useState(false);
  const [orderItems, setOrderItems] = useState<Answer[]>([]);
  const [writeInput, setWriteInput] = useState('');
  const [promptChallengeCompleted, setPromptChallengeCompleted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const readingProgress = ((lessonIndex) / totalLessons) * 100;

  const currentQ = questions[quizIndex];
  const totalQ = questions.length;

  function handleStartQuiz() {
    if (questions.length === 0) {
      handleComplete();
    } else {
      setPhase('quiz');
      if (currentQ?.type === 'order') {
        setOrderItems([...currentQ.answers].sort(() => Math.random() - 0.5));
      }
    }
  }

  function handleSelectAnswer(answerId: number) {
    if (answered) return;
    setSelectedAnswer(answerId);
  }

  function handleSubmitAnswer() {
    if (!currentQ || answered) return;

    let correct = false;
    if (currentQ.type === 'multiple-choice' || currentQ.type === 'true-false') {
      const chosen = currentQ.answers.find(a => a.id === selectedAnswer);
      correct = chosen?.is_correct === 1;
    } else if (currentQ.type === 'write') {
      correct = writeInput.trim().length >= 20;
    } else if (currentQ.type === 'order') {
      const correctOrder = currentQ.answers.filter(a => a.is_correct === 1);
      correct = orderItems.every((item, i) => item.id === correctOrder[i]?.id);
    } else {
      correct = true;
    }

    setIsCorrect(correct);
    setAnswered(true);
    if (correct) {
      const xp = 10;
      setScore(s => s + 1);
      setXpEarned(x => x + xp);
      setShowXpPop(true);
      setTimeout(() => setShowXpPop(false), 2000);
    }
  }

  function handleNextQuestion() {
    if (quizIndex < totalQ - 1) {
      setQuizIndex(i => i + 1);
      setSelectedAnswer(null);
      setSelectedAnswers([]);
      setAnswered(false);
      setIsCorrect(false);
      setWriteInput('');
      const next = questions[quizIndex + 1];
      if (next?.type === 'order') {
        setOrderItems([...next.answers].sort(() => Math.random() - 0.5));
      }
    } else {
      handleComplete();
    }
  }

  function handleComplete() {
    setPhase('complete');
    const totalXP = lesson.xp_reward + xpEarned;
    if (!alreadyCompleted) {
      startTransition(async () => {
        await completeLesson(userId, lesson.id, score, totalXP);
      });
    }
  }

  function moveOrderItem(index: number, dir: -1 | 1) {
    const newItems = [...orderItems];
    const target = index + dir;
    if (target < 0 || target >= newItems.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    setOrderItems(newItems);
  }

  const progressPct = phase === 'reading' ? readingProgress : phase === 'quiz' ? ((quizIndex) / totalQ) * 100 : 100;

  return (
    <div className={styles.page}>
      {/* TOP BAR */}
      <header className={styles.topBar}>
        <Link href={`/learn/${course.slug}`} className={styles.backBtn}>← {course.title}</Link>
        <div className={styles.topBarCenter}>
          <div className="progress-bar" style={{ width: '200px', height: '4px' }}>
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
          </div>
          <span className="text-label">{phase === 'reading' ? `LESSON ${lessonIndex + 1} / ${totalLessons}` : phase === 'quiz' ? `QUESTION ${quizIndex + 1} / ${totalQ}` : 'COMPLETE'}</span>
        </div>
        <div className={styles.topBarRight}>
          <span className="badge badge-outline">+{lesson.xp_reward} XP</span>
        </div>
      </header>

      {/* XP POP */}
      {showXpPop && (
        <div className={styles.xpPop} aria-live="polite">+10 XP</div>
      )}

      <main className={styles.main}>
        {/* READING PHASE */}
        {phase === 'reading' && (
          <div className={styles.readingContainer}>
            <div className={styles.lessonMeta}>
              <p className="text-label">{course.title}</p>
              <h1 className={styles.lessonTitle}>{lesson.title}</h1>
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                <span className="badge badge-outline">{lesson.duration_min} min</span>
                <span className="badge badge-outline">+{lesson.xp_reward} XP</span>
              </div>
            </div>

            <div className="lesson-content" dangerouslySetInnerHTML={{ __html: markdownToHtml(lesson.content) }} />

            {/* Inline prompt challenges embedded in reading phase */}
            {questions.filter(q => q.type === 'prompt-challenge').map(q => (
              <PromptChallenge
                key={q.id}
                challenge={q.prompt}
                example={q.explanation}
                onComplete={(xp) => {
                  setXpEarned(x => x + xp);
                  setPromptChallengeCompleted(true);
                  setShowXpPop(true);
                  setTimeout(() => setShowXpPop(false), 2000);
                }}
              />
            ))}

            <div className={styles.readingActions}>
              {prevLesson && (
                <Link href={`/learn/${course.slug}/${prevLesson.slug}`} className="btn btn-secondary btn-sm">← Prev</Link>
              )}
              <button onClick={handleStartQuiz} className="btn btn-primary btn-lg" id="lesson-continue-btn">
                {questions.filter(q => q.type !== 'prompt-challenge').length > 0 ? 'Take the Quiz →' : 'Complete Lesson →'}
              </button>
            </div>
          </div>
        )}

        {/* QUIZ PHASE */}
        {phase === 'quiz' && currentQ && (
          <div className={styles.quizContainer}>
            <div className={styles.quizHeader}>
              <p className="text-label">{currentQ.type === 'multiple-choice' ? 'Multiple Choice' : currentQ.type === 'true-false' ? 'True or False' : currentQ.type === 'order' ? 'Arrange in Order' : currentQ.type === 'write' ? 'Write Your Answer' : 'Quiz'}</p>
              <h2 className={styles.quizPrompt}>{currentQ.prompt}</h2>
            </div>

            {/* Multiple Choice */}
            {(currentQ.type === 'multiple-choice') && (
              <div className={styles.choicesGrid}>
                {currentQ.answers.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleSelectAnswer(a.id)}
                    className={`${styles.choiceBtn} ${selectedAnswer === a.id ? styles.choiceSelected : ''} ${answered && a.is_correct === 1 ? styles.choiceCorrect : ''} ${answered && selectedAnswer === a.id && a.is_correct === 0 ? styles.choiceWrong : ''}`}
                    disabled={answered}
                    id={`choice-${a.id}`}
                  >
                    <span className={styles.choiceLetter}>{String.fromCharCode(65 + currentQ.answers.indexOf(a))}</span>
                    <span className={styles.choiceText}>{a.text}</span>
                  </button>
                ))}
              </div>
            )}

            {/* True / False */}
            {currentQ.type === 'true-false' && (
              <div className={styles.tfGrid}>
                {currentQ.answers.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleSelectAnswer(a.id)}
                    className={`${styles.tfBtn} ${selectedAnswer === a.id ? styles.choiceSelected : ''} ${answered && a.is_correct === 1 ? styles.choiceCorrect : ''} ${answered && selectedAnswer === a.id && a.is_correct === 0 ? styles.choiceWrong : ''}`}
                    disabled={answered}
                    id={`tf-${a.text.toLowerCase()}`}
                  >
                    {a.text}
                  </button>
                ))}
              </div>
            )}

            {/* Order */}
            {currentQ.type === 'order' && (
              <div className={styles.orderList}>
                {orderItems.map((item, idx) => (
                  <div key={item.id} className={`${styles.orderItem} ${answered && item.is_correct === 1 ? styles.choiceCorrect : ''}`}>
                    <span className={styles.orderNum}>{idx + 1}</span>
                    <span className={styles.orderText}>{item.text}</span>
                    {!answered && (
                      <div className={styles.orderControls}>
                        <button onClick={() => moveOrderItem(idx, -1)} disabled={idx === 0} className={styles.orderBtn}>↑</button>
                        <button onClick={() => moveOrderItem(idx, 1)} disabled={idx === orderItems.length - 1} className={styles.orderBtn}>↓</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Write */}
            {currentQ.type === 'write' && (
              <div className={styles.writeContainer}>
                <textarea
                  value={writeInput}
                  onChange={e => setWriteInput(e.target.value)}
                  placeholder="Write your answer here..."
                  className={styles.writeTextarea}
                  disabled={answered}
                  rows={5}
                  id="write-answer"
                />
                {answered && (
                  <div className={styles.writeFeedback}>
                    <p style={{ fontWeight: 700, color: 'var(--white)', marginBottom: '8px' }}>Good effort!</p>
                    <p className="text-body">{currentQ.explanation}</p>
                  </div>
                )}
              </div>
            )}

            {/* Feedback */}
            {answered && (
              <div className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}>
                <p className={styles.feedbackTitle}>{isCorrect ? `CORRECT  +${10} XP` : 'NOT QUITE — TRY TO REMEMBER THIS'}</p>
                {currentQ.explanation && <p className={styles.feedbackExpl}>{currentQ.explanation}</p>}
              </div>
            )}

            {/* Actions */}
            <div className={styles.quizActions}>
              {!answered ? (
                <button
                  onClick={handleSubmitAnswer}
                  className="btn btn-primary"
                  disabled={!selectedAnswer && currentQ.type !== 'order' && currentQ.type !== 'write'}
                  id="check-answer-btn"
                >
                  Check Answer
                </button>
              ) : (
                <button onClick={handleNextQuestion} className="btn btn-primary" id="next-question-btn">
                  {quizIndex < totalQ - 1 ? 'Next Question →' : 'Complete Lesson →'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* COMPLETE PHASE */}
        {phase === 'complete' && (
          <div className={styles.completeContainer}>
            <div className={styles.completeBadge}>✓</div>
            <h2 className={styles.completeTitle}>LESSON COMPLETE</h2>
            <p className={styles.completeSubtitle}>{lesson.title}</p>

            <div className={styles.completeStats}>
              <div className={styles.completeStat}>
                <span className={styles.completeStatVal}>+{lesson.xp_reward + xpEarned}</span>
                <span className="text-label">XP EARNED</span>
              </div>
              {totalQ > 0 && (
                <div className={styles.completeStat}>
                  <span className={styles.completeStatVal}>{score}/{totalQ}</span>
                  <span className="text-label">CORRECT</span>
                </div>
              )}
            </div>

            <div className={styles.completeActions}>
              {nextLesson ? (
                <Link href={`/learn/${course.slug}/${nextLesson.slug}`} className="btn btn-primary btn-lg" id="next-lesson-btn">
                  Next Lesson →
                </Link>
              ) : (
                <Link href={`/learn/${course.slug}`} className="btn btn-primary btn-lg" id="course-complete-btn">
                  Back to Course →
                </Link>
              )}
              <Link href="/dashboard" className="btn btn-secondary">Dashboard</Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Simple markdown-to-html converter
function markdownToHtml(md: string): string {
  return md
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^\| (.+) \|$/gm, (line) => {
      const cells = line.split('|').filter(c => c.trim());
      return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (t) => '<table>' + t + '</table>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^✓ (.+)$/gm, '<li style="color:var(--gray-300)">✓ $1</li>')
    .replace(/^✗ (.+)$/gm, '<li style="color:var(--gray-500)">✗ $1</li>')
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (l) => '<ul>' + l + '</ul>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^([^<\n].+)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/\n/g, '');
}

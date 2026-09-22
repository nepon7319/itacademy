'use client';

import { useState, useTransition } from 'react';
import { checkPrompt, type PromptScore } from '@/app/api/check-prompt/action';
import styles from './PromptChallenge.module.css';

interface Props {
  challenge: string;
  example?: string;
  onComplete?: (xp: number) => void;
}

export default function PromptChallenge({ challenge, example, onComplete }: Props) {
  const [prompt, setPrompt] = useState('');
  const [score, setScore] = useState<PromptScore | null>(null);
  const [isPending, startTransition] = useTransition();
  const [tries, setTries] = useState(0);
  const [completed, setCompleted] = useState(false);

  function handleCheck() {
    if (!prompt.trim() || prompt.length < 20) return;
    setTries(t => t + 1);
    startTransition(async () => {
      const result = await checkPrompt(prompt, challenge);
      setScore(result);
      if (result.total >= 70 && !completed) {
        setCompleted(true);
        onComplete?.(result.total >= 85 ? 30 : 20);
      }
    });
  }

  function getGrade(total: number) {
    if (total >= 85) return { label: 'EXPERT', color: 'var(--white)' };
    if (total >= 70) return { label: 'GOOD', color: 'var(--gray-300)' };
    if (total >= 50) return { label: 'AVERAGE', color: 'var(--gray-500)' };
    return { label: 'WEAK', color: 'var(--gray-600)' };
  }

  const grade = score ? getGrade(score.total) : null;

  return (
    <div className={styles.challenge}>
      <div className={styles.challengeHeader}>
        <div className={styles.challengeBadge}>🤖 AI TASK</div>
        <h3 className={styles.challengeTitle}>{challenge}</h3>
        {example && (
          <details className={styles.hint}>
            <summary className={styles.hintToggle}>💡 Show example structure</summary>
            <div className={styles.hintContent}>
              <code>{example}</code>
            </div>
          </details>
        )}
      </div>

      <div className={styles.inputSection}>
        <label className={styles.inputLabel}>Write your prompt below:</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="You are... I am... Write me... Format: ... Length: ..."
          className={styles.promptInput}
          rows={6}
          id="prompt-challenge-input"
        />
        <div className={styles.inputMeta}>
          <span className={styles.wordCount}>{prompt.split(/\s+/).filter(Boolean).length} words</span>
          <button
            onClick={handleCheck}
            disabled={isPending || prompt.trim().length < 20}
            className={styles.checkBtn}
            id="check-prompt-btn"
          >
            {isPending ? 'Analyzing...' : tries === 0 ? 'Check My Prompt →' : 'Re-analyze →'}
          </button>
        </div>
      </div>

      {score && (
        <div className={styles.results} id="prompt-score-results">
          {/* Score header */}
          <div className={styles.scoreHeader}>
            <div className={styles.scoreBig}>
              <span className={styles.scoreNum}>{score.total}</span>
              <span className={styles.scoreLabel}>/100</span>
            </div>
            <div>
              <span className={styles.grade} style={{ color: grade?.color }}>{grade?.label}</span>
              <p className={styles.scoreSubtext}>
                {completed ? '✓ Passed! +XP awarded' : score.total < 70 ? 'Needs improvement — try again' : 'Keep improving!'}
              </p>
            </div>
          </div>

          {/* Dimension bars */}
          <div className={styles.dimensions}>
            {[
              { label: 'Clarity', score: score.clarity },
              { label: 'Context', score: score.context },
              { label: 'Instructions', score: score.instructions },
              { label: 'Constraints', score: score.constraints },
              { label: 'Output', score: score.output },
            ].map(d => (
              <div key={d.label} className={styles.dimension}>
                <div className={styles.dimensionTop}>
                  <span className={styles.dimensionLabel}>{d.label}</span>
                  <span className={styles.dimensionScore}>{d.score}%</span>
                </div>
                <div className={styles.dimensionBar}>
                  <div
                    className={styles.dimensionFill}
                    style={{
                      width: `${d.score}%`,
                      background: d.score >= 70 ? 'var(--white)' : d.score >= 40 ? 'var(--gray-400)' : 'var(--gray-700)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Feedback */}
          <div className={styles.feedback}>
            {score.whatWentWell.length > 0 && (
              <div className={styles.feedbackSection}>
                <p className={styles.feedbackTitle}>✓ What works well</p>
                <ul className={styles.feedbackList}>
                  {score.whatWentWell.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
            {score.improvements.length > 0 && (
              <div className={styles.feedbackSection}>
                <p className={styles.feedbackTitle}>↑ How to improve</p>
                <ul className={styles.feedbackList}>
                  {score.improvements.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Suggestion */}
          <div className={styles.suggestion}>
            <p className={styles.suggestionTitle}>AI Advisor says:</p>
            <p className={styles.suggestionText}>{score.suggestion}</p>
          </div>

          {/* Real AI Model Output Preview */}
          {score.simulatedResponse && (
            <div className={styles.aiOutputContainer}>
              <div className={styles.aiOutputHeader}>
                <span className={styles.aiOutputModel}>{score.modelUsed || 'AI Model Output'}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(score.simulatedResponse || '')}
                  className={styles.copyOutputBtn}
                  type="button"
                >
                  Copy Response
                </button>
              </div>
              <pre className={styles.aiOutputContent}>{score.simulatedResponse}</pre>
            </div>
          )}

          {score.total >= 70 && (
            <div className={styles.completedBanner}>
              <span>✓ CHALLENGE COMPLETE</span>
              {tries > 1 && <span className={styles.triesCount}>{tries} attempts</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

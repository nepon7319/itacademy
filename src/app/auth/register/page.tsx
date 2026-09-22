'use client';

import { useState, useActionState } from 'react';
import Link from 'next/link';
import { registerUser } from '@/app/actions';
import styles from '../auth.module.css';

const GOALS = [
  { value: 'freelance', label: 'I want to freelance', icon: '◈' },
  { value: 'remote-work', label: 'I want remote work', icon: '◉' },
  { value: 'business', label: 'I want to build a business', icon: '◎' },
  { value: 'content', label: 'I want to create content', icon: '◐' },
  { value: 'automation', label: 'I want to automate my work', icon: '◑' },
  { value: 'learn', label: 'I want to learn AI', icon: '◒' },
];

const initialState = { error: '' };

export default function RegisterPage() {
  const [state, action, pending] = useActionState(registerUser, initialState);
  const [showPass, setShowPass] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState('learn');

  return (
    <div className={styles.authPage}>
      <div className={styles.authBg}>
        <div className={styles.authBgGrid}></div>
      </div>
      <div className={styles.authContainer}>
        <Link href="/" className={styles.authLogo}>AI MONEY ACADEMY</Link>

        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1 className={styles.authTitle}>Start your AI journey.</h1>
            <p className={styles.authSubtitle}>100% free. No credit card required.</p>
          </div>

          <form action={action} className={styles.authForm}>
            <div className="form-group">
              <label htmlFor="username" className="input-label">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="yourname"
                className="input"
                required
                minLength={3}
                maxLength={20}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="input-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="input-label">Password</label>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min 8 characters"
                  className="input"
                  required
                  minLength={8}
                />
                <button type="button" className={styles.showPassBtn} onClick={() => setShowPass(!showPass)}>
                  {showPass ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <p className="input-label">What is your goal?</p>
              <div className={styles.goalGrid}>
                {GOALS.map(g => (
                  <label
                    key={g.value}
                    className={`${styles.goalOption} ${selectedGoal === g.value ? styles.goalSelected : ''}`}
                  >
                    <input
                      type="radio"
                      name="goal"
                      value={g.value}
                      checked={selectedGoal === g.value}
                      onChange={() => setSelectedGoal(g.value)}
                      style={{ display: 'none' }}
                    />
                    <span className={styles.goalIcon}>{g.icon}</span>
                    <span className={styles.goalLabel}>{g.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {state?.error && (
              <p className="form-error">{state.error}</p>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={pending} id="register-submit-btn">
              {pending ? 'Creating account...' : 'START LEARNING FREE →'}
            </button>
          </form>

          <p className={styles.authDisclaimer}>
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </p>

          <div className={styles.authDivider}><span>already have an account?</span></div>

          <p className={styles.authSwitch}>
            <Link href="/auth/login" className={styles.authSwitchLink}>Log in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

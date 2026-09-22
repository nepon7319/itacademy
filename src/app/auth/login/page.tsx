'use client';

import { useState, useActionState } from 'react';
import Link from 'next/link';
import { loginUser } from '@/app/actions';
import styles from '../auth.module.css';

const initialState = { error: '' };

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginUser, initialState);
  const [showPass, setShowPass] = useState(false);

  return (
    <div className={styles.authPage}>
      <div className={styles.authBg}>
        <div className={styles.authBgGrid}></div>
      </div>
      <div className={styles.authContainer}>
        <Link href="/" className={styles.authLogo}>AI MONEY ACADEMY</Link>

        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1 className={styles.authTitle}>Welcome back.</h1>
            <p className={styles.authSubtitle}>Continue your AI journey.</p>
          </div>

          <form action={action} className={styles.authForm}>
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
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="input"
                  required
                />
                <button type="button" className={styles.showPassBtn} onClick={() => setShowPass(!showPass)}>
                  {showPass ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {state?.error && (
              <p className="form-error">{state.error}</p>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={pending} id="login-submit-btn">
              {pending ? 'Logging in...' : 'LOG IN →'}
            </button>
          </form>

          <div className={styles.authDivider}>
            <span>or</span>
          </div>

          <p className={styles.authSwitch}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className={styles.authSwitchLink}>Start learning free →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

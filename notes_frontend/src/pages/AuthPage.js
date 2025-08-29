import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../theme.css';

/**
 * Authentication page offering login and registration.
 */
export default function AuthPage() {
  const { login, register, loading, error } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e) {
    e.preventDefault();
    if (mode === 'login') await login(email, password);
    else await register(email, password);
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-title">{mode === 'login' ? 'Welcome back' : 'Create account'}</div>
        <p className="auth-sub">
          {mode === 'login' ? 'Sign in to continue' : 'Start taking beautiful notes'}
        </p>
        <div className="flex-col gap-12">
          <label>
            <div className="section-title" style={{ marginTop: 0 }}>Email</div>
            <input
              className="input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            <div className="section-title">Password</div>
            <input
              className="input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          {error ? <div style={{ color: '#ef4444', fontSize: 14 }}>{error}</div> : null}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {mode === 'login' ? 'No account?' : 'Already have an account?'}{' '}
            <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

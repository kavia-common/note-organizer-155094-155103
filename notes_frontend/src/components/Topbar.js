import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../theme.css';

/**
 * Topbar with brand and account area.
 */
export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <span className="brand-dot" />
          <span>Notes</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user ? (
            <>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{user.email}</span>
              <button className="btn" onClick={logout} aria-label="Sign out">Sign out</button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

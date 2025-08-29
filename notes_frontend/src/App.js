import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import './theme.css';

/**
 * Root App wiring providers and rendering pages based on session state.
 */
function AppInner() {
  const { session } = useAuth();
  return session ? <HomePage /> : <AuthPage />;
}

// PUBLIC_INTERFACE
function App() {
  /** Application entry: wraps providers to share state across the app. */
  return (
    <AuthProvider>
      <NotesProvider>
        <AppInner />
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;

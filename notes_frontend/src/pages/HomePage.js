import React from 'react';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';
import NotesList from '../components/NotesList';
import NoteEditor from '../components/NoteEditor';
import '../theme.css';

/**
 * Home page with sidebar for tags, top bar for account, and main area for list+editor.
 */
export default function HomePage() {
  return (
    <>
      <Topbar />
      <div className="app-shell">
        <Sidebar />
        <main className="main">
          <div className="container">
            <div className="flex-col gap-16">
              <NotesList />
              <NoteEditor />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

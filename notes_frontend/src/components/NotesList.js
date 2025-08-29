import React from 'react';
import { useNotes } from '../contexts/NotesContext';
import { preview } from '../utils';
import '../theme.css';

/**
 * Grid of note cards filtered by search and tag.
 */
export default function NotesList() {
  const { notes, select, selectedId, loading } = useNotes();

  if (loading) return <div className="container">Loading…</div>;
  if (!notes.length) return <div className="container" style={{ color: 'var(--text-muted)' }}>No notes found.</div>;

  return (
    <div className="note-list">
      {notes.map(n => (
        <div
          key={n.id}
          className="note-card"
          onClick={() => select(n.id)}
          style={{ borderColor: selectedId === n.id ? 'rgba(25,118,210,0.4)' : undefined }}
          role="button"
          tabIndex={0}
        >
          <div className="note-card-title">{n.title || 'Untitled'}</div>
          <div className="note-card-preview">{preview(n.content)}</div>
          {!!(n.tags || []).length && (
            <div className="note-card-tags">
              {(n.tags || []).map(t => (
                <span key={t} className="tag">#{t}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

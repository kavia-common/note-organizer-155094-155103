import React, { useEffect, useMemo, useState } from 'react';
import { useNotes } from '../contexts/NotesContext';
import '../theme.css';

/**
 * Note editor/detail panel.
 */
export default function NoteEditor() {
  const { notes, selectedId, updateNote, deleteNote } = useNotes();
  const note = useMemo(() => notes.find(n => n.id === selectedId) || null, [notes, selectedId]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsText, setTagsText] = useState('');

  useEffect(() => {
    if (!note) { setTitle(''); setContent(''); setTagsText(''); return; }
    setTitle(note.title || '');
    setContent(note.content || '');
    setTagsText((note.tags || []).join(', '));
  }, [note]);

  if (!note) {
    return (
      <div className="editor">
        <div style={{ color: 'var(--text-muted)' }}>Select or create a note to get started.</div>
      </div>
    );
  }

  const parsedTags = tagsText.split(',').map(t => t.trim()).filter(Boolean);

  return (
    <div className="editor">
      <input
        className="input"
        placeholder="Note title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <div className="mt-16" />
      <textarea
        className="textarea"
        placeholder="Start typing…"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <div className="mt-16" />
      <input
        className="input"
        placeholder="Tags, comma separated (e.g., work, ideas)"
        value={tagsText}
        onChange={e => setTagsText(e.target.value)}
      />
      <div className="editor-actions">
        <button
          className="btn btn-primary"
          onClick={() => updateNote(note.id, { title, content, tags: parsedTags })}
        >
          Save
        </button>
        <button
          className="btn"
          onClick={() => { setTitle(note.title || ''); setContent(note.content || ''); setTagsText((note.tags || []).join(', ')); }}
        >
          Reset
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            if (window.confirm('Delete this note?')) deleteNote(note.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

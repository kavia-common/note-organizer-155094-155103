import React, { useState } from 'react';
import { useNotes } from '../contexts/NotesContext';
import '../theme.css';

/**
 * Sidebar with search, quick actions, and tags.
 */
export default function Sidebar() {
  const { tags, query, setQuery, activeTag, setActiveTag, createNote } = useNotes();
  const [newTag, setNewTag] = useState('');

  return (
    <aside className="sidebar">
      <div className="flex-col gap-12">
        <div className="flex gap-8">
          <input
            className="input w-full"
            placeholder="Search notes…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search notes"
          />
          <button className="btn btn-accent" onClick={() => createNote({ title: 'New note', content: '' })}>
            + New
          </button>
        </div>

        <div>
          <div className="section-title">Tags</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <button
              className={`tag ${!activeTag ? 'active' : ''}`}
              onClick={() => setActiveTag('')}
            >
              All
            </button>
            {tags.map(t => (
              <button
                key={t}
                className={`tag ${activeTag === t ? 'active' : ''}`}
                onClick={() => setActiveTag(t)}
              >
                #{t}
              </button>
            ))}
          </div>
          <div className="flex gap-8 mt-16">
            <input
              className="input"
              placeholder="Add tag (enter)"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  const val = newTag.trim();
                  if (val) {
                    // local add via createNote upserts tags indirectly; but we expose upsertTag in context
                  }
                }
              }}
              aria-label="New tag"
            />
            <AddTagButton value={newTag} setValue={setNewTag} />
          </div>
        </div>
      </div>
    </aside>
  );
}

function AddTagButton({ value, setValue }) {
  const { upsertTag } = useNotes();
  return (
    <button
      className="btn"
      onClick={async () => {
        const v = (value || '').trim();
        if (!v) return;
        await upsertTag(v);
        setValue('');
      }}
    >
      Add
    </button>
  );
}

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { notesApi } from '../utils';

const NotesContext = createContext(null);

// PUBLIC_INTERFACE
export function useNotes() {
  /** Hook to access notes state and actions */
  return useContext(NotesContext);
}

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  /** Provider that abstracts persistence via notesApi */
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const list = activeTag ? await notesApi.byTag(activeTag) : await notesApi.list(query);
    const t = await notesApi.tags();
    setNotes(list);
    setTags(t);
    setLoading(false);
  }

  useEffect(() => { refresh(); }, [query, activeTag]);

  const value = useMemo(() => ({
    notes, tags, query, activeTag, selectedId, loading,
    // PUBLIC_INTERFACE
    setQuery,
    // PUBLIC_INTERFACE
    setActiveTag: (t) => { setActiveTag(t === activeTag ? '' : t); },
    // PUBLIC_INTERFACE
    select: (id) => setSelectedId(id),

    // PUBLIC_INTERFACE
    async createNote(data = {}) {
      const n = await notesApi.create(data);
      setSelectedId(n.id);
      await refresh();
      return n;
    },
    // PUBLIC_INTERFACE
    async updateNote(id, data) {
      await notesApi.update(id, data);
      await refresh();
    },
    // PUBLIC_INTERFACE
    async deleteNote(id) {
      await notesApi.remove(id);
      if (selectedId === id) setSelectedId('');
      await refresh();
    },
    // PUBLIC_INTERFACE
    async upsertTag(t) {
      const list = await notesApi.upsertTag(t);
      setTags(list);
      return list;
    },
    // PUBLIC_INTERFACE
    async reload() { await refresh(); }
  }), [notes, tags, query, activeTag, selectedId, loading]);

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

/**
 * Utility helpers and a simple localStorage-backed API facade.
 * In a real app this would call a backend; here we persist locally.
 */

const STORAGE_KEYS = {
  SESSION: 'nf_session',
  NOTES: 'nf_notes',
  TAGS: 'nf_tags'
};

export const uid = () => Math.random().toString(36).slice(2, 10);
export const nowISO = () => new Date().toISOString();

/** Seed sample data on first run */
function seed() {
  const existing = localStorage.getItem(STORAGE_KEYS.NOTES);
  if (existing) return;
  const sampleTags = ['work', 'personal', 'ideas'];
  const sampleNotes = [
    {
      id: uid(),
      title: 'Welcome to Notes',
      content: 'This is a sample note. Edit me to get started.',
      tags: ['personal'],
      createdAt: nowISO(),
      updatedAt: nowISO()
    },
    {
      id: uid(),
      title: 'Project ideas',
      content: '• Minimalistic note app\n• AI-assisted writing\n• Offline-first sync',
      tags: ['ideas', 'work'],
      createdAt: nowISO(),
      updatedAt: nowISO()
    }
  ];
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(sampleNotes));
  localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(sampleTags));
}
seed();

/** Mock auth api */
export const authApi = {
  // PUBLIC_INTERFACE
  login: async (email, password) => {
    /** Simple email+password presence check; stores a token-like object */
    if (!email || !password) throw new Error('Email and password are required');
    const session = { token: uid(), user: { id: uid(), email } };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    return session;
  },
  // PUBLIC_INTERFACE
  register: async (email, password) => {
    /** Registers the user in local storage (mock) and logs them in */
    return authApi.login(email, password);
  },
  // PUBLIC_INTERFACE
  logout: async () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },
  // PUBLIC_INTERFACE
  getSession: () => {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  }
};

/** Mock notes api */
export const notesApi = {
  _read() {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    return raw ? JSON.parse(raw) : [];
  },
  _write(notes) {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },
  _readTags() {
    const raw = localStorage.getItem(STORAGE_KEYS.TAGS);
    return raw ? JSON.parse(raw) : [];
  },
  _writeTags(tags) {
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  },

  // PUBLIC_INTERFACE
  list: async (query = '') => {
    const q = query.trim().toLowerCase();
    const notes = notesApi._read();
    if (!q) return notes.sort((a,b) => b.updatedAt.localeCompare(a.updatedAt));
    return notes
      .filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.tags || []).some(t => t.toLowerCase().includes(q))
      )
      .sort((a,b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  // PUBLIC_INTERFACE
  byTag: async (tag) => {
    if (!tag) return notesApi.list('');
    const notes = notesApi._read();
    return notes.filter(n => (n.tags || []).includes(tag))
      .sort((a,b) => b.updatedAt.localeCompare(a.updatedAt));
  },

  // PUBLIC_INTERFACE
  get: async (id) => {
    const n = notesApi._read().find(n => n.id === id);
    if (!n) throw new Error('Note not found');
    return n;
  },

  // PUBLIC_INTERFACE
  create: async (payload) => {
    const note = {
      id: uid(),
      title: payload.title || 'Untitled',
      content: payload.content || '',
      tags: payload.tags || [],
      createdAt: nowISO(),
      updatedAt: nowISO()
    };
    const notes = notesApi._read();
    notes.unshift(note);
    notesApi._write(notes);
    notesApi._mergeTags(note.tags);
    return note;
  },

  // PUBLIC_INTERFACE
  update: async (id, payload) => {
    const notes = notesApi._read();
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) throw new Error('Note not found');
    const updated = {
      ...notes[idx],
      ...payload,
      updatedAt: nowISO()
    };
    notes[idx] = updated;
    notesApi._write(notes);
    notesApi._mergeTags(updated.tags || []);
    return updated;
  },

  // PUBLIC_INTERFACE
  remove: async (id) => {
    const notes = notesApi._read().filter(n => n.id !== id);
    notesApi._write(notes);
    return { ok: true };
  },

  // PUBLIC_INTERFACE
  tags: async () => notesApi._readTags(),

  // PUBLIC_INTERFACE
  upsertTag: async (tag) => {
    const t = (tag || '').trim();
    if (!t) return;
    const tags = notesApi._readTags();
    if (!tags.includes(t)) {
      tags.push(t);
      tags.sort();
      notesApi._writeTags(tags);
    }
    return tags;
  },

  _mergeTags: (newTags) => {
    const tags = notesApi._readTags();
    let changed = false;
    (newTags || []).forEach(t => {
      if (t && !tags.includes(t)) { tags.push(t); changed = true; }
    });
    if (changed) {
      tags.sort();
      notesApi._writeTags(tags);
    }
  }
};

/** Text helpers */
export const preview = (text, max = 120) => {
  const t = String(text || '').replace(/\n+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1) + '…' : t;
};

async function jsonFetch(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  health: () => jsonFetch('/api/health'),
  me: () => jsonFetch('/api/auth/me'),
  register: (body) => jsonFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => jsonFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => jsonFetch('/api/auth/logout', { method: 'POST' }),
  listNotes: () => jsonFetch('/api/notes'),
  createNote: (body) => jsonFetch('/api/notes', { method: 'POST', body: JSON.stringify(body) }),
  getNote: (id) => jsonFetch(`/api/notes/${id}`),
  deleteNote: (id) => jsonFetch(`/api/notes/${id}`, { method: 'DELETE' }),
};

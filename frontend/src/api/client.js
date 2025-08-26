const API_BASE = 'http://127.0.0.1:8000/api/v1'

async function jsonFetch(path, { method='GET', body, token, sendCookies=false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: sendCookies ? 'include' : 'same-origin',
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) {
    let detail = null
    try { detail = await res.json() } catch {}
    throw { status: res.status, detail }
  }
  return res.status === 204 ? null : res.json()
}

export const api = {
  // auth
  register: (email, password) => jsonFetch('/auth/register', { method:'POST', body:{ email, password }, sendCookies:true }),
  login: (email, password) => jsonFetch('/auth/login', { method:'POST', body:{ email, password }, sendCookies:true }),
  refresh: () => jsonFetch('/auth/refresh', { method:'POST', sendCookies:true }),
  logout: () => jsonFetch('/auth/logout', { method:'POST', sendCookies:true }),

  // notes
  listNotes: (token, params={}) => {
    const q = new URLSearchParams(params).toString()
    return jsonFetch(`/notes${q ? `?${q}`:''}`, { token })
  },
  getNote: (token, id) => jsonFetch(`/notes/${id}`, { token }),
  createNote: (token, payload) => jsonFetch('/notes', { method:'POST', token, body:payload }),
  updateNote: (token, id, payload) => jsonFetch(`/notes/${id}`, { method:'PUT', token, body:payload }),
  deleteNote: (token, id) => jsonFetch(`/notes/${id}`, { method:'DELETE', token }),
  // tags
  tags: (token) => jsonFetch('/tags', { token })
}

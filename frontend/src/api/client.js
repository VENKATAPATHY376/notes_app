const API_BASE = "http://127.0.0.1:8000/api/v1";

async function jsonFetch(path, { method = "GET", body, token, sendCookies = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  const finalToken = token || localStorage.getItem("access_token");
  if (finalToken) headers["Authorization"] = `Bearer ${finalToken}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: sendCookies ? "include" : "same-origin",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail = null;
    try {
      detail = await res.json();
    } catch {}
    throw { status: res.status, detail };
  }

  return res.status === 204 ? null : res.json();
}

export const api = {
  // 🔐 Auth APIs
  login: (email, password) =>
    jsonFetch("/auth/login", {
      method: "POST",
      body: { email, password },
      sendCookies: true,
    }),

  register: (email, password) =>
    jsonFetch("/auth/register", {
      method: "POST",
      body: { email, password },
      sendCookies: true,
    }),

  refresh: () =>
    jsonFetch("/auth/refresh", {
      method: "POST",
      sendCookies: true,
    }),

  logout: () =>
    jsonFetch("/auth/logout", {
      method: "POST",
      sendCookies: true,
    }),

  // 📝 Notes APIs
  createNote: (token, body) => jsonFetch("/notes", { method: "POST", body, token }),
  updateNote: (token, id, body) => jsonFetch(`/notes/${id}`, { method: "PUT", body, token }),
  getNote: (token, id) => jsonFetch(`/notes/${id}`, { method: "GET", token }),
  listNotes: (token, search = "") =>
    jsonFetch(`/notes?search=${encodeURIComponent(search)}`, {
      method: "GET",
      token,
    }),
  deleteNote: (token, id) =>
    jsonFetch(`/notes/${id}`, {
      method: "DELETE",
      token,
    }),
};

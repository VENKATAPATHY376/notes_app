// frontend/src/pages/NotesList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthProvider.jsx";

export default function NotesList() {
  const { accessToken } = useAuth();
  const token = accessToken || localStorage.getItem("access_token");
  const nav = useNavigate();

  const [notes, setNotes] = useState([]);
  const [err, setErr] = useState(null);
  const [search, setSearch] = useState("");   // ✅ state for search
  const [loading, setLoading] = useState(false);

  async function loadNotes(q = "") {
    try {
      setLoading(true);
      const data = await api.listNotes(token, q);
      setNotes(data.items);
    } catch {
      setErr("⚠️ Failed to load notes");
    } finally {
      setLoading(false);
    }
  }

  // load notes on mount and when search changes
  useEffect(() => {
    const delay = setTimeout(() => {
      loadNotes(search);
    }, 400); // debounce typing
    return () => clearTimeout(delay);
  }, [search, token]);

  async function togglePin(note) {
    try {
      const updated = await api.updateNote(token, note.id, {
        ...note,
        is_pinned: !note.is_pinned,
      });
      setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
    } catch {
      alert("Failed to update note");
    }
  }

  async function toggleArchive(note) {
    try {
      const updated = await api.updateNote(token, note.id, {
        ...note,
        is_archived: !note.is_archived,
      });
      setNotes(notes.map((n) => (n.id === updated.id ? updated : n)));
    } catch {
      alert("Failed to update note");
    }
  }

  const pinned = notes.filter((n) => n.is_pinned && !n.is_archived);
  const others = notes.filter((n) => !n.is_pinned && !n.is_archived);
  const archived = notes.filter((n) => n.is_archived);

  function renderSection(title, list) {
    if (list.length === 0) return null;
    return (
      <div style={{ marginBottom: 24 }}>
        <h3>{title}</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "16px",
          }}
        >
          {list.map((n) => (
            <div
              key={n.id}
              style={{
                padding: "16px",
                borderRadius: "10px",
                background: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h4
                style={{ cursor: "pointer" }}
                onClick={() => nav(`/notes/${n.id}`)}
              >
                {n.title || "(untitled)"}
              </h4>
              <p style={{ color: "#666" }}>
                {n.content ? n.content.slice(0, 80) + "..." : ""}
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="btn" onClick={() => togglePin(n)}>
                  {n.is_pinned ? "Unpin" : "Pin"}
                </button>
                <button className="btn" onClick={() => toggleArchive(n)}>
                  {n.is_archived ? "Unarchive" : "Archive"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
      {/* Top bar with search + New Note */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <input
          placeholder="🔍 Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}   // ✅ search handler
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            marginRight: 12,
            fontSize: "14px",
          }}
        />
        <button
          className="btn primary"
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => nav("/notes/new")}
        >
          ➕ New Note
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {err && <div style={{ color: "red" }}>{err}</div>}

      {renderSection("📌 Pinned", pinned)}
      {renderSection("📝 Others", others)}
      {renderSection("🗄 Archived", archived)}
    </div>
  );
}

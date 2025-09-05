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
  const [loading, setLoading] = useState(true);

  async function loadNotes() {
    try {
      setLoading(true);
      const data = await api.listNotes(token);
      setNotes(data.items);
    } catch (e) {
      setErr("⚠️ Failed to load notes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, [token]);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.deleteNote(token, id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch {
      alert("❌ Failed to delete note");
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
      {/* Top bar actions */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <input
          placeholder="🔍 Search notes..."
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

      {err && <div style={{ color: "red", marginBottom: 12 }}>{err}</div>}
      {loading && <p>Loading notes...</p>}

      {notes.length === 0 && !loading ? (
        <p style={{ color: "#666", textAlign: "center" }}>No notes yet. Click <b>New Note</b> to get started!</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "16px",
          }}
        >
          {notes.map((n) => (
            <div
              key={n.id}
              style={{
                padding: "16px",
                background: "#fff",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
              }}
              onClick={() => nav(`/notes/${n.id}`)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)")
              }
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 8px", fontSize: "18px", color: "#333" }}>
                  {n.title || "(Untitled)"}
                </h3>
                <p style={{ margin: "0 0 12px", color: "#555", fontSize: "14px" }}>
                  {n.content ? n.content.slice(0, 100) + "..." : "No content"}
                </p>
                {n.tags?.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    {n.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          display: "inline-block",
                          background: "#f1f3f5",
                          color: "#555",
                          fontSize: "12px",
                          padding: "4px 8px",
                          marginRight: "6px",
                          borderRadius: "6px",
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                <button
                  style={{
                    flex: 1,
                    padding: "6px",
                    border: "none",
                    background: "#eee",
                    cursor: "pointer",
                    borderRadius: "6px",
                    marginRight: "6px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    nav(`/notes/${n.id}/edit`);
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "6px",
                    border: "none",
                    background: "#ff4d4f",
                    color: "#fff",
                    cursor: "pointer",
                    borderRadius: "6px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(n.id);
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

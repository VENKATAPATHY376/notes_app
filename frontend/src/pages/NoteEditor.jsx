import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthProvider.jsx";

export default function NoteEditor() {
  const { id } = useParams();
  const isNew = !id;
  const { accessToken } = useAuth();
  const token = accessToken || localStorage.getItem("access_token");
  const nav = useNavigate();

  const [note, setNote] = useState({
    title: "",
    content: "",
    tags: [],
    is_pinned: false,
    is_archived: false,
    version: 1,
  });
  const [tagsText, setTagsText] = useState("");
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function load() {
      if (!isNew) {
        try {
          const n = await api.getNote(token, id);
          setNote(n);
          setTagsText((n.tags || []).join(", "));
        } catch (e) {
          console.error("Failed to load note:", e);
          setErr("Failed to load note");
        }
      }
    }
    load();
  }, [id, token, isNew]);

  async function save() {
    setErr(null);

    const payload = {
      title: note.title,
      content: note.content,
      tags: splitTags(tagsText),
    };

    try {
      if (isNew) {
        const created = await api.createNote(token, payload);
        nav(`/notes/${created.id}`);
      } else {
        const updated = await api.updateNote(token, id, {
          ...payload,
          is_pinned: note.is_pinned,
          is_archived: note.is_archived,
          version: note.version,
        });
        setNote(updated);
      }
    } catch (e) {
      console.error("Save failed:", e);
      if (e.status === 409) {
        const serverVersion = e?.detail?.server_version;
        setErr(`Version conflict. Server version is ${serverVersion}. Refreshing...`);
        try {
          const latest = await api.getNote(token, id);
          setNote(latest);
          setTagsText((latest.tags || []).join(", "));
        } catch {
          setErr("Failed to refresh note after conflict");
        }
      } else {
        setErr(e?.detail?.detail || e?.detail || "Failed to save");
      }
    }
  }

  function splitTags(s) {
    return s.split(",").map((t) => t.trim()).filter(Boolean);
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isNew ? "📝 New Note" : "✏️ Edit Note"}</h2>
        {err && <div style={styles.error}>{err}</div>}

        <input
          style={styles.input}
          placeholder="Enter a title..."
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
        />

        <textarea
          style={styles.textarea}
          placeholder="Start writing your note..."
          rows={12}
          value={note.content}
          onChange={(e) => setNote({ ...note, content: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Add tags (comma separated)"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
        />

        <div style={styles.toggleRow}>
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={note.is_pinned}
              onChange={(e) => setNote({ ...note, is_pinned: e.target.checked })}
            />
            Pin Note
          </label>
          <label style={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={note.is_archived}
              onChange={(e) => setNote({ ...note, is_archived: e.target.checked })}
            />
            Archive
          </label>
        </div>

        <div style={styles.btnRow}>
          <button style={styles.primaryBtn} onClick={save}>💾 Save</button>
          <button style={styles.secondaryBtn} onClick={() => nav("/notes")}>← Back</button>
        </div>

        {!isNew && (
          <div style={styles.version}>Version: {note.version}</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f0f4ff, #dbeafe)",
    padding: "1rem",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "700px",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: "600",
    marginBottom: "1.2rem",
    color: "#1f2937",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    marginBottom: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
    transition: "border 0.2s, box-shadow 0.2s",
  },
  textarea: {
    width: "100%",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "1rem",
    minHeight: "220px",
    marginBottom: "1rem",
    resize: "vertical",
    outline: "none",
    transition: "border 0.2s, box-shadow 0.2s",
  },
  toggleRow: {
    display: "flex",
    gap: "1.5rem",
    margin: "1rem 0",
  },
  toggleLabel: {
    fontSize: "0.95rem",
    color: "#374151",
  },
  btnRow: {
    display: "flex",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  primaryBtn: {
    flex: 1,
    padding: "0.9rem",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.25s ease, transform 0.2s ease",
  },
  secondaryBtn: {
    flex: 1,
    padding: "0.9rem",
    background: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.25s ease, transform 0.2s ease",
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "0.75rem",
    borderRadius: "6px",
    marginBottom: "1rem",
    fontSize: "0.9rem",
  },
  version: {
    marginTop: "1rem",
    fontSize: "0.85rem",
    color: "#6b7280",
  },
};

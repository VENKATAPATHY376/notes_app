import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthProvider.jsx";
// import icons from lucide-react if you want to use them
// import { Save, ArrowLeft, Pin, Archive, AlertCircle, Loader2 } from "lucide-react";

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

    // Base payload always includes these
    const payload = {
      title: note.title,
      content: note.content,
      tags: splitTags(tagsText),
    };

    console.log("Saving note with payload:", payload);

    try {
      if (isNew) {
        // ✅ Only send what NoteCreate expects
        const created = await api.createNote(token, payload);
        nav(`/notes/${created.id}`);
      } else {
        // ✅ Send full data for update
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
    <div style={{ maxWidth: 720, margin: "16px auto" }}>
      {err && <div style={{ color: "red", marginBottom: 12 }}>{err}</div>}
      <input
        placeholder="Title"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
      />
      <textarea
        placeholder="Write your note..."
        rows={12}
        style={{ marginTop: 8 }}
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
      />
      <input
        placeholder="tags, comma,separated"
        style={{ marginTop: 8 }}
        value={tagsText}
        onChange={(e) => setTagsText(e.target.value)}
      />
      <div className="row" style={{ marginTop: 8 }}>
        <label>
          <input
            type="checkbox"
            checked={note.is_pinned}
            onChange={(e) => setNote({ ...note, is_pinned: e.target.checked })}
          />{" "}
          pinned
        </label>
        <label>
          <input
            type="checkbox"
            checked={note.is_archived}
            onChange={(e) => setNote({ ...note, is_archived: e.target.checked })}
          />{" "}
          archived
        </label>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn primary" onClick={save}>
          Save
        </button>
        <button className="btn" onClick={() => nav("/notes")}>
          Back
        </button>
      </div>
      {!isNew && (
        <div style={{ marginTop: 8, color: "#666" }}>version: {note.version}</div>
      )}
    </div>
  );
}

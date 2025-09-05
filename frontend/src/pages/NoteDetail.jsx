// frontend/src/pages/NoteDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthProvider.jsx";

export default function NoteDetail() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const token = accessToken || localStorage.getItem("access_token");
  const nav = useNavigate();

  const [note, setNote] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const n = await api.getNote(token, id);
        setNote(n);
      } catch (e) {
        setErr("Failed to load note");
      }
    }
    load();
  }, [id, token]);

  if (err) return <div style={{ color: "red" }}>{err}</div>;
  if (!note) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 720, margin: "16px auto" }}>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <div>
        Tags: {note.tags.length ? note.tags.join(", ") : "none"}
      </div>
      <div>version: {note.version}</div>
      <div style={{ marginTop: 12 }}>
        <button className="btn" onClick={() => nav(`/notes/${id}/edit`)}>
          Edit
        </button>
        <button className="btn" onClick={() => nav("/notes")}>
          Back
        </button>
      </div>
    </div>
  );
}

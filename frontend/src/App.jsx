import { useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthProvider.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotesList from "./pages/NotesList.jsx";
import NoteEditor from "./pages/NoteEditor.jsx";
import NoteDetail from "./pages/NoteDetail.jsx";

export default function App() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="container">
      <div className="topbar">
        <h2 style={{ margin: 0 }}>📝 Notes</h2>
        <div>
          {user ? (
            <div className="row">
              <span>{user.email}</span>
              <button className="btn" onClick={() => nav("/notes/new")}>
                New
              </button>
              <button className="btn" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn primary" onClick={() => nav("/login")}>
              Login
            </button>
          )}
        </div>
      </div>

      {/* ✅ Only define routes here */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={<NotesList />} />
        <Route path="/notes/new" element={<NoteEditor />} />
        <Route path="/notes/:id" element={<NoteDetail />} />
        <Route path="/notes/:id/edit" element={<NoteEditor />} />
      </Routes>
    </div>
  );
}

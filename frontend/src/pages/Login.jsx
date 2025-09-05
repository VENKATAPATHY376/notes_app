import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login(email, password);
      localStorage.setItem("access_token", data.access_token);
      navigate("/notes");
    } catch (e) {
      setErr(e?.detail?.detail || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleLogin}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>Log in to continue to <b>Notes</b></p>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        {err && <p style={styles.error}>{err}</p>}

        <button type="submit" style={styles.button}>
          Login
        </button>

        <p style={styles.registerText}>
          Don’t have an account?
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f4ff 0%, #d9e8ff 100%)",
    padding: "1rem",
  },
  card: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    animation: "fadeIn 0.6s ease",
  },
  title: {
    marginBottom: "0.5rem",
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1a1a1a",
  },
  subtitle: {
    marginBottom: "1.8rem",
    color: "#666",
    fontSize: "1rem",
  },
  inputGroup: {
    textAlign: "left",
    marginBottom: "1.3rem",
  },
  label: {
    display: "block",
    fontWeight: 500,
    marginBottom: "0.4rem",
    color: "#333",
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
    fontSize: "0.95rem",
    transition: "all 0.25s ease",
  },
  button: {
    width: "100%",
    padding: "0.9rem",
    background: "#0056d2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "0.8rem",
  },
  error: {
    background: "#ffe6e6",
    color: "#e74c3c",
    padding: "0.6rem",
    borderRadius: "6px",
    marginBottom: "1rem",
    fontSize: "0.9rem",
    textAlign: "center",
  },
  registerText: {
    marginTop: "1.5rem",
    fontSize: "0.9rem",
    color: "#555",
  },
  link: {
    color: "#0056d2",
    fontWeight: 600,
    textDecoration: "none",
    marginLeft: "4px",
  },
};

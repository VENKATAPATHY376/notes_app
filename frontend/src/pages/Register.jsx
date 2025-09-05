import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await api.register(email, password);
      localStorage.setItem("access_token", data.access_token);
      navigate("/notes");
    } catch (e) {
      setErr(e?.detail?.detail || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleRegister}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Sign up to get started</p>

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
          Register
        </button>

        <p style={styles.registerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
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
    background: "#f5f7fa",
    padding: "1rem",
  },
  card: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "10px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    marginBottom: "0.3rem",
    fontSize: "1.8rem",
    color: "#333",
  },
  subtitle: {
    marginBottom: "1.5rem",
    color: "#666",
    fontSize: "0.95rem",
  },
  inputGroup: {
    textAlign: "left",
    marginBottom: "1.2rem",
  },
  label: {
    display: "block",
    fontWeight: 500,
    marginBottom: "0.4rem",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "6px",
    outline: "none",
    fontSize: "0.95rem",
    transition: "border 0.2s ease",
  },
  button: {
    width: "100%",
    padding: "0.8rem",
    background: "#4a90e2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s ease",
    marginTop: "0.5rem",
  },
  error: {
    color: "#e74c3c",
    marginBottom: "1rem",
    fontSize: "0.9rem",
  },
  registerText: {
    marginTop: "1.2rem",
    fontSize: "0.9rem",
    color: "#555",
  },
  link: {
    color: "#4a90e2",
    fontWeight: 500,
    textDecoration: "none",
    marginLeft: "4px",
  },
};

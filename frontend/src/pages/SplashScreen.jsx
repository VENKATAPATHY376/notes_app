// frontend/src/pages/SplashScreen.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: "fixed",      // cover the whole screen
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #f0f4ff 0%, #d9e8ff 100%)",
        color: "#222",
        fontFamily: "'Inter', sans-serif",
        textAlign: "center",
        margin: 0,
        padding: 0,
        zIndex: 9999,           // stays above Navbar/other UI
      }}
    >
      {loading ? (
        <>
          <div className="spinner" />
          <p style={{ marginTop: 16, fontSize: "16px", color: "#555" }}>
            Loading your notes...
          </p>
        </>
      ) : (
        <>
          <h1
            style={{
              fontSize: "36px",
              marginBottom: "12px",
              fontWeight: "700",
              color: "#1a1a1a",
            }}
          >
            📝 Welcome to <span style={{ color: "#0056d2" }}>Notes</span>
          </h1>
          <p
            style={{
              marginBottom: "24px",
              fontSize: "16px",
              color: "#444",
            }}
          >
            Organize your thoughts with ease
          </p>
          <button
            onClick={() => nav("/login")}
            style={{
              padding: "12px 28px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #0056d2",
              background: "#0056d2",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#003e9c";
              e.currentTarget.style.borderColor = "#003e9c";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0056d2";
              e.currentTarget.style.borderColor = "#0056d2";
            }}
          >
            🚀 Get Started
          </button>
        </>
      )}

      <style>
        {`
        .spinner {
          border: 4px solid rgba(0,0,0,0.1);
          border-top: 4px solid #0056d2;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
      </style>
    </div>
  );
}

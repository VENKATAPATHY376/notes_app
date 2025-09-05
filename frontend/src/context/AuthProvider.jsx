
import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("access_token") || null
  );

  useEffect(() => {
    if (accessToken) {
      // Optionally refresh token or fetch profile here
    }
  }, [accessToken]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setUser(res.user);
    setAccessToken(res.access_token);
    localStorage.setItem("access_token", res.access_token); // ✅ save token
    localStorage.setItem("user", JSON.stringify(res.user));
  };

  const register = async (email, password) => {
    const res = await api.register(email, password);
    setUser(res.user);
    setAccessToken(res.access_token);
    localStorage.setItem("access_token", res.access_token); // ✅ save token
    localStorage.setItem("user", JSON.stringify(res.user));
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {}
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("access_token"); // ✅ clear token
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

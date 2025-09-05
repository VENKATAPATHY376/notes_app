// frontend/src/auth.js
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",  // ✅ backend API prefix
  withCredentials: true,  // ✅ allow cookies (for refresh tokens, etc.)
});

router = APIRouter(tags=["auth"])

// Login request
export async function login(data) {
  return api.post("/auth/login", data);
}

// Register request
export async function register(data) {
  return api.post("/auth/register", data);
}

// Logout request (optional, if your backend supports it)
export async function logout() {
  return api.post("/auth/logout");
}

// Refresh token (optional, if you use cookie-based refresh)
export async function refresh() {
  return api.post("/auth/refresh");
}

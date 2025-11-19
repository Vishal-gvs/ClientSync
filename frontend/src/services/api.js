import axios from "axios";

// If running on Vercel → use VITE_API_BASE
// If running locally (localhost or 127.0.0.1) → fallback to local server
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const api = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:4000"                          // Local backend
    : import.meta.env.VITE_API_BASE,                   // Vercel → Render backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

import axios from "axios";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const PROD_API = import.meta.env.VITE_API_BASE?.replace(/\/$/, "");

if (!isLocalhost && !PROD_API) {
  // Warn loudly in production if API base is missing
  // Requests would otherwise go to the Vercel domain and fail.
  // Set VITE_API_BASE in Vercel Project Settings.
  console.error("VITE_API_BASE is not set. API requests will fail in production.");
}

const api = axios.create({
  baseURL: isLocalhost ? "http://localhost:4000" : PROD_API,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Prevent stale cached GET responses in production (Render/json-server may add caching)
api.interceptors.request.use((config) => {
  if (config.method?.toLowerCase() === "get") {
    config.params = { ...(config.params || {}), _ts: Date.now() };
    config.headers = { ...(config.headers || {}), "Cache-Control": "no-cache" };
  }
  return config;
});

export default api;

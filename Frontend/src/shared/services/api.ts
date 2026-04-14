import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { config } from "../config";

/**
 * Centralized Axios instance with JWT interceptor
 * and global error handling.
 */
const api: AxiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 120_000, // 2 minutes — AI battles can take time
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: attach JWT token ───────────────────────────
api.interceptors.request.use(
  (cfg: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && cfg.headers) {
      cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ───────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Only redirect if not already on an auth page
      if (
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

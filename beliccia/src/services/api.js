// src/services/api.js
import axios from "axios";
import { getSessionId } from "../utils/session";

export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const IMAGE_BASE =
  import.meta.env.VITE_IMAGE_BASE || "http://localhost:4000/imagenes";

const api = axios.create({
  baseURL: API_BASE,
});

// sesión fija una vez
const SESSION_ID = getSessionId();

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  
  config.headers["X-Session-Id"] = SESSION_ID;

  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    if (config.headers["Content-Type"]) {
      delete config.headers["Content-Type"];
    }
  }

  return config;
});

// si el backend devuelve X-Session-Id, lo guardamos
api.interceptors.response.use((response) => {
  const sid = response.headers?.["x-session-id"];
  if (sid) {
    localStorage.setItem("beliccia_cart_session_id", sid);
  }
  return response;
});

export default api;

// src/services/api.js
import axios from 'axios';

export const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const IMAGE_BASE =
  import.meta.env.VITE_IMAGE_BASE || 'http://localhost:4000/imagenes';

// OJO: sin headers fijos aquí
const api = axios.create({
  baseURL: API_BASE,
});

// Meter Authorization si hay token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Si el body es FormData, nos aseguramos de NO fijar Content-Type:
  // el navegador lo pone con el boundary correcto.
  if (config.data instanceof FormData) {
    if (config.headers['Content-Type']) {
      delete config.headers['Content-Type'];
    }
  }

  return config;
});

export default api;

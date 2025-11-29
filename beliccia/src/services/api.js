// src/services/api.js
import axios from 'axios';

// Tu VITE_API_URL ya incluye el path /api
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// VITE_IMAGE_BASE apunta ya a /imagenes
export const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE || 'http://localhost:4000/imagenes';

// Cliente Axios apuntando exactamente a lo que pongas en VITE_API_URL
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para meter el Authorization si hay token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

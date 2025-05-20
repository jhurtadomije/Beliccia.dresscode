// src/services/api.js
import axios from 'axios';

// Tu VITE_API_URL ya incluye el path /api/v1
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// VITE_IMAGE_BASE apunta ya a /imagenes
export const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE || 'http://localhost:3000/imagenes';

// Cliente Axios apuntando exactamente a lo que pongas en VITE_API_URL
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;

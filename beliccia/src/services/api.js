// src/services/api.js
import axios from 'axios';

// El import.meta.env.VITE_API_URL ya debería estar definido
export const API_BASE = import.meta.env.VITE_API_URL;
export const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE;

const api = axios.create({
  baseURL: API_BASE
});

export default api;

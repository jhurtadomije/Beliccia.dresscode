// src/services/imageUrl.js
import { API_BASE, IMAGE_BASE } from './api';

const apiOrigin = (() => {
  try { return new URL(API_BASE).origin; } catch { return ''; }
})();

export function resolveImageUrl(path) {
  if (!path) return '/placeholder.png';
  if (/^https?:\/\//i.test(path)) return path;           // ya absoluta
  if (path.startsWith('/api/'))  return `${apiOrigin}${path}`; // ruta de la API
  if (path.startsWith('/imagenes/')) {
    const rel = path.replace(/^\/?imagenes\//, '');
    return `${IMAGE_BASE}/${rel}`;                       // estático
  }
  return path; // fallback
}

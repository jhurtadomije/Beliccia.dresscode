// src/services/imageUrl.js
import { API_BASE, IMAGE_BASE } from './api';

export const PLACEHOLDER = '/placeholder.png';

// Origin puro de la API a partir de API_BASE (que suele incluir /api/v1)
export const API_ORIGIN = (() => {
  try { return new URL(API_BASE).origin; } catch { return ''; }
})();

// Une segmentos sin duplicar barras
function join(base, p) {
  const a = String(base || '').replace(/\/+$/, '');
  const b = String(p || '').replace(/^\/+/, '');
  return `${a}/${b}`;
}

export function resolveImageUrl(raw) {
  if (!raw) return PLACEHOLDER;
  const s = String(raw).trim();

  // 1) Absoluta → respetar
  if (/^https?:\/\//i.test(s)) return s;

  // 2) Endpoint de API → anteponer ORIGIN de la API
  if (s.startsWith('/api/')) return join(API_ORIGIN, s);

  // 3) Estáticos bajo /imagenes → normalizar y anteponer IMAGE_BASE
  if (s.startsWith('/imagenes/')) {
    const rel = s.replace(/^\/?imagenes\//, '');
    return join(IMAGE_BASE, rel);
  }

  // 4) Rutas relativas (ej. 'foo.jpg' o 'imagenes/foo.jpg')
  if (!s.startsWith('/')) {
    const rel = s.replace(/^imagenes\//, '');
    return join(IMAGE_BASE, rel);
  }

  // 5) Fallback: tratar como imagen relativa al bucket /imagenes
  return join(IMAGE_BASE, s.replace(/^\/+/, ''));
}

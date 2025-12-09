// src/utils/session.js
const KEY = "beliccia_cart_session_id";



export function getSessionId() {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = `sess_${crypto.randomUUID?.() ?? Date.now()}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function clearSessionId() {
  localStorage.removeItem(KEY);
}

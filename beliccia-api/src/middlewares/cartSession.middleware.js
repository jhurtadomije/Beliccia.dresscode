// src/middlewares/cartSession.middleware.js
import crypto from "crypto";

export function cartSession(req, res, next) {
  let sessionId =
    req.headers["x-cart-session-id"] ||
    req.headers["x-session-id"];

  if (!sessionId) {
    sessionId = `sess_${crypto.randomUUID()}`;
  }

  req.cartSessionId = String(sessionId);

  // Devuelve ambos por compatibilidad
  res.setHeader("x-cart-session-id", sessionId);
  res.setHeader("x-session-id", sessionId);

  next();
}


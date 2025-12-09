// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";

function getTokenFromHeader(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.split(" ")[1];
}

function normalizeUser(payload) {
  if (!payload) return null;

  // Soportamos varias formas típicas de JWT
  const id =
    payload.id ??
    payload.userId ??
    payload.usuario_id ??
    payload.sub ??
    null;

  return {
    ...payload,
    id: id ? Number(id) : id,
  };
}

// Middleware: requiere usuario autenticado
export function requireAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({
        error: true,
        message: "No autorizado. Falta token.",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        error: true,
        message: "JWT_SECRET no configurado en el servidor.",
      });
    }

    const payload = jwt.verify(token, secret);
    req.user = normalizeUser(payload);

    if (!req.user?.id) {
      return res.status(401).json({
        error: true,
        message: "Token válido pero sin identificador de usuario.",
      });
    }

    next();
  } catch (_err) {
    return res.status(401).json({
      error: true,
      message: "Token inválido o expirado.",
    });
  }
}

// auth opcional
export function requireAuthOptional(req, _res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  try {
    const token = header.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      req.user = null;
      return next();
    }

    const payload = jwt.verify(token, secret);
    req.user = normalizeUser(payload);
  } catch {
    req.user = null;
  }

  next();
}

// Middleware: requiere rol admin
export function requireAdmin(req, res, next) {
  const rol = req.user?.rol;

  if (rol !== "admin") {
    return res.status(403).json({
      error: true,
      message: "Permisos insuficientes (requiere admin).",
    });
  }

  next();
}

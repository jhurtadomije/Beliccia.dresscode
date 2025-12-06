import jwt from "jsonwebtoken";

// Middleware: requiere usuario autenticado
export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        error: true,
        message: "No autorizado. Falta token.",
      });
    }

    const token = header.split(" ")[1];

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        error: true,
        message: "JWT_SECRET no configurado en el servidor.",
      });
    }

    const payload = jwt.verify(token, secret);

    // Guardamos el usuario en la request
    // payload típico esperado: { id, email, rol, ... }
    req.user = payload;

    next();
  } catch (err) {
    return res.status(401).json({
      error: true,
      message: "Token inválido o expirado.",
    });
  }
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

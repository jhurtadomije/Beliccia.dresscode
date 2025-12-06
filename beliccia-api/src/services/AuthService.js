import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsuarioRepository from "../repositories/UsuarioRepository.js";

class AuthService {
  static async login(email, password) {
    const user = await UsuarioRepository.findByEmail(email);

    // Siempre mensaje genérico para no filtrar info
    if (!user) {
      const e = new Error("Credenciales inválidas");
      e.status = 401;
      throw e;
    }

    if (!user.activo) {
      const e = new Error("Usuario inactivo");
      e.status = 403;
      throw e;
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      const e = new Error("Credenciales inválidas");
      e.status = 401;
      throw e;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const e = new Error("JWT_SECRET no configurado");
      e.status = 500;
      throw e;
    }

    const payload = {
      id: user.id,
      email: user.email,
      rol: user.rol, // 👈 IMPORTANTE por tu SQL
      nombre: user.nombre,
    };

    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    const token = jwt.sign(payload, secret, { expiresIn });

    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        telefono: user.telefono,
        rol: user.rol,
      },
    };
  }

  static async register(data) {
    const { nombre, apellidos, email, password, telefono } = data;

    if (!nombre || !email || !password) {
      const e = new Error("Nombre, email y contraseña son obligatorios");
      e.status = 400;
      throw e;
    }

    const exists = await UsuarioRepository.findByEmail(email);
    if (exists) {
      const e = new Error("El email ya está registrado");
      e.status = 409;
      throw e;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await UsuarioRepository.crear({
      nombre,
      apellidos: apellidos || null,
      email,
      password_hash,
      telefono: telefono || null,
      rol: "cliente",
    });

    return {
      id: user.id,
      nombre: user.nombre,
      apellidos: user.apellidos,
      email: user.email,
      telefono: user.telefono,
      rol: user.rol,
    };
  }
}

export default AuthService;

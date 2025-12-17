import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
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

    //si la cuenta viene de google y no tiene contraseña, no podemos hacer login por password
    if (!user.password_hash) {
      const e = new Error(
        "Esta cuenta se creó con Google, por favor inicia sesión con Google."
      );
      e.status = 401;
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
      rol: user.rol,
      nombre: user.nombre,
    };

    const expiresIn = process.env.JWT_EXPIRES_IN || "1d";

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

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const e = new Error("JWT_SECRET no configurado");
      e.status = 500;
      throw e;
    }

    const payload = {
      id: user.id,
      email: user.email,
      rol: user.rol,
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

  static async loginWithGoogle(credential) {
    if (!credential) {
      const e = new Error("Falta credential de Google.");
      e.status = 400;
      throw e;
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      const e = new Error("error de GoogleClientId no configurado.");
      e.status = 500;
      throw e;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const e = new Error("JWT_SECRET no configurado");
      e.status = 500;
      throw e;
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    //  Verificar token con Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const nombre = payload?.given_name || payload?.name || "Usuario";
    const apellidos = payload?.family_name || "";
    const avatar = payload?.picture || null;
    const google_id = payload?.sub || null;

    if (!email) {
      const e = new Error("Google no devolvió email.");
      e.status = 400;
      throw e;
    }

    //  Buscar usuario por email
    let user = await UsuarioRepository.findByEmail(email);

    // Si no existe, crear uno
    if (!user) {
      user = await UsuarioRepository.createGoogleUser({
        nombre,
        apellidos,
        email,
        avatar,
        rol: "cliente",
        provider: "google",
        google_id,
      });
    }

    // 4) Emitimos nuestro JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol,
      },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { token, user };
  }
}

export default AuthService;

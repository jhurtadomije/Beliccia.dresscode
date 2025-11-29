import UsuarioRepository from '../repositories/UsuarioRepository.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

class AuthService {
  static async register({ nombre, apellidos, email, password, telefono }) {
    const existing = await UsuarioRepository.findByEmail(email);
    if (existing) {
      const error = new Error('Ya existe un usuario con ese email');
      error.status = 400;
      throw error;
    }

    const passwordHash = await hashPassword(password);

    const usuario = await UsuarioRepository.create({
      nombre,
      apellidos: apellidos || null,
      email,
      passwordHash,
      telefono: telefono || null
    });

    const token = signToken({ id: usuario.id, email: usuario.email, rol: usuario.rol });

    return {
      usuario,
      token
    };
  }

  static async login(email, password) {
    const usuario = await UsuarioRepository.findByEmail(email);
    if (!usuario) {
      const error = new Error('Credenciales incorrectas');
      error.status = 401;
      throw error;
    }

    const ok = await comparePassword(password, usuario.password_hash);
    if (!ok) {
      const error = new Error('Credenciales incorrectas');
      error.status = 401;
      throw error;
    }

    const token = signToken({ id: usuario.id, email: usuario.email, rol: usuario.rol });

    // devolvemos solo los campos necesarios, no el hash
    const { password_hash, ...safeUser } = usuario;

    return {
      usuario: safeUser,
      token
    };
  }
}

export default AuthService;

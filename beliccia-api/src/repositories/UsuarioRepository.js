import { getPool } from "../config/db.js";

class UsuarioRepository {
  static async findByEmail(email) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT * FROM usuarios WHERE email = ? LIMIT 1`,
      [email]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT * FROM usuarios WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }

  static async crear({
    nombre,
    apellidos = null,
    email,
    password_hash,
    telefono = null,
    rol = "cliente",
  }) {
    const pool = getPool();

    const [result] = await pool.query(
      `
      INSERT INTO usuarios
        (nombre, apellidos, email, password_hash, telefono, rol)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [nombre, apellidos, email, password_hash, telefono, rol]
    );

    return this.findById(result.insertId);
    }
}

export default UsuarioRepository;

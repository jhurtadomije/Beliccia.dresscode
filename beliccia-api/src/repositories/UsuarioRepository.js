import { getPool } from '../config/db.js';

class UsuarioRepository {
  static async findByEmail(email) {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT id, nombre, apellidos, email, telefono, rol, activo, created_at
       FROM usuarios
       WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async create({ nombre, apellidos, email, passwordHash, telefono }) {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, apellidos, email, password_hash, telefono, rol)
       VALUES (?, ?, ?, ?, ?, 'cliente')`,
      [nombre, apellidos, email, passwordHash, telefono]
    );

    return this.findById(result.insertId);
  }

  static async updateRole(id, rol) {
    const pool = getPool();
    await pool.query(
      `UPDATE usuarios SET rol = ? WHERE id = ?`,
      [rol, id]
    );
    return this.findById(id);
  }
}

export default UsuarioRepository;

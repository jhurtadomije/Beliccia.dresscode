import { getPool } from "../config/db.js";


class UsuarioRepository {
  static async findAll({
    rol = null,
    activo = null,
    q = "",
    limit = 20,
    offset = 0,
  } = {}) {
    const pool = getPool();

    const where = [];
    const values = [];

    if (rol) {
      where.push("rol = ?");
      values.push(rol);
    }

    if (activo !== null && activo !== undefined && activo !== "") {
      where.push("activo = ?");
      values.push(Number(activo));
    }

    if (q) {
      where.push("(nombre LIKE ? OR apellidos LIKE ? OR email LIKE ?)");
      values.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `
      SELECT id, nombre, apellidos, email, telefono, rol, activo, created_at
      FROM usuarios
      ${whereSql}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
      `,
      [...values, Number(limit), Number(offset)]
    );

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM usuarios ${whereSql}`,
      values
    );

    return { usuarios: rows, total: countRows[0]?.total || 0 };
  }



  static async findByEmail(email) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT * FROM usuarios WHERE email = ? LIMIT 1`,
      [email]
    );
    return rows[0] || null;
  }

  // ✅ Google user sin columnas “inventadas”
  static async createGoogleUser({ nombre, apellidos, email, rol }) {
    const pool = getPool();

    const [res] = await pool.query(
      `
      INSERT INTO usuarios (nombre, apellidos, email, password_hash, telefono, rol)
      VALUES (?, ?, ?, NULL, NULL, ?)
      `,
      [nombre, apellidos || null, email, rol || "cliente"]
    );

    return this.findById(res.insertId);
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

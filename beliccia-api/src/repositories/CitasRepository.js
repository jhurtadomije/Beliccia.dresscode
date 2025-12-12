// src/repositories/CitasRepository.js
import { getPool } from "../config/db.js";

const VALID_ESTADOS = ["pendiente", "confirmada", "rechazada", "completada"];
const VALID_TIPOS = ["cita", "info"];

export default class CitasRepository {
  static async crear({
    usuario_id = null,
    nombre,
    email,
    telefono = null,
    tipo = "info",
    mensaje = null,
    producto_id = null,
    categoria_id = null,
    fecha_solicitada = null,
  }) {
    const pool = getPool();

    const [result] = await pool.execute(
      `
      INSERT INTO citas
        (usuario_id, nombre, email, telefono, tipo, mensaje, producto_id, categoria_id, fecha_solicitada)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        usuario_id,
        nombre,
        email,
        telefono,
        tipo,
        mensaje,
        producto_id,
        categoria_id,
        fecha_solicitada,
      ]
    );

    const [rows] = await pool.execute(`SELECT * FROM citas WHERE id = ?`, [
      result.insertId,
    ]);

    return rows[0];
  }

  // ✅ Para el cliente: sus citas por usuario_id, pero también las antiguas por email (si usuario_id era NULL)
  static async listarParaUsuario({ usuarioId, email }) {
    const pool = getPool();
    const [rows] = await pool.execute(
      `
      SELECT *
      FROM citas
      WHERE (usuario_id = ?)
         OR (usuario_id IS NULL AND LOWER(email) = LOWER(?))
      ORDER BY created_at DESC
      `,
      [usuarioId, email]
    );
    return rows;
  }

  // Mantengo tu método por si lo usas en algún lado
  static async listarPorUsuario(usuarioId) {
    const pool = getPool();
    const [rows] = await pool.execute(
      `
      SELECT *
      FROM citas
      WHERE usuario_id = ?
      ORDER BY created_at DESC
      `,
      [usuarioId]
    );
    return rows;
  }

  static async listarTodas({ estado = null, tipo = null } = {}) {
    const pool = getPool();

    const where = [];
    const values = [];

    if (estado && VALID_ESTADOS.includes(estado)) {
      where.push("estado = ?");
      values.push(estado);
    }
    if (tipo && VALID_TIPOS.includes(tipo)) {
      where.push("tipo = ?");
      values.push(tipo);
    }

    const sql = `
      SELECT *
      FROM citas
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute(sql, values);
    return rows;
  }

  static async obtenerPorId(id) {
    const pool = getPool();
    const [rows] = await pool.execute(
      `SELECT * FROM citas WHERE id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  }

  // ✅ Permisos cliente: por usuario_id o por email si usuario_id NULL (para citas creadas “sin login”)
  static async obtenerPorIdYUsuarioOEmail(id, usuarioId, email) {
    const pool = getPool();
    const [rows] = await pool.execute(
      `
      SELECT *
      FROM citas
      WHERE id = ?
        AND (
          usuario_id = ?
          OR (usuario_id IS NULL AND LOWER(email) = LOWER(?))
        )
      LIMIT 1
      `,
      [id, usuarioId, email]
    );
    return rows[0] || null;
  }

  // ✅ IMPORTANTE: el campo correcto es "nota_interna" (no "notas_internas")
  static async actualizar(id, { estado, fecha_solicitada, fecha_confirmada, nota_interna }) {
    const pool = getPool();

    const fields = [];
    const values = [];

    if (estado !== undefined) {
      // opcional: validación aquí
      if (!VALID_ESTADOS.includes(estado)) throw new Error("Estado inválido");
      fields.push("estado = ?");
      values.push(estado);
    }
    if (fecha_solicitada !== undefined) {
      fields.push("fecha_solicitada = ?");
      values.push(fecha_solicitada);
    }
    if (fecha_confirmada !== undefined) {
      fields.push("fecha_confirmada = ?");
      values.push(fecha_confirmada);
    }
    if (nota_interna !== undefined) {
      fields.push("nota_interna = ?");
      values.push(nota_interna);
    }

    if (!fields.length) return await this.obtenerPorId(id);

    values.push(id);

    const [r] = await pool.execute(
      `UPDATE citas SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    if (r.affectedRows === 0) return null;
    return await this.obtenerPorId(id);
  }

  static async borrar(id) {
    const pool = getPool();
    const [r] = await pool.execute(`DELETE FROM citas WHERE id = ?`, [id]);
    return r.affectedRows > 0;
  }
}

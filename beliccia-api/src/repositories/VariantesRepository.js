// src/repositories/VariantesRepository.js
import { getPool } from "../config/db.js";

class VariantesRepository {
  static async listarPorProducto(productoId) {
    const pool = getPool();
    const [rows] = await pool.query(
      `
      SELECT id, producto_id, sku, talla, color, stock, activo
      FROM producto_variantes
      WHERE producto_id = ?
      ORDER BY id ASC
      `,
      [productoId]
    );
    return rows;
  }

  static async crear({ producto_id, sku, talla, color, stock = 0, activo = 1 }) {
    const pool = getPool();

    const [result] = await pool.query(
      `
      INSERT INTO producto_variantes
        (producto_id, sku, talla, color, stock, activo)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        producto_id,
        sku,
        talla ?? null,
        color ?? null,
        Number(stock ?? 0),
        activo ? 1 : 0,
      ]
    );

    const [rows] = await pool.query(
      `SELECT * FROM producto_variantes WHERE id = ?`,
      [result.insertId]
    );

    return rows[0] || null;
  }

  static async borrarPorProducto(productoId) {
    const pool = getPool();
    await pool.query(
      `DELETE FROM producto_variantes WHERE producto_id = ?`,
      [productoId]
    );
  }

  static async update(id, data) {
    const pool = getPool();

    const fields = [];
    const params = [];

    Object.entries(data).forEach(([key, value]) => {
      fields.push(`${key} = ?`);
      params.push(value);
    });

    if (!fields.length) {
      const [rows] = await pool.query(
        `SELECT * FROM producto_variantes WHERE id = ?`,
        [id]
      );
      return rows[0] || null;
    }

    params.push(id);

    await pool.query(
      `UPDATE producto_variantes SET ${fields.join(", ")} WHERE id = ?`,
      params
    );

    const [rows] = await pool.query(
      `SELECT * FROM producto_variantes WHERE id = ?`,
      [id]
    );

    return rows[0] || null;
  }

  static async delete(id) {
    const pool = getPool();
    await pool.query(`DELETE FROM producto_variantes WHERE id = ?`, [id]);
  }
}

export default VariantesRepository;

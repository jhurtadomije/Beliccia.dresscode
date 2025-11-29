// src/repositories/VariantesRepository.js
// src/repositories/VariantesRepository.js
import { getPool } from "../config/db.js";

class VariantesRepository {
  static async crear({ producto_id, sku, talla, color, stock }) {
    const pool = await getPool();

    const safeStock = Number.isFinite(Number(stock))
      ? Number(stock)
      : 0;

    const [result] = await pool.query(
      `INSERT INTO producto_variantes
         (producto_id, sku, talla, color, stock, activo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        producto_id,           // FK al producto
        sku,                   // p.ej: "chiara-44"
        talla || null,         // "44", "M", etc.
        color || null,         // de momento puede ir null
        safeStock,             // número seguro
        1,                     // activo = 1
      ]
    );

    return result.insertId;
  }

  // opcional, por si luego quieres usarlo:
  static async listarPorProducto(producto_id) {
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT *
         FROM producto_variantes
        WHERE producto_id = ?
        ORDER BY talla ASC, id ASC`,
      [producto_id]
    );
    return rows;
  }

  static async borrarPorProducto(producto_id) {
    const pool = await getPool();
    await pool.query(
      'DELETE FROM producto_variantes WHERE producto_id = ?',
      [producto_id]
    );
  }
}

export default VariantesRepository;

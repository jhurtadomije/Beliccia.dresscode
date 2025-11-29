// src/repositories/ImagenesRepository.js
import { getPool } from '../config/db.js';

class ImagenesRepository {
  /**
   * Crea un registro de imagen de producto.
   * Espera:
   * {
   *   producto_id,
   *   url,
   *   alt_text,
   *   es_portada,
   *   orden
   * }
   */
  static async crear({ producto_id, url, alt_text = null, es_portada = 0, orden = 0 }) {
    const pool = await getPool();
    const [result] = await pool.query(
      `INSERT INTO producto_imagenes
        (producto_id, url, alt_text, es_portada, orden)
       VALUES (?, ?, ?, ?, ?)`,
      [
        producto_id,
        url,
        alt_text,
        es_portada ? 1 : 0,
        Number(orden ?? 0),
      ]
    );
    return result.insertId;
  }

  static async listarPorProducto(producto_id) {
    const pool = await getPool();
    const [rows] = await pool.query(
      `SELECT id, producto_id, url, alt_text, es_portada, orden
       FROM producto_imagenes
       WHERE producto_id = ?
       ORDER BY orden ASC, id ASC`,
      [producto_id]
    );
    return rows;
  }

  static async borrarPorProducto(producto_id) {
    const pool = await getPool();
    await pool.query(
      'DELETE FROM producto_imagenes WHERE producto_id = ?',
      [producto_id]
    );
  }
}

export default ImagenesRepository;

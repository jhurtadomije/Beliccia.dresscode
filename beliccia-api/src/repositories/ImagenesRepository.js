// src/repositories/ImagenesRepository.js
import { getPool } from "../config/db.js";

class ImagenesRepository {
  static async listarPorProducto(productoId) {
    const pool = getPool();

    const [rows] = await pool.query(
      `
      SELECT id, producto_id, url, alt_text, es_portada, orden
      FROM producto_imagenes
      WHERE producto_id = ?
      ORDER BY es_portada DESC, orden ASC, id ASC
      `,
      [productoId]
    );

    return rows;
  }

  static async crear({
    producto_id,
    url,
    alt_text = null,
    es_portada = 0,
    orden = 0,
  }) {
    const pool = getPool();

    const [result] = await pool.query(
      `
      INSERT INTO producto_imagenes
        (producto_id, url, alt_text, es_portada, orden)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        producto_id,
        url,
        alt_text,
        es_portada ? 1 : 0,
        Number(orden ?? 0),
      ]
    );

    const [rows] = await pool.query(
      `SELECT * FROM producto_imagenes WHERE id = ?`,
      [result.insertId]
    );

    return rows[0] || null;
  }

  static async borrarPorProducto(productoId) {
    const pool = getPool();

    await pool.query(
      `DELETE FROM producto_imagenes WHERE producto_id = ?`,
      [productoId]
    );
  }

  static async setPortada(productoId, imagenId) {
    const pool = getPool();

    // Quitar portada actual
    await pool.query(
      `
      UPDATE producto_imagenes
      SET es_portada = 0
      WHERE producto_id = ?
      `,
      [productoId]
    );

    // Poner nueva portada
    await pool.query(
      `
      UPDATE producto_imagenes
      SET es_portada = 1
      WHERE id = ? AND producto_id = ?
      `,
      [imagenId, productoId]
    );

    const [rows] = await pool.query(
      `SELECT * FROM producto_imagenes WHERE producto_id = ? ORDER BY es_portada DESC, orden ASC`,
      [productoId]
    );

    return rows;
  }

  static async delete(id) {
    const pool = getPool();
    await pool.query(`DELETE FROM producto_imagenes WHERE id = ?`, [id]);
  }
}

export default ImagenesRepository;

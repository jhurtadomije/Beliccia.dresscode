import { getPool } from "../config/db.js";

class ColeccionesRepository {
  static async findAll() {
    const pool = getPool();

    const [rows] = await pool.query(
      `
      SELECT id, nombre, slug, descripcion, activa, fecha_inicio, fecha_fin
      FROM colecciones
      ORDER BY nombre ASC
      `
    );

    return rows;
  }

  static async findActivas() {
    const pool = getPool();

    const [rows] = await pool.query(
      `
      SELECT id, nombre, slug, descripcion, activa, fecha_inicio, fecha_fin
      FROM colecciones
      WHERE activa = 1
      ORDER BY nombre ASC
      `
    );

    return rows;
  }
}

export default ColeccionesRepository;

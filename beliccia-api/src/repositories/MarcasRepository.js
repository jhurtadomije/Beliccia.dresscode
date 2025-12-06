import { getPool } from "../config/db.js";

class MarcasRepository {
  static async findAll() {
    const pool = getPool();

    const [rows] = await pool.query(
      `
      SELECT id, nombre, slug, descripcion, activa
      FROM marcas
      ORDER BY nombre ASC
      `
    );

    return rows;
  }

  static async findActivas() {
    const pool = getPool();

    const [rows] = await pool.query(
      `
      SELECT id, nombre, slug, descripcion, activa
      FROM marcas
      WHERE activa = 1
      ORDER BY nombre ASC
      `
    );

    return rows;
  }
}

export default MarcasRepository;

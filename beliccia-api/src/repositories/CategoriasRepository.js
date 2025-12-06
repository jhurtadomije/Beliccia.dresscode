import { getPool } from "../config/db.js";

class CategoriasRepository {
  static async findAll() {
    const pool = getPool();

    const [rows] = await pool.query(
      `
      SELECT id, nombre, slug, descripcion, padre_id
      FROM categorias
      ORDER BY nombre ASC
      `
    );

    return rows;
  }
}

export default CategoriasRepository;

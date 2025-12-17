import { getPool } from "../config/db.js";

class CarritoRepository {
  static async findActiveByUserId(usuarioId) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT * FROM carritos WHERE usuario_id = ? AND estado = 'activo' LIMIT 1`,
      [usuarioId]
    );
    return rows[0] || null;
  }

  static async findActiveBySessionId(sessionId) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT * FROM carritos WHERE session_id = ? AND estado = 'activo' LIMIT 1`,
      [sessionId]
    );
    return rows[0] || null;
  }

  static async createForUser(usuarioId) {
    const pool = getPool();
    const [res] = await pool.query(
      `INSERT INTO carritos (usuario_id, estado) VALUES (?, 'activo')`,
      [usuarioId]
    );
    const [rows] = await pool.query(`SELECT * FROM carritos WHERE id = ?`, [
      res.insertId,
    ]);
    return rows[0];
  }

  static async createForSession(sessionId) {
    const pool = getPool();
    const [res] = await pool.query(
      `INSERT INTO carritos (session_id, estado) VALUES (?, 'activo')`,
      [sessionId]
    );
    const [rows] = await pool.query(`SELECT * FROM carritos WHERE id = ?`, [
      res.insertId,
    ]);
    return rows[0];
  }

  static async getOrCreate({ usuarioId = null, sessionId = null }) {
    if (usuarioId) {
      const existing = await this.findActiveByUserId(usuarioId);
      if (existing) return existing;
      return this.createForUser(usuarioId);
    }

    if (sessionId) {
      const existing = await this.findActiveBySessionId(sessionId);
      if (existing) return existing;
      return this.createForSession(sessionId);
    }

    
    return null;
  }
}

export default CarritoRepository;

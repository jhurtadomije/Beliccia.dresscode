// beliccia-api/src/repositories/PedidoRepository.js
import { getPool } from '../config/db.js';

const PedidoRepository = {
  async findAll() {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM pedidos ORDER BY created_at DESC'
    );
    return rows;
  },

  async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT * FROM pedidos WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create(data) {
    const pool = getPool();
    const {
      usuario_id,
      estado = 'pendiente',
      total = 0,
    } = data;

    const [result] = await pool.query(
      `INSERT INTO pedidos (usuario_id, estado, total)
       VALUES (?, ?, ?)`,
      [usuario_id, estado, total]
    );

    return this.findById(result.insertId);
  },

  async update(id, data) {
    const pool = getPool();
    const {
      estado,
      total,
    } = data;

    await pool.query(
      `UPDATE pedidos
         SET estado = COALESCE(?, estado),
             total  = COALESCE(?, total)
       WHERE id = ?`,
      [estado ?? null, total ?? null, id]
    );

    return this.findById(id);
  },

  async remove(id) {
    const pool = getPool();
    const [result] = await pool.query(
      'DELETE FROM pedidos WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },
};

export default PedidoRepository;

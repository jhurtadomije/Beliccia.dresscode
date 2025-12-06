import { getPool } from "../config/db.js";

class PedidoRepository {
  static async findAll({ estado = null, usuario_id = null, limit = 12, offset = 0 }) {
    const pool = getPool();

    const params = [];
    const filters = ["1=1"];

    if (estado) {
      filters.push("p.estado = ?");
      params.push(estado);
    }
    if (usuario_id) {
      filters.push("p.usuario_id = ?");
      params.push(usuario_id);
    }

    const where = filters.join(" AND ");

    const [rows] = await pool.query(
      `
      SELECT p.*
      FROM pedidos p
      WHERE ${where}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM pedidos p
      WHERE ${where}
      `,
      params
    );

    return { pedidos: rows, total: countRows[0]?.total ?? 0 };
  }

  static async findById(id) {
    const pool = getPool();

    const [pedidoRows] = await pool.query(
      `SELECT * FROM pedidos WHERE id = ? LIMIT 1`,
      [id]
    );
    const pedido = pedidoRows[0];
    if (!pedido) return null;

    const [items] = await pool.query(
      `
      SELECT *
      FROM pedido_items
      WHERE pedido_id = ?
      ORDER BY id ASC
      `,
      [id]
    );

    return { ...pedido, items };
  }

  // Crea pedido + items en transacción
  static async crearPedidoCompleto({ pedidoData, items }) {
    const pool = getPool();
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        `
        INSERT INTO pedidos (
          usuario_id, numero_pedido, estado,
          total_items, subtotal, total_iva,
          gastos_envio, descuento_total, total,
          envio_nombre, envio_direccion, envio_ciudad,
          envio_provincia, envio_cp, envio_pais,
          envio_telefono,
          metodo_pago_id, estado_pago,
          notas_cliente, notas_internas
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          pedidoData.usuario_id,
          pedidoData.numero_pedido,
          pedidoData.estado || "pendiente",

          pedidoData.total_items,
          pedidoData.subtotal,
          pedidoData.total_iva,

          pedidoData.gastos_envio ?? 0,
          pedidoData.descuento_total ?? 0,
          pedidoData.total,

          pedidoData.envio_nombre,
          pedidoData.envio_direccion,
          pedidoData.envio_ciudad,
          pedidoData.envio_provincia,
          pedidoData.envio_cp,
          pedidoData.envio_pais,
          pedidoData.envio_telefono ?? null,

          pedidoData.metodo_pago_id ?? null,
          pedidoData.estado_pago || "pendiente",

          pedidoData.notas_cliente ?? null,
          pedidoData.notas_internas ?? null,
        ]
      );

      const pedidoId = result.insertId;

      for (const it of items) {
        await conn.query(
          `
          INSERT INTO pedido_items (
            pedido_id, producto_id, producto_variante_id,
            nombre_producto, descripcion_variante, sku,
            cantidad, precio_unitario, total
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            pedidoId,
            it.producto_id,
            it.producto_variante_id ?? null,
            it.nombre_producto,
            it.descripcion_variante ?? null,
            it.sku ?? null,
            it.cantidad,
            it.precio_unitario,
            it.total
          ]
        );
      }

      await conn.commit();

      // devolver pedido completo
      const [pedidoRows] = await conn.query(
        `SELECT * FROM pedidos WHERE id = ?`,
        [pedidoId]
      );

      const [itemsRows] = await conn.query(
        `SELECT * FROM pedido_items WHERE pedido_id = ? ORDER BY id ASC`,
        [pedidoId]
      );

      return { ...pedidoRows[0], items: itemsRows };
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

  static async update(id, data) {
    const pool = getPool();

    const fields = [];
    const params = [];

    Object.entries(data).forEach(([k, v]) => {
      fields.push(`${k} = ?`);
      params.push(v);
    });

    if (!fields.length) return this.findById(id);

    params.push(id);

    await pool.query(
      `UPDATE pedidos SET ${fields.join(", ")} WHERE id = ?`,
      params
    );

    return this.findById(id);
  }

  static async delete(id) {
    const pool = getPool();
    await pool.query(`DELETE FROM pedidos WHERE id = ?`, [id]);
  }
}

export default PedidoRepository;

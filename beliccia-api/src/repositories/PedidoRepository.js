// src/repositories/PedidoRepository.js
import { getPool } from "../config/db.js";

class PedidoRepository {
  // ======================================================
  // CREATE
  // ======================================================
  static async crearPedido(data, conn = null) {
    const pool = conn || getPool();

    const [res] = await pool.query(
      `
      INSERT INTO pedidos (
        usuario_id, numero_pedido, estado,
        total_items, subtotal, total_iva, gastos_envio,
        descuento_total, total,
        envio_nombre, envio_direccion, envio_ciudad,
        envio_provincia, envio_cp, envio_pais, envio_telefono,
        metodo_pago_id, estado_pago,
        notas_cliente, notas_internas
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        data.usuario_id,
        data.numero_pedido,
        data.estado || "pendiente",
        data.total_items,
        data.subtotal,
        data.total_iva,
        data.gastos_envio ?? 0,
        data.descuento_total ?? 0,
        data.total,
        data.envio_nombre,
        data.envio_direccion,
        data.envio_ciudad,
        data.envio_provincia,
        data.envio_cp,
        data.envio_pais ?? "España",
        data.envio_telefono ?? null,
        data.metodo_pago_id ?? null,
        data.estado_pago || "pendiente",
        data.notas_cliente ?? null,
        data.notas_internas ?? null,
      ]
    );

    const [rows] = await pool.query(`SELECT * FROM pedidos WHERE id = ?`, [
      res.insertId,
    ]);

    return rows[0] || null;
  }

  static async insertarItem(item, conn = null) {
    const pool = conn || getPool();

    await pool.query(
      `
      INSERT INTO pedido_items (
        pedido_id, producto_id, producto_variante_id,
        nombre_producto, descripcion_variante, sku,
        cantidad, precio_unitario, total
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        item.pedido_id,
        item.producto_id,
        item.producto_variante_id ?? null,
        item.nombre_producto,
        item.descripcion_variante ?? null,
        item.sku ?? null,
        item.cantidad,
        item.precio_unitario,
        item.total,
      ]
    );
  }

  // ✅ Crear pedido + items + vaciar carrito en UNA transacción
  static async crearPedidoCompletoDesdeCarrito({
    pedidoData,
    items,
    carritoId,
  }) {
    const pool = getPool();
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const pedido = await this.crearPedido(pedidoData, conn);

      for (const it of items) {
        await this.insertarItem({ ...it, pedido_id: pedido.id }, conn);
      }

      // ✅ Vaciar items del carrito
      await conn.query(`DELETE FROM carrito_items WHERE carrito_id = ?`, [
        carritoId,
      ]);

      // ✅ Mantener carrito activo
      await conn.query(`UPDATE carritos SET estado = 'activo' WHERE id = ?`, [
        carritoId,
      ]);

      await conn.commit();

      return pedido;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // ======================================================
  // READ
  // ======================================================

  // ✔️ Para listados con filtros y paginación
  static async findAll({ estado = null, usuario_id = null, limit = 12, offset = 0 }) {
    const pool = getPool();

    const where = [];
    const values = [];

    if (estado) {
      where.push(`estado = ?`);
      values.push(estado);
    }

    if (usuario_id) {
      where.push(`usuario_id = ?`);
      values.push(usuario_id);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // Total
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM pedidos ${whereSql}`,
      values
    );
    const total = Number(countRows[0]?.total || 0);

    // Data
    const [rows] = await pool.query(
      `
      SELECT *
      FROM pedidos
      ${whereSql}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
      `,
      [...values, Number(limit), Number(offset)]
    );

    return { pedidos: rows, total };
  }

  // ✔️ Detalle del pedido (con items opcionales)
  static async findById(id, { withItems = true } = {}) {
    const pool = getPool();

    const [rows] = await pool.query(
      `SELECT * FROM pedidos WHERE id = ? LIMIT 1`,
      [id]
    );

    const pedido = rows[0] || null;
    if (!pedido) return null;

    if (!withItems) return pedido;

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

  static async findByStripeSession(sessionId) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT * FROM pedidos WHERE stripe_session_id = ? LIMIT 1`,
      [sessionId]
    );
    return rows[0] || null;
  }

  // ======================================================
  // UPDATE
  // ======================================================

  // ✅ Actualización de datos de pago desde webhook
  static async actualizarPago(pedidoId, data) {
    const pool = getPool();

    const fields = [];
    const values = [];

    const map = {
      stripe_session_id: data.stripe_session_id,
      stripe_payment_intent_id: data.stripe_payment_intent_id,
      estado_pago: data.estado_pago,
      estado: data.estado,
      fecha_pago: data.fecha_pago,
    };

    Object.entries(map).forEach(([k, v]) => {
      if (v !== undefined) {
        fields.push(`${k} = ?`);
        values.push(v);
      }
    });

    if (!fields.length) return;

    values.push(pedidoId);

    await pool.query(
      `UPDATE pedidos SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
  }

  // ✔️ Update genérico (controlado)
  static async update(id, data = {}) {
    const pool = getPool();

    // Lista blanca de campos permitidos
    const allowed = [
      "estado",
      "estado_pago",
      "metodo_pago_id",
      "notas_cliente",
      "notas_internas",
      "gastos_envio",
      "descuento_total",
      "total_iva",
      "total",
      "envio_nombre",
      "envio_direccion",
      "envio_ciudad",
      "envio_provincia",
      "envio_cp",
      "envio_pais",
      "envio_telefono",
      "stripe_session_id",
      "stripe_payment_intent_id",
      "fecha_pago",
    ];

    const fields = [];
    const values = [];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (!fields.length) {
      // nada que actualizar
      const [rows] = await pool.query(
        `SELECT * FROM pedidos WHERE id = ? LIMIT 1`,
        [id]
      );
      return rows[0] || null;
    }

    values.push(id);

    await pool.query(
      `UPDATE pedidos SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    const [rows] = await pool.query(
      `SELECT * FROM pedidos WHERE id = ? LIMIT 1`,
      [id]
    );

    return rows[0] || null;
  }

  // ======================================================
  // DELETE
  // ======================================================

  static async delete(id) {
    const pool = getPool();

    // Por integridad: primero items
    await pool.query(`DELETE FROM pedido_items WHERE pedido_id = ?`, [id]);
    await pool.query(`DELETE FROM pedidos WHERE id = ?`, [id]);
  }
}

export default PedidoRepository;

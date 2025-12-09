import { getPool } from "../config/db.js";

class CarritoItemsRepository {
  // Obtener items con info necesaria para el front
  static async listByCarrito(carritoId) {
  const pool = getPool();
  const [rows] = await pool.query(
    `
    SELECT 
      ci.id,
      ci.carrito_id,
      ci.producto_variante_id,
      ci.cantidad,
      ci.precio_unitario,
      ci.total,

      pv.sku,
      pv.talla,
      pv.color,
      pv.producto_id,

      p.id AS producto_id,
      p.nombre AS producto_nombre,
      p.slug AS producto_slug,

      (
        SELECT pi.url
        FROM producto_imagenes pi
        WHERE pi.producto_id = p.id AND pi.es_portada = 1
        ORDER BY pi.orden ASC, pi.id ASC
        LIMIT 1
      ) AS imagen_portada

    FROM carrito_items ci
    LEFT JOIN producto_variantes pv ON pv.id = ci.producto_variante_id
    LEFT JOIN productos p ON p.id = pv.producto_id
    WHERE ci.carrito_id = ?
    ORDER BY ci.id DESC
    `,
    [carritoId]
  );

  return rows;
}

  static async findItem(carritoId, varianteId) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT * FROM carrito_items WHERE carrito_id = ? AND producto_variante_id = ? LIMIT 1`,
      [carritoId, varianteId]
    );
    return rows[0] || null;
  }

  static async createItem({
    carritoId,
    varianteId,
    cantidad,
    precioUnitario,
  }) {
    const pool = getPool();
    const total = Number(precioUnitario) * Number(cantidad);

    const [res] = await pool.query(
      `
      INSERT INTO carrito_items (carrito_id, producto_variante_id, cantidad, precio_unitario, total)
      VALUES (?, ?, ?, ?, ?)
      `,
      [carritoId, varianteId, cantidad, precioUnitario, total]
    );

    const [rows] = await pool.query(
      `SELECT * FROM carrito_items WHERE id = ?`,
      [res.insertId]
    );
    return rows[0];
  }

  static async updateCantidad(itemId, cantidad, precioUnitario) {
    const pool = getPool();
    const total = Number(precioUnitario) * Number(cantidad);

    await pool.query(
      `UPDATE carrito_items SET cantidad = ?, total = ? WHERE id = ?`,
      [cantidad, total, itemId]
    );
  }

  static async deleteItem(itemId) {
    const pool = getPool();
    await pool.query(`DELETE FROM carrito_items WHERE id = ?`, [itemId]);
  }

  static async listRawByCarrito(carritoId) {
    const pool = getPool();

    const [rows] = await pool.query(
      `
      SELECT 
        ci.id,
        ci.carrito_id,
        ci.producto_variante_id,
        ci.cantidad,
        ci.precio_unitario,

        pv.producto_id AS producto_id,
        pv.talla AS descripcion_variante,
        pv.sku AS sku,

        p.nombre AS nombre_producto

      FROM carrito_items ci
      LEFT JOIN producto_variantes pv ON pv.id = ci.producto_variante_id
      LEFT JOIN productos p ON p.id = pv.producto_id
      WHERE ci.carrito_id = ?
      ORDER BY ci.id DESC
      `,
      [carritoId]
    );

    return rows;
  }
}


export default CarritoItemsRepository;

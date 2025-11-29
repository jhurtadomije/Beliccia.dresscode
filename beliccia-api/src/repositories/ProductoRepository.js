import { getPool } from '../config/db.js';

class ProductoRepository {
  static async findAllPublic({ categoriaSlug, coleccionSlug, marcaSlug }) {
    const pool = getPool();

    let sql = `
      SELECT p.id, p.nombre, p.slug, p.descripcion_corta,
             p.precio_base, p.venta_online, p.visible_web,
             c.nombre AS categoria, m.nombre AS marca, co.nombre AS coleccion
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN marcas m ON p.marca_id = m.id
      LEFT JOIN colecciones co ON p.coleccion_id = co.id
      WHERE p.visible_web = 1
    `;
    const params = [];

    if (categoriaSlug) {
      sql += ' AND c.slug = ?';
      params.push(categoriaSlug);
    }
    if (coleccionSlug) {
      sql += ' AND co.slug = ?';
      params.push(coleccionSlug);
    }
    if (marcaSlug) {
      sql += ' AND m.slug = ?';
      params.push(marcaSlug);
    }

    sql += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async findBySlug(slug) {
    const pool = getPool();

    const [rows] = await pool.query(
      `
      SELECT p.*, 
             c.nombre AS categoria, m.nombre AS marca, co.nombre AS coleccion
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN marcas m ON p.marca_id = m.id
      LEFT JOIN colecciones co ON p.coleccion_id = co.id
      WHERE p.slug = ?
      LIMIT 1
      `,
      [slug]
    );

    if (!rows[0]) return null;

    const producto = rows[0];

    // variantes
    const [variantes] = await pool.query(
      `SELECT id, sku, talla, color, stock, activo
       FROM producto_variantes
       WHERE producto_id = ?`,
      [producto.id]
    );

    // imágenes
    const [imagenes] = await pool.query(
      `SELECT id, url, alt_text, es_portada, orden
       FROM producto_imagenes
       WHERE producto_id = ?
       ORDER BY es_portada DESC, orden ASC`,
      [producto.id]
    );

    return {
      ...producto,
      variantes,
      imagenes
    };
  }

  static async crear({
    categoria_id,
    marca_id,
    coleccion_id,
    codigo_interno,
    nombre,
    slug,
    descripcion_corta,
    descripcion_larga,
    precio_base,
    venta_online,
    visible_web,
    tags_origen
  }) {
    const pool = getPool();
    const [result] = await pool.query(
      `
      INSERT INTO productos (
        categoria_id, marca_id, coleccion_id,
        codigo_interno, nombre, slug,
        descripcion_corta, descripcion_larga,
        precio_base, venta_online, visible_web, tags_origen
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        categoria_id || null,
        marca_id || null,
        coleccion_id || null,
        codigo_interno || null,
        nombre,
        slug,
        descripcion_corta || null,
        descripcion_larga || null,
        precio_base || null,
        venta_online ? 1 : 0,
        visible_web ? 1 : 1,
        tags_origen || null
      ]
    );

    const [rows] = await pool.query(
      `SELECT * FROM productos WHERE id = ?`,
      [result.insertId]
    );

    return rows[0];
  }

  static async update(id, data) {
    const pool = getPool();

    // construir set dinámico
    const fields = [];
    const params = [];

    Object.entries(data).forEach(([key, value]) => {
      fields.push(`${key} = ?`);
      params.push(value);
    });

    if (!fields.length) return this.findById(id);

    params.push(id);

    await pool.query(
      `UPDATE productos SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    const [rows] = await pool.query(
      `SELECT * FROM productos WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT * FROM productos WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  static async delete(id) {
    const pool = getPool();
    await pool.query(`DELETE FROM productos WHERE id = ?`, [id]);
  }
}

export default ProductoRepository;

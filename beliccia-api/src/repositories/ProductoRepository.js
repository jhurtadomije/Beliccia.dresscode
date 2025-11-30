// productoRepository.js
import { getPool } from '../config/db.js';

class ProductoRepository {
 static async findAllPublic({
    categoriaSlug,
    coleccionSlug,
    marcaSlug,
    limit = 12,
    offset = 0,
  }) {
    const pool = getPool();

    const params = [];
    let where = 'p.visible_web = 1';

    if (categoriaSlug) {
      where += ' AND c.slug = ?';
      params.push(categoriaSlug);
    }
    if (coleccionSlug) {
      where += ' AND co.slug = ?';
      params.push(coleccionSlug);
    }
    if (marcaSlug) {
      where += ' AND m.slug = ?';
      params.push(marcaSlug);
    }

    // 1) Productos para el listado (con imagen_portada)
    const [rows] = await pool.query(
      `
      SELECT 
        p.id,
        p.nombre,
        p.slug,
        p.codigo_interno,
        p.descripcion_corta,
        p.precio_base,
        p.venta_online,
        p.visible_web,
        p.tags_origen,
        c.nombre  AS categoria,
        m.nombre  AS marca,
        co.nombre AS coleccion,
        (
          SELECT pi.url
          FROM producto_imagenes pi
          WHERE pi.producto_id = p.id
            AND pi.es_portada = 1
          ORDER BY pi.orden ASC, pi.id ASC
          LIMIT 1
        ) AS imagen_portada
      FROM productos p
      LEFT JOIN categorias  c  ON p.categoria_id  = c.id
      LEFT JOIN marcas      m  ON p.marca_id      = m.id
      LEFT JOIN colecciones co ON p.coleccion_id  = co.id
      WHERE ${where}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    // 2) Total de productos para la paginación
    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM productos p
      LEFT JOIN categorias  c  ON p.categoria_id  = c.id
      LEFT JOIN marcas      m  ON p.marca_id      = m.id
      LEFT JOIN colecciones co ON p.coleccion_id  = co.id
      WHERE ${where}
      `,
      params
    );

    const total = countRows[0]?.total ?? 0;

    return { productos: rows, total };
  }

  // 👇 el resto lo puedes dejar tal cual lo tenías
  static async findBySlug(slug) {
    const pool = getPool();

    // 1) Traemos los datos base del producto + nombres de categoria/marca/coleccion
    const [rows] = await pool.query(
      `
      SELECT p.*, 
             c.nombre AS categoria, 
             m.nombre AS marca, 
             co.nombre AS coleccion
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN marcas m     ON p.marca_id     = m.id
      LEFT JOIN colecciones co ON p.coleccion_id = co.id
      WHERE p.slug = ?
      LIMIT 1
      `,
      [slug]
    );

    if (!rows[0]) return null;

    const producto = rows[0];

    // 2) Variantes
    const [variantes] = await pool.query(
      `
      SELECT id, sku, talla, color, stock, activo
      FROM producto_variantes
      WHERE producto_id = ?
      `,
      [producto.id]
    );

    // 3) Imágenes
    const [imagenes] = await pool.query(
      `
      SELECT id, url, alt_text, es_portada, orden
      FROM producto_imagenes
      WHERE producto_id = ?
      ORDER BY es_portada DESC, orden ASC
      `,
      [producto.id]
    );

    // 4) Devolvemos un objeto combinado
    return {
      ...producto,
      variantes,
      imagenes,
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

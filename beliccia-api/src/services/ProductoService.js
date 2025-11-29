import slugify from 'slugify';
import ProductoRepository from '../repositories/ProductoRepository.js';

class ProductoService {
  static async listarPublico(filtros) {
    return ProductoRepository.findAllPublic(filtros);
  }

  static async detallePorSlug(slug) {
    const producto = await ProductoRepository.findBySlug(slug);
    if (!producto) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      throw error;
    }
    return producto;
  }

 static async crearProducto(data) {
    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO productos 
       (categoria_id, marca_id, coleccion_id, codigo_interno, nombre, slug,
        descripcion_corta, descripcion_larga, precio_base, venta_online,
        visible_web, tags_origen)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.categoria_id,
        data.marca_id,
        data.coleccion_id,
        data.codigo_interno,
        data.nombre,
        data.slug,
        data.descripcion_corta,
        data.descripcion_larga,
        data.precio_base,
        data.venta_online,
        data.visible_web,
        data.tags_origen,
      ]
    );

    const id = result.insertId;
    const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }
  static async agregarImagen(productoId, { url, alt_text, es_portada, orden }) {
    const pool = getPool();
    await pool.query(
      `INSERT INTO producto_imagenes
       (producto_id, url, alt_text, es_portada, orden)
       VALUES (?, ?, ?, ?, ?)`,
      [productoId, url, alt_text || null, es_portada ? 1 : 0, orden || 0]
    );
  }



  static async actualizarProducto(id, data) {
    const productoExiste = await ProductoRepository.findById(id);
    if (!productoExiste) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      throw error;
    }

    // no dejamos tocar slug si no te interesa
    const dataActualizada = { ...data };
    delete dataActualizada.id;

    return ProductoRepository.update(id, dataActualizada);
  }

  static async borrarProducto(id) {
    const productoExiste = await ProductoRepository.findById(id);
    if (!productoExiste) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      throw error;
    }
    await ProductoRepository.delete(id);
  }
}

export default ProductoService;

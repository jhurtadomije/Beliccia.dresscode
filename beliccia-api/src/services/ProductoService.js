// src/services/ProductoService.js
import slugify from "slugify"; // si no lo usas en ningún sitio, puedes quitarlo
import path from "node:path";
import fs from "node:fs/promises";

import ProductoRepository from "../repositories/ProductoRepository.js";
import ImagenesRepository from "../repositories/ImagenesRepository.js";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

class ProductoService {
  static async listarPublico({
    categoriaSlug,
    coleccionSlug,
    marcaSlug,
    page = 1,
    limit = 12,
  }) {
    const pageNum = page < 1 ? 1 : page;
    const perPage = limit > 50 ? 50 : limit;
    const offset = (pageNum - 1) * perPage;

    const { productos, total } = await ProductoRepository.findAllPublic({
      categoriaSlug,
      coleccionSlug,
      marcaSlug,
      limit: perPage,
      offset,
    });

    const lastPage = Math.max(1, Math.ceil(total / perPage));

    return {
      data: productos,
      meta: {
        total,
        page: pageNum,
        perPage,
        lastPage,
      },
    };
  }

  static async detallePorSlug(slug) {
    const producto = await ProductoRepository.findBySlug(slug);

    if (!producto) {
      const error = new Error("Producto no encontrado");
      error.status = 404;
      throw error;
    }

    return {
      id: producto.id,
      nombre: producto.nombre,
      slug: producto.slug,
      descripcion_corta: producto.descripcion_corta,
      descripcion_larga: producto.descripcion_larga,
      precio_base: Number(producto.precio_base),
      venta_online: Boolean(producto.venta_online),
      visible_web: Boolean(producto.visible_web),
      categoria: producto.categoria,
      marca: producto.marca,
      coleccion: producto.coleccion,
      variantes: (producto.variantes || []).map((v) => ({
        id: v.id,
        sku: v.sku,
        talla: v.talla,
        color: v.color,
        stock: v.stock,
        activo: Boolean(v.activo),
      })),
      imagenes: producto.imagenes || [],
    };
  }

  static async actualizarProducto(id, data) {
    const productoExiste = await ProductoRepository.findById(id);
    if (!productoExiste) {
      const error = new Error("Producto no encontrado");
      error.status = 404;
      throw error;
    }

    const dataActualizada = { ...data };
    delete dataActualizada.id; // no tocamos el id

    return ProductoRepository.update(id, dataActualizada);
  }

  static async borrarProducto(id) {
    // 1) Comprobar que el producto exista
    const producto = await ProductoRepository.findById(id);
    if (!producto) {
      const error = new Error("Producto no encontrado");
      error.status = 404;
      throw error;
    }

    // 2) Listar imágenes para poder borrar los ficheros físicos
    const imagenes = await ImagenesRepository.listarPorProducto(id);

    for (const img of imagenes) {
      const url = String(img.url || "");

      // url tipo "/imagenes/complementos/2025/clutch-xxx.jpg"
      // quitamos dominio y el prefijo /imagenes/
      const sinDominio = url.replace(/^https?:\/\/[^/]+/, "");
      const rel = sinDominio.replace(/^\/?imagenes\//, "");

      const absPath = path.join(UPLOAD_ROOT, rel);

      try {
        await fs.unlink(absPath);
        // console.log('Borrado fichero', absPath);
      } catch (e) {
        // Si el fichero no existe, ignoramos (ENOENT)
        if (e.code !== "ENOENT") {
          console.error("Error borrando fichero de imagen:", absPath, e);
        }
      }
    }

    // 3) Borrar el producto (y, si tienes ON DELETE CASCADE, volarán también
    //    las filas de producto_imagenes y producto_variantes)
    await ProductoRepository.delete(id);
  }
}

export default ProductoService;

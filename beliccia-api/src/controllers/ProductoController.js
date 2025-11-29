import ProductoService from '../services/ProductoService.js';
import ProductoRepository from '../repositories/ProductoRepository.js';
import VariantesRepository from '../repositories/VariantesRepository.js';
import ImagenesRepository from '../repositories/ImagenesRepository.js';

class ProductoController {
  static async listar(req, res, next) {
    try {
      const { categoria, coleccion, marca } = req.query;
      const productos = await ProductoService.listarPublico({
        categoriaSlug: categoria,
        coleccionSlug: coleccion,
        marcaSlug: marca
      });
      return res.json(productos);
    } catch (err) {
      next(err);
    }
  }

  static async detalle(req, res, next) {
    try {
      const { slug } = req.params;
      const producto = await ProductoService.detallePorSlug(slug);
      return res.json(producto);
    } catch (err) {
      next(err);
    }
  }

  // ADMIN

  static async crear(req, res, next) {
    try {
      const {
        nombre,
        slug,
        codigo_interno,
        categoria_id,
        marca_id,
        coleccion_id,
        descripcion_corta,
        descripcion_larga,
        precio_base,
        venta_online,
        visible_web,
        tags_origen,
        carpeta_imagenes,
        variantes, // viene como string JSON desde el front
      } = req.body;

      if (!nombre || !slug) {
        return res.status(400).json({
          error: true,
          message: "Nombre y slug son obligatorios",
        });
      }

      // 1) Crear producto base usando el repositorio
      const producto = await ProductoRepository.crear({
        nombre,
        slug,
        codigo_interno: codigo_interno || null,
        categoria_id: categoria_id || null,
        marca_id: marca_id || null,
        coleccion_id: coleccion_id || null,
        descripcion_corta: descripcion_corta || null,
        descripcion_larga: descripcion_larga || null,
        precio_base: precio_base ? Number(precio_base) : null,
        venta_online: venta_online === "1" || venta_online === 1 ? 1 : 0,
        visible_web: visible_web === "0" || visible_web === 0 ? 0 : 1,
        tags_origen: tags_origen || null,
      });

      // 👇 MUY IMPORTANTE: aquí usamos producto.id (número)
      const productoId = producto.id;

      // 2) Crear variantes (si vienen)
      let variantesArr = [];
      try {
        variantesArr = variantes ? JSON.parse(variantes) : [];
      } catch {
        variantesArr = [];
      }

      for (const v of variantesArr) {
        await VariantesRepository.crear({
          producto_id: productoId, // 👈 ahora es un número, no un objeto
          sku: `${codigo_interno || slug}-${v.talla || "UNIQ"}`,
          talla: v.talla || null,
          color: v.color || null,
          stock: v.stock ?? 0,
        });
      }

      // 3) Imágenes
      const files = req.files || [];
      const cleanFolder = (carpeta_imagenes || "")
        .trim()
        .replace(/^\/+|\/+$/g, "");

      const imagenesUrls = [];

      for (const [index, file] of files.entries()) {
        const relativePath = cleanFolder
          ? `${cleanFolder}/${file.filename}`
          : file.filename;

        const url = `/imagenes/${relativePath}`;

        await ImagenesRepository.crear({
          producto_id: productoId,
          url,
          alt_text: nombre,
          es_portada: index === 0 ? 1 : 0,
          orden: index,
        });

        imagenesUrls.push(url);
      }

      return res.status(201).json({
        ok: true,
        producto: {
          ...producto,
          imagenes: imagenesUrls,
        },
      });
    } catch (err) {
      console.error("Error creando producto:", err);
      return res.status(500).json({
        error: true,
        message: "Error interno al crear el producto",
      });
    }
  }



  static async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const producto = await ProductoService.actualizarProducto(Number(id), req.body);
      return res.json(producto);
    } catch (err) {
      next(err);
    }
  }

  static async borrar(req, res, next) {
    try {
      const { id } = req.params;
      await ProductoService.borrarProducto(Number(id));
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default ProductoController;

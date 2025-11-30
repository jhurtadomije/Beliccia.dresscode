//productoController.js
import ProductoService from "../services/ProductoService.js";
import ProductoRepository from "../repositories/ProductoRepository.js";
import VariantesRepository from "../repositories/VariantesRepository.js";
import ImagenesRepository from "../repositories/ImagenesRepository.js";

class ProductoController {
  static async listar(req, res, next) {
    try {
      const {
        categoria,
        coleccion,
        marca,
        page = "1",
        limit = "12",
      } = req.query;

      const resultado = await ProductoService.listarPublico({
        categoriaSlug: categoria || null,
        coleccionSlug: coleccion || null,
        marcaSlug: marca || null,
        page: Number(page) || 1,
        limit: Number(limit) || 12,
      });

      // 👇 ahora devolvemos { data, meta }
      return res.json(resultado);
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
      const productoId = Number(id);

      const existente = await ProductoRepository.findById(productoId);
      if (!existente) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

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
        variantes, // opcional, string JSON
      } = req.body;

      // 1) Construimos objeto de update SOLO con campos presentes
      const data = {};

      if (nombre !== undefined) data.nombre = nombre || null;
      if (slug !== undefined) data.slug = slug || null;
      if (codigo_interno !== undefined)
        data.codigo_interno = codigo_interno || null;
      if (categoria_id !== undefined) data.categoria_id = categoria_id || null;
      if (marca_id !== undefined) data.marca_id = marca_id || null;
      if (coleccion_id !== undefined) data.coleccion_id = coleccion_id || null;
      if (descripcion_corta !== undefined)
        data.descripcion_corta = descripcion_corta || null;
      if (descripcion_larga !== undefined)
        data.descripcion_larga = descripcion_larga || null;
      if (tags_origen !== undefined) data.tags_origen = tags_origen || null;

      if (precio_base !== undefined) {
        data.precio_base = precio_base === "" ? null : Number(precio_base);
      }

      if (venta_online !== undefined) {
        const v = venta_online;
        data.venta_online = v === "1" || v === "true" || v === true ? 1 : 0;
      }

      if (visible_web !== undefined) {
        const v = visible_web;
        data.visible_web =
          v === "0" || v === 0 || v === "false" || v === false ? 0 : 1;
      }

      // 2) Actualizamos el producto (si hay campos que tocar)
      const actualizado =
        Object.keys(data).length > 0
          ? await ProductoRepository.update(productoId, data)
          : existente;

      // 3) Imágenes: si vienen ficheros, reseteamos la galería
      const files = req.files || [];

      if (files.length) {
        // Borramos registros antiguos
        await ImagenesRepository.borrarPorProducto(productoId);

        const cleanFolder = (carpeta_imagenes || "")
          .trim()
          .replace(/^\/+|\/+$/g, "");

        for (const [index, file] of files.entries()) {
          const relativePath = cleanFolder
            ? `${cleanFolder}/${file.filename}`
            : file.filename;

          const url = `/imagenes/${relativePath}`;

          await ImagenesRepository.crear({
            producto_id: productoId,
            url,
            alt_text: actualizado.nombre,
            es_portada: index === 0 ? 1 : 0,
            orden: index,
          });
        }
      }

      // 4) Variantes (opcional – igual que en crear si quieres mantener tallas)
      if (variantes) {
        try {
          const parsed = JSON.parse(variantes);
          // Aquí podrías hacer:
          // - borrar variantes antiguas
          // - volver a crearlas con VariantesRepository
        } catch (e) {
          console.warn("variantes JSON inválido en actualizar:", variantes);
        }
      }

      return res.json(actualizado);
    } catch (err) {
      next(err);
    }
  }

  static async borrar(req, res, next) {
    try {
      const { id } = req.params;
      const productoId = Number(id);

      await ProductoService.borrarProducto(productoId);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default ProductoController;

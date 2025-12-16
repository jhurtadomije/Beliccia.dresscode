import { getPool } from "../config/db.js"; 
import CarritoRepository from "../repositories/CarritoRepository.js";
import CarritoItemsRepository from "../repositories/CarritoItemsRepository.js";
import VariantesRepository from "../repositories/VariantesRepository.js";

class CarritoService {
  static async resolveCarrito({ user, sessionId }) {
  const usuarioId = user?.id ? Number(user.id) : null;

  if (!usuarioId && !sessionId) {
    const err = new Error("No hay sesión de carrito disponible");
    err.status = 400;
    throw err;
  }

  const carrito = await CarritoRepository.getOrCreate({
    usuarioId,
    sessionId,
  });

  if (!carrito) {
    const err = new Error("No hay sesión de carrito disponible");
    err.status = 400;
    throw err;
  }

  return carrito;
}


  static async obtenerCarrito({ user, sessionId }) {
    const carrito = await this.resolveCarrito({ user, sessionId });
    const items = await CarritoItemsRepository.listByCarrito(carrito.id);

    return { carrito, items };
  }

  static async addItem({ user, sessionId, varianteId, productoId, cantidad }) {
  const carrito = await this.resolveCarrito({ user, sessionId });
  const pool = getPool();

  // 1) Resolver variante real
  let variante = null;

  if (varianteId) {
    variante = await VariantesRepository.findById(varianteId);
  } else if (productoId) {
    // buscamos una variante activa por defecto
    variante = await VariantesRepository.findDefaultByProductoId(productoId);

    // si no existe, creamos una variante mínima automática
    if (!variante) {
      variante = await VariantesRepository.createDefaultForProducto(productoId);
    }
  }

  if (!variante) {
    const err = new Error("No se pudo resolver una variante para el producto");
    err.status = 400;
    throw err;
  }

  const finalVarianteId = variante.id;

  // 2) Precio unitario desde producto
  const [priceRows] = await pool.query(
    `
    SELECT precio_base
    FROM productos
    WHERE id = ?
    LIMIT 1
    `,
    [variante.producto_id]
  );

  const precioUnitario = Number(priceRows[0]?.precio_base ?? 0);

  // 3) Si ya existe item de esa variante en el carrito, sumamos cantidad
  const existing = await CarritoItemsRepository.findItem(
    carrito.id,
    finalVarianteId
  );

  if (existing) {
    const newQty = Number(existing.cantidad || 1) + Number(cantidad || 1);

    await CarritoItemsRepository.updateCantidad(
      existing.id,
      newQty,
      existing.precio_unitario
    );
    return;
  }

  // 4) Crear item
  await CarritoItemsRepository.createItem({
    carritoId: carrito.id,
    varianteId: finalVarianteId,
    cantidad: Number(cantidad || 1),
    precioUnitario,
  });
}

  static async updateItem({ user, sessionId, itemId, cantidad }) {
    const carrito = await this.resolveCarrito({ user, sessionId });

    const items = await CarritoItemsRepository.listRawByCarrito(carrito.id);
    const item = items.find((i) => i.id === Number(itemId));

    if (!item) {
      const err = new Error("Item no encontrado en carrito");
      err.status = 404;
      throw err;
    }

    const qty = Math.max(1, Number(cantidad || 1));

    await CarritoItemsRepository.updateCantidad(
      item.id,
      qty,
      item.precio_unitario
    );
  }

  static async deleteItem({ user, sessionId, itemId }) {
    const carrito = await this.resolveCarrito({ user, sessionId });

    const items = await CarritoItemsRepository.listRawByCarrito(carrito.id);
    const item = items.find((i) => i.id === Number(itemId));

    if (!item) return;

    await CarritoItemsRepository.deleteItem(item.id);
  }

  static async merge({ user, sessionId }) {
    if (!user?.id) {
      const err = new Error("Debes estar autenticado.");
      err.status = 401;
      throw err;
    }
    if (!sessionId) return;

    const guestCart = await CarritoRepository.findActiveBySessionId(sessionId);
    if (!guestCart) return;

    const userCart =
      (await CarritoRepository.findActiveByUserId(user.id)) ||
      (await CarritoRepository.createForUser(user.id));

    const guestItems = await CarritoItemsRepository.listRawByCarrito(
      guestCart.id
    );

    for (const gi of guestItems) {
      const existing = await CarritoItemsRepository.findItem(
        userCart.id,
        gi.producto_variante_id
      );

      if (existing) {
        const newQty = Number(existing.cantidad) + Number(gi.cantidad);

        await CarritoItemsRepository.updateCantidad(
          existing.id,
          newQty,
          existing.precio_unitario
        );

        await CarritoItemsRepository.deleteItem(gi.id);
      } else {
        const pool = getPool();
        await pool.query(
          `UPDATE carrito_items SET carrito_id = ? WHERE id = ?`,
          [userCart.id, gi.id]
        );
      }
    }

    const pool = getPool();
    await pool.query(`UPDATE carritos SET estado = 'convertido' WHERE id = ?`, [
      guestCart.id,
    ]);
  }
}

export default CarritoService;

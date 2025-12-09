import CarritoService from "../services/CarritoService.js";

class CarritoController {
  static async obtener(req, res, next) {
    try {
      const { carrito, items } = await CarritoService.obtenerCarrito({
        user: req.user,
        sessionId: req.cartSessionId,
      });

      res.json({
        ok: true,
        carrito: { id: carrito.id },
        items,
      });
    } catch (e) {
      next(e);
    }
  }

  static async addItem(req, res, next) {
  try {
    const { producto_id, producto_variante_id, cantidad } = req.body;

    const productoId = Number.isFinite(Number(producto_id))
      ? Number(producto_id)
      : null;

    const varianteId = Number.isFinite(Number(producto_variante_id))
      ? Number(producto_variante_id)
      : null;

    await CarritoService.addItem({
      user: req.user,
      sessionId: req.cartSessionId,
      productoId,
      varianteId,
      cantidad: Number(cantidad || 1),
    });

    res.status(201).json({ ok: true });
  } catch (e) {
    next(e);
  }
}



  static async updateItem(req, res, next) {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;

      await CarritoService.updateItem({
        user: req.user,
        sessionId: req.cartSessionId,
        itemId: Number(id),
        cantidad: Number(cantidad || 1),
      });

      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  }

  static async deleteItem(req, res, next) {
    try {
      const { id } = req.params;

      await CarritoService.deleteItem({
        user: req.user,
        sessionId: req.cartSessionId,
        itemId: Number(id),
      });

      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }

  static async merge(req, res, next) {
    try {
      await CarritoService.merge({
        user: req.user,
        sessionId: req.cartSessionId,
      });

      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  }
}

export default CarritoController;

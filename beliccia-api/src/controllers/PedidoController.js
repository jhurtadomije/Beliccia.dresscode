// src/controllers/PedidoController.js
import PedidoService from "../services/PedidoService.js";

class PedidoController {
  // -----------------------------------------
  // POST /pedidos/desde-carrito
  // -----------------------------------------
  static async crearDesdeCarrito(req, res) {
    try {
      const usuarioId = req.user?.id;
      const payload = req.body || {};

      const pedido = await PedidoService.crearDesdeCarrito(usuarioId, payload);

      return res.status(201).json({ ok: true, pedido });
    } catch (err) {
      console.error("❌ Error crearDesdeCarrito:", err);
      return res.status(err.status || 500).json({
        ok: false,
        message: err.message || "Error interno",
      });
    }
  }

  // -----------------------------------------
  // GET /pedidos
  // - Usuario normal: lista SOLO sus pedidos
  // - Admin (si lo tienes): puede filtrar por usuario_id/estado/paginación
  // -----------------------------------------
  static async listar(req, res) {
    try {
      const usuarioId = req.user?.id;
      const rol = req.user?.rol;

      const {
        page = 1,
        limit = 12,
        estado = null,
        usuario_id = null,
      } = req.query;

      // Seguridad: usuario normal no puede listar pedidos ajenos
      const filterUsuarioId = rol === "admin"
        ? (usuario_id ? Number(usuario_id) : null)
        : Number(usuarioId);

      const result = await PedidoService.listar({
        page: Number(page),
        limit: Number(limit),
        estado,
        usuario_id: filterUsuarioId,
      });

      return res.json({ ok: true, ...result });
    } catch (err) {
      console.error("❌ Error listar pedidos:", err);
      return res.status(err.status || 500).json({
        ok: false,
        message: err.message || "Error interno",
      });
    }
  }

  // -----------------------------------------
  // GET /pedidos/:id
  // Control de permisos:
  // - admin: OK
  // - usuario: solo su pedido
  // -----------------------------------------
  static async detalle(req, res) {
    try {
      const pedidoId = Number(req.params.id);
      const usuarioId = Number(req.user?.id);
      const rol = req.user?.rol;

      if (!pedidoId) {
        return res.status(400).json({
          ok: false,
          message: "ID de pedido inválido",
        });
      }

      const pedido = await PedidoService.detalle(pedidoId);

      const ownerId = Number(pedido.usuario_id);
      const isAdmin = rol === "admin";

      if (!isAdmin && ownerId !== usuarioId) {
        return res.status(403).json({
          ok: false,
          message: "No autorizado para ver este pedido",
        });
      }

      return res.json({ ok: true, pedido });
    } catch (err) {
      console.error("❌ Error detalle pedido:", err);
      return res.status(err.status || 500).json({
        ok: false,
        message: err.message || "Error interno",
      });
    }
  }

  // -----------------------------------------
  // PUT /pedidos/:id
  // Recomendación:
  // - si solo admin, protégelo en rutas
  // -----------------------------------------
  static async actualizar(req, res) {
    try {
      const pedidoId = Number(req.params.id);
      const payload = req.body || {};

      if (!pedidoId) {
        return res.status(400).json({
          ok: false,
          message: "ID de pedido inválido",
        });
      }

      const pedido = await PedidoService.actualizar(pedidoId, payload);

      return res.json({ ok: true, pedido });
    } catch (err) {
      console.error("❌ Error actualizar pedido:", err);
      return res.status(err.status || 500).json({
        ok: false,
        message: err.message || "Error interno",
      });
    }
  }

  // -----------------------------------------
  // DELETE /pedidos/:id
  // -----------------------------------------
  static async borrar(req, res) {
    try {
      const pedidoId = Number(req.params.id);

      if (!pedidoId) {
        return res.status(400).json({
          ok: false,
          message: "ID de pedido inválido",
        });
      }

      await PedidoService.borrar(pedidoId);

      return res.status(204).send();
    } catch (err) {
      console.error("❌ Error borrar pedido:", err);
      return res.status(err.status || 500).json({
        ok: false,
        message: err.message || "Error interno",
      });
    }
  }
}

export default PedidoController;

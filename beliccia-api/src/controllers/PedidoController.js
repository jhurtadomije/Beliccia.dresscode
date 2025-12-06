import PedidoService from "../services/PedidoService.js";

class PedidoController {
  static async listar(req, res, next) {
    try {
      const { page = "1", limit = "12", estado, usuario_id } = req.query;

      const data = await PedidoService.listar({
        page: Number(page) || 1,
        limit: Number(limit) || 12,
        estado: estado || null,
        usuario_id: usuario_id ? Number(usuario_id) : null,
      });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  static async detalle(req, res, next) {
    try {
      const id = Number(req.params.id);
      const pedido = await PedidoService.detalle(id);
      return res.json(pedido);
    } catch (err) {
      next(err);
    }
  }

  static async crear(req, res, next) {
    try {
      const usuarioId = req.user?.id;
      const pedido = await PedidoService.crear(usuarioId, req.body);
      return res.status(201).json({ ok: true, pedido });
    } catch (err) {
      next(err);
    }
  }

  static async actualizar(req, res, next) {
    try {
      const id = Number(req.params.id);
      const pedido = await PedidoService.actualizar(id, req.body);
      return res.json({ ok: true, pedido });
    } catch (err) {
      next(err);
    }
  }

  static async borrar(req, res, next) {
    try {
      const id = Number(req.params.id);
      await PedidoService.borrar(id);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default PedidoController;

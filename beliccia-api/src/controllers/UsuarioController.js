// beliccia-api/src/controllers/UsuarioController.js
import UsuarioService from "../services/UsuarioService.js";

class UsuarioController {
  static async listar(req, res) {
    try {
      const { page = 1, limit = 12, rol = null, activo = null, q = null } = req.query;

      const result = await UsuarioService.listar({
        page: Number(page),
        limit: Number(limit),
        rol,
        activo,
        q,
      });

      return res.json({ ok: true, ...result });
    } catch (err) {
      return res.status(err.status || 500).json({
        ok: false,
        message: err.message || "Error interno",
      });
    }
  }

  static async detalle(req, res) {
    try {
      const id = Number(req.params.id);
      const usuario = await UsuarioService.detalle(id);
      return res.json({ ok: true, usuario });
    } catch (err) {
      return res.status(err.status || 500).json({
        ok: false,
        message: err.message || "Error interno",
      });
    }
  }

  static async actualizar(req, res) {
    try {
      const id = Number(req.params.id);
      const usuario = await UsuarioService.actualizar(id, req.body || {});
      return res.json({ ok: true, usuario });
    } catch (err) {
      return res.status(err.status || 500).json({
        ok: false,
        message: err.message || "Error interno",
      });
    }
  }
}

export default UsuarioController;

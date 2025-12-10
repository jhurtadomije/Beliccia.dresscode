// beliccia-api/src/services/UsuarioService.js
import UsuarioRepository from "../repositories/UsuarioRepository.js";

class UsuarioService {
  static async listar({ page = 1, limit = 12, rol = null, activo = null, q = null }) {
    const pageNum = page < 1 ? 1 : page;
    const perPage = limit > 50 ? 50 : limit;
    const offset = (pageNum - 1) * perPage;

    const { usuarios, total } = await UsuarioRepository.findAll({
      rol,
      activo,
      q,
      limit: perPage,
      offset,
    });

    const lastPage = Math.max(1, Math.ceil(total / perPage));

    return {
      data: usuarios,
      meta: { total, page: pageNum, perPage, lastPage },
    };
  }

  static async detalle(id) {
    const u = await UsuarioRepository.findById(id);
    if (!u) {
      const e = new Error("Usuario no encontrado");
      e.status = 404;
      throw e;
    }
    return u;
  }

  static async actualizar(id, data) {
    const u = await UsuarioRepository.update(id, data);
    if (!u) {
      const e = new Error("Usuario no encontrado");
      e.status = 404;
      throw e;
    }
    return u;
  }
}

export default UsuarioService;

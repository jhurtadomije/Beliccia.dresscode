import CategoriasRepository from "../repositories/CategoriasRepository.js";

class CategoriasController {
  static async listar(req, res, next) {
    try {
      const { solo_activas } = req.query;

      // Por ahora tus categorías no tienen "activa",
      // así que este flag no cambia nada. Lo dejamos por futuro.
      const categorias = await CategoriasRepository.findAll();

      return res.json(categorias);
    } catch (e) {
      next(e);
    }
  }
}

export default CategoriasController;

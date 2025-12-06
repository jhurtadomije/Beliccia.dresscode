import MarcasRepository from "../repositories/MarcasRepository.js";

class MarcasController {
  static async listar(req, res, next) {
    try {
      const { activas = "1" } = req.query;

      const marcas =
        activas === "0"
          ? await MarcasRepository.findAll()
          : await MarcasRepository.findActivas();

      return res.json(marcas);
    } catch (e) {
      next(e);
    }
  }
}

export default MarcasController;

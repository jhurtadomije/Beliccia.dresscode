import ColeccionesRepository from "../repositories/ColeccionesRepository.js";

class ColeccionesController {
  static async listar(req, res, next) {
    try {
      const { activas = "1" } = req.query;

      const colecciones =
        activas === "0"
          ? await ColeccionesRepository.findAll()
          : await ColeccionesRepository.findActivas();

      return res.json(colecciones);
    } catch (e) {
      next(e);
    }
  }
}

export default ColeccionesController;

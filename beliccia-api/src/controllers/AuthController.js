import AuthService from '../services/AuthService.js';

class AuthController {
  static async register(req, res, next) {
    try {
      const { nombre, apellidos, email, password, telefono } = req.body;

      const result = await AuthService.register({
        nombre,
        apellidos,
        email,
        password,
        telefono
      });

      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async me(req, res, next) {
    try {
      // requireAuth ya habrá metido req.user
      return res.json({ user: req.user });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;

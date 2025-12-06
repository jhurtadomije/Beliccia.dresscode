import AuthService from "../services/AuthService.js";

class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: true,
          message: "Email y contraseña son obligatorios",
        });
      }

      const result = await AuthService.login(email, password);

      return res.json({
        ok: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async register(req, res, next) {
    try {
      const user = await AuthService.register(req.body);
      return res.status(201).json({ ok: true, user });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;

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
      const result = await AuthService.register(req.body);
      return res.status(201).json({ ok: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async google(req, res) {
    try {
      const { credential } = req.body;

      const result = await AuthService.loginWithGoogle(credential);

      return res.json({
        ok: true,
        token: result.token,
        user: result.user,
      });
    } catch (err) {
      console.error(" Error google login:", err);
      return res.status(err.status || 500).json({
        ok: false,
        message: err.message || "Error interno",
      });
    }
  }
}


export default AuthController;

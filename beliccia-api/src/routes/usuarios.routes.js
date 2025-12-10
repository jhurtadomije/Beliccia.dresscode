// beliccia-api/src/routes/usuarios.routes.js
import { Router } from "express";
import UsuarioController from "../controllers/UsuarioController.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/", UsuarioController.listar);
router.get("/:id", UsuarioController.detalle);
router.put("/:id", UsuarioController.actualizar);

export default router;

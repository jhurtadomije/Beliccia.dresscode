import { Router } from "express";
import CitasController from "../controllers/CitasController.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Público: formulario (guest o logueado)
router.post("/", CitasController.crear);

// Cliente / Admin (unificado con permisos internos)
router.get("/", requireAuth, CitasController.listar);
router.get("/:id", requireAuth, CitasController.detalle);

// Admin-only
router.put("/:id", requireAuth, requireAdmin, CitasController.actualizar);
router.delete("/:id", requireAuth, requireAdmin, CitasController.borrar);

export default router;

import { Router } from "express";
import ProductoController from "../controllers/ProductoController.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

// Público
router.get("/", ProductoController.listar);
router.get("/:slug", ProductoController.detalle);

// Admin (con imágenes)
router.post(
  "/",
  requireAuth,
  requireAdmin,
  upload.array("imagenes", 20),
  ProductoController.crear
);

router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  upload.array("imagenes", 20),
  ProductoController.actualizar
);

router.delete("/:id", requireAuth, requireAdmin, ProductoController.borrar);

export default router;

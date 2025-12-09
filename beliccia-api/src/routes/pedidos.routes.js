// beliccia-api/src/routes/pedidos.routes.js
import { Router } from "express";
import PedidoController from "../controllers/PedidoController.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Cliente
router.post("/desde-carrito", requireAuth, PedidoController.crearDesdeCarrito);

// ✅ Unificadas con lógica interna de permisos
router.get("/", requireAuth, PedidoController.listar);
router.get("/:id", requireAuth, PedidoController.detalle);

// Admin-only (si quieres mantenerlo estricto)
router.put("/:id", requireAuth, requireAdmin, PedidoController.actualizar);
router.delete("/:id", requireAuth, requireAdmin, PedidoController.borrar);

export default router;


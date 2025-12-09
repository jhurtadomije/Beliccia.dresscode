//src/routes/pagos.routes.js
import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { cartSession } from "../middlewares/cartSession.middleware.js";
import { iniciarCheckout, verificarSession } from "../controllers/PagoController.js";

const router = Router();

router.post("/iniciar", requireAuth, cartSession, iniciarCheckout);
router.get("/verificar", requireAuth, verificarSession);

export default router;

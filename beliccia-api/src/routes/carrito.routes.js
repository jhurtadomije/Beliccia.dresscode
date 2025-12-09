import { Router } from "express";
import CarritoController from "../controllers/CarritoController.js";
import { requireAuthOptional } from "../middlewares/auth.middleware.js";
import { cartSession } from "../middlewares/cartSession.middleware.js";

const router = Router();

// opcional auth + session header
router.use(cartSession, requireAuthOptional);

// obtener carrito actual
router.get("/", CarritoController.obtener);

// añadir item
router.post("/items", CarritoController.addItem);

// actualizar cantidad
router.put("/items/:id", CarritoController.updateItem);

// borrar item
router.delete("/items/:id", CarritoController.deleteItem);

// merge invitado -> usuario
router.post("/merge", CarritoController.merge);

export default router;

import { Router } from "express";
import ColeccionesController from "../controllers/ColeccionesController.js";

const router = Router();

router.get("/", ColeccionesController.listar);

export default router;

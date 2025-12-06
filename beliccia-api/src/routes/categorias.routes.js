import { Router } from "express";
import CategoriasController from "../controllers/CategoriasController.js";

const router = Router();

// Público (para selects del admin y filtros del front)
router.get("/", CategoriasController.listar);

export default router;

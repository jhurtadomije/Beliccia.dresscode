import { Router } from "express";
import MarcasController from "../controllers/MarcasController.js";

const router = Router();

router.get("/", MarcasController.listar);

export default router;

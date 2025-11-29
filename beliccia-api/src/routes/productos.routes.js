// beliccia-api/src/routes/productos.routes.js
import { Router } from 'express';
import ProductoController from '../controllers/ProductoController.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { uploadProductoImagenes } from "../middlewares/upload.middleware.js";

const router = Router();

// público
router.get('/', ProductoController.listar);
router.get('/:slug', ProductoController.detalle);

// admin (panel)
router.post('/', requireAuth, requireAdmin, uploadProductoImagenes.array("imagenes", 10), ProductoController.crear);
router.put('/:id', requireAuth, requireAdmin, uploadProductoImagenes.array("imagenes", 10),ProductoController.actualizar);
router.delete('/:id', requireAuth, requireAdmin, ProductoController.borrar);

export default router;

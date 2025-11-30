// beliccia-api/src/routes/pedidos.routes.js
import { Router } from 'express';
import PedidoController from '../controllers/PedidoController.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Lista pedidos (solo admin)
router.get('/', requireAuth, requireAdmin, PedidoController.listar);

// Detalle de un pedido
router.get('/:id', requireAuth, requireAdmin, PedidoController.detalle);

// Crear pedido (cliente autenticado, por ejemplo)
router.post('/', requireAuth, PedidoController.crear);

// Actualizar pedido (admin)
router.put('/:id', requireAuth, requireAdmin, PedidoController.actualizar);

// Borrar pedido (admin)
router.delete('/:id', requireAuth, requireAdmin, PedidoController.borrar);

export default router;  

import { Router } from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import productosRoutes from './productos.routes.js'; 
import pedidosRoutes from './pedidos.routes.js';    
import categoriasRoutes from './categorias.routes.js';
import marcasRoutes from './marcas.routes.js';
import coleccionesRoutes from './colecciones.routes.js'; 

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/productos', productosRoutes);
router.use('/pedidos', pedidosRoutes);


router.use('/categorias', categoriasRoutes);
router.use('/marcas', marcasRoutes);
router.use('/colecciones', coleccionesRoutes);


router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Beliccia API funcionando' });
});
export default router;

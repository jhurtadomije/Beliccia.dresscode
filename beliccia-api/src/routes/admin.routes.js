import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// ruta de prueba: solo accesible para admin
router.get('/ping', requireAuth, requireAdmin, (req, res) => {
  return res.json({
    message: 'Acceso admin OK',
    user: req.user
  });
});

export default router;

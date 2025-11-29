import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// aquí más adelante podemos meter validación con Zod
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', requireAuth, AuthController.me);

export default router;

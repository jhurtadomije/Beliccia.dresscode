// src/routes/colecciones.routes.js
import { Router } from 'express';
import { getPool } from '../config/db.js';

const router = Router();

// GET /api/colecciones
router.get('/', async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT id, nombre, slug, activa FROM colecciones ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;

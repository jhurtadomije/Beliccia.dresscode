// src/routes/categorias.routes.js
import { Router } from 'express';
import { getPool } from '../config/db.js';

const router = Router();

// GET /api/categorias  → lista para combos
router.get('/', async (req, res, next) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      'SELECT id, nombre, slug, padre_id FROM categorias ORDER BY nombre ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;

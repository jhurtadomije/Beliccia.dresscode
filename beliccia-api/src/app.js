import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import path from 'path';

const app = express();

// 👇 Helmet configurado para permitir cross-origin en recursos (imágenes)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // 👈 CLAVE
    
  })
);

app.use(
  cors({
    origin: [
      'http://localhost:5173',          // dev Vite
      'https://beliccia.es',            // producción beliccia
      'https://www.tudominio.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);

// Servir /imagenes desde /uploads
app.use('/imagenes', express.static(path.join(process.cwd(), 'uploads')));

app.use(errorHandler);

export default app;

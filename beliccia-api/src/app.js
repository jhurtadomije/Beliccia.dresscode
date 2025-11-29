import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import path from 'path';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);
// Servir /imagenes desde /uploads
app.use('/imagenes', express.static(path.join(process.cwd(), 'uploads')));

app.use(errorHandler);

export default app;

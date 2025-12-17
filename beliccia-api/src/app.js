// src/app.js
import express from "express";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

import routes from "./routes/index.js";
import pagosRoutes from "./routes/pagos.routes.js";
import webhooksRoutes from "./routes/webhooks.routes.js";
import { stripeWebhook } from "./controllers/StripeWebhookController.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173", "http://localhost:4173",
      "https://beliccia.es",
      "https://www.beliccia.es",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Session-Id",
      "x-session-id",
    ],
    credentials: true,
  })
);

app.use(morgan("dev"));

//  WEBHOOK con RAW antes de JSON
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

//  JSON para el resto
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Servir imágenes
app.use("/imagenes", express.static(path.join(process.cwd(), "uploads")));

//  Rutas de negocio
app.use("/api/pagos", pagosRoutes);
app.use("/api/webhooks", webhooksRoutes);
app.use("/api", routes);

//  Error handler 
app.use(errorHandler);

export default app;

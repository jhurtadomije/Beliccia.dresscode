import { Router } from "express";
import productosRoutes from "./productos.routes.js";
import pedidosRoutes from "./pedidos.routes.js";
import authRoutes from "./auth.routes.js";
import carritoRoutes from "./carrito.routes.js";

import categoriasRoutes from "./categorias.routes.js";
import marcasRoutes from "./marcas.routes.js";
import coleccionesRoutes from "./colecciones.routes.js";
import usuariosRouter from "./usuarios.routes.js";
import citasRoutes from "./citas.routes.js";


const router = Router();

router.use("/auth", authRoutes);

router.use("/categorias", categoriasRoutes);
router.use("/marcas", marcasRoutes);
router.use("/colecciones", coleccionesRoutes);

router.use("/usuarios", usuariosRouter);
router.use("/productos", productosRoutes);
router.use("/citas", citasRoutes);

router.use("/pedidos", pedidosRoutes);
router.use("/carrito", carritoRoutes);


export default router;

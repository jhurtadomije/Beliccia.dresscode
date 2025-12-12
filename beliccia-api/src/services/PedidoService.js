//services/PedidoService.js
import PedidoRepository from "../repositories/PedidoRepository.js";
import CarritoRepository from "../repositories/CarritoRepository.js";
import CarritoItemsRepository from "../repositories/CarritoItemsRepository.js";
import EmailService from "./EmailService.js";
import UsuarioRepository from "../repositories/UsuarioRepository.js";

class PedidoService {
  static async listar({
    page = 1,
    limit = 12,
    estado = null,
    usuario_id = null,
  }) {
    const pageNum = page < 1 ? 1 : page;
    const perPage = limit > 50 ? 50 : limit;
    const offset = (pageNum - 1) * perPage;

    const { pedidos, total } = await PedidoRepository.findAll({
      estado,
      usuario_id,
      limit: perPage,
      offset,
    });

    const lastPage = Math.max(1, Math.ceil(total / perPage));

    return {
      data: pedidos,
      meta: { total, page: pageNum, perPage, lastPage },
    };
  }

  static async detalle(id) {
    const pedido = await PedidoRepository.findById(id);
    if (!pedido) {
      const e = new Error("Pedido no encontrado");
      e.status = 404;
      throw e;
    }
    return pedido;
  }

  static generarNumeroPedido() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const rnd = Math.floor(Math.random() * 90000) + 10000;
    return `BEL-${y}${m}${day}-${rnd}`;
  }

  static validarEnvio(envio) {
    const required = [
      "nombre",
      "direccion",
      "ciudad",
      "provincia",
      "cp",
      "pais",
      "telefono",
    ];
    const missing = required.filter((k) => !envio?.[k]?.toString().trim());

    if (missing.length) {
      const e = new Error(
        `Faltan datos de envío obligatorios: ${missing.join(", ")}`
      );
      e.status = 400;
      throw e;
    }
  }

  // ✅ Crear pedido manual (si quieres conservarlo)
  static async crear(usuarioId, payload) {
    if (!usuarioId) {
      const e = new Error("Usuario no autenticado");
      e.status = 401;
      throw e;
    }

    const items = payload.items || [];
    if (!items.length) {
      const e = new Error("El pedido debe tener al menos un item");
      e.status = 400;
      throw e;
    }

    const subtotal = items.reduce(
      (acc, it) => acc + Number(it.precio_unitario) * Number(it.cantidad),
      0
    );

    const total_iva = Number(payload.total_iva ?? 0);
    const gastos_envio = Number(payload.gastos_envio ?? 0);
    const descuento_total = Number(payload.descuento_total ?? 0);

    const total = subtotal + total_iva + gastos_envio - descuento_total;
    const total_items = items.reduce((acc, it) => acc + Number(it.cantidad), 0);

    const envio = payload.envio || {};
    this.validarEnvio(envio);

    const pedidoData = {
      usuario_id: usuarioId,
      numero_pedido: this.generarNumeroPedido(),
      estado: "pendiente",

      total_items,
      subtotal: Number(subtotal.toFixed(2)),
      total_iva: Number(total_iva.toFixed(2)),
      gastos_envio: Number(gastos_envio.toFixed(2)),
      descuento_total: Number(descuento_total.toFixed(2)),
      total: Number(total.toFixed(2)),

      envio_nombre: envio.nombre,
      envio_direccion: envio.direccion,
      envio_ciudad: envio.ciudad,
      envio_provincia: envio.provincia,
      envio_cp: envio.cp,
      envio_pais: envio.pais || "España",
      envio_telefono: envio.telefono,

      metodo_pago_id: payload.metodo_pago_id ?? null,
      estado_pago: "pendiente",

      notas_cliente: payload.notas_cliente ?? null,
      notas_internas: payload.notas_internas ?? null,
    };

    const itemsInsert = items.map((it) => ({
      ...it,
      total: Number(
        (Number(it.precio_unitario) * Number(it.cantidad)).toFixed(2)
      ),
    }));

    return PedidoRepository.crearPedidoCompleto({
      pedidoData,
      items: itemsInsert,
    });
  }

  // ✅ FLUJO REAL: crear pedido desde carrito del usuario
  static async crearDesdeCarrito(usuarioId, payload = {}) {
    if (!usuarioId) {
      const e = new Error("Usuario no autenticado");
      e.status = 401;
      throw e;
    }

    const envio = payload.envio || {};
    this.validarEnvio(envio);

    const carrito = await CarritoRepository.findActiveByUserId(usuarioId);
    if (!carrito) {
      const e = new Error("No hay carrito activo para el usuario");
      e.status = 404;
      throw e;
    }

    const cartItems = await CarritoItemsRepository.listRawByCarrito(carrito.id);
    const bad = cartItems.find((ci) => !ci.producto_id);
    if (bad) {
      const e = new Error("Carrito inválido: faltan referencias de producto.");
      e.status = 400;
      throw e;
    }
    // ✅ Mapear carrito_items -> pedido_items
    const items = cartItems.map((ci) => ({
      producto_id: ci.producto_id,
      producto_variante_id: ci.producto_variante_id ?? null,
      nombre_producto: ci.nombre_producto ?? "Producto",
      descripcion_variante: ci.descripcion_variante ?? null,
      sku: ci.sku ?? null,
      cantidad: Number(ci.cantidad || 1),
      precio_unitario: Number(ci.precio_unitario || 0),
      total: Number(
        (Number(ci.precio_unitario || 0) * Number(ci.cantidad || 1)).toFixed(2)
      ),
    }));

    const subtotal = items.reduce((acc, it) => acc + it.total, 0);
    const total_items = items.reduce((acc, it) => acc + it.cantidad, 0);

    // ✅ IVA y envío reales pueden venir después, pero aquí no inventamos:
    const gastos_envio = Number(payload.gastos_envio ?? 0);
    const descuento_total = Number(payload.descuento_total ?? 0);
    const total_iva = Number(payload.total_iva ?? 0);

    const total = subtotal + total_iva + gastos_envio - descuento_total;

    const pedidoData = {
      usuario_id: usuarioId,
      numero_pedido: this.generarNumeroPedido(),
      estado: "pendiente",

      total_items,
      subtotal: Number(subtotal.toFixed(2)),
      total_iva: Number(total_iva.toFixed(2)),
      gastos_envio: Number(gastos_envio.toFixed(2)),
      descuento_total: Number(descuento_total.toFixed(2)),
      total: Number(total.toFixed(2)),

      envio_nombre: envio.nombre,
      envio_direccion: envio.direccion,
      envio_ciudad: envio.ciudad,
      envio_provincia: envio.provincia,
      envio_cp: envio.cp,
      envio_pais: envio.pais || "España",
      envio_telefono: envio.telefono,

      metodo_pago_id: payload.metodo_pago_id ?? null,
      estado_pago: "pendiente",

      notas_cliente: payload.notas_cliente ?? null,
      notas_internas: payload.notas_internas ?? null,
    };

    // ✅ Repo transaccional:
    const pedido = await PedidoRepository.crearPedidoCompletoDesdeCarrito({
      pedidoData,
      items,
      carritoId: carrito.id,
    });

    // ✅ Emails (NO rompen el flujo si fallan)
    try {
      const user = await UsuarioRepository.findById(usuarioId);
      const emailCliente = user?.email;

      // 1) Aviso interno a info@beliccia.es
      await EmailService.pedidoCreadoInternal({ pedido });

      // 2) Confirmación al cliente
      if (emailCliente) {
        await EmailService.pedidoCreadoCliente({
          email: emailCliente,
          nombre: user?.nombre || user?.name || null,
          pedido,
        });
      }
    } catch (e) {
      console.error("⚠️ Emails pedido (crear) falló:", e?.message || e);
    }

    return pedido;
  }

  static async actualizar(id, data) {
    // 1) before
    const before = await PedidoRepository.findById(id);
    if (!before) {
      const e = new Error("Pedido no encontrado");
      e.status = 404;
      throw e;
    }

    // 2) update
    const pedido = await PedidoRepository.update(id, data);
    if (!pedido) {
      const e = new Error("Pedido no encontrado");
      e.status = 404;
      throw e;
    }

    // 3) after (para asegurar valores finales)
    const after = await PedidoRepository.findById(id);

    // 4) emails si cambió algo relevante
    try {
      const user = await UsuarioRepository.findById(after.usuario_id);
      const emailCliente = user?.email;

      if (emailCliente) {
        // ✅ Cambio de estado del pedido
        if (before.estado !== after.estado) {
          await EmailService.pedidoEstadoActualizadoCliente({
            email: emailCliente,
            nombre: user?.nombre || null,
            pedido: after,
            estadoAnterior: before.estado,
          });
        }

        // ✅ Cambio de estado del pago
        if (before.estado_pago !== after.estado_pago) {
          await EmailService.pedidoPagoActualizadoCliente({
            email: emailCliente,
            nombre: user?.nombre || null,
            pedido: after,
            estadoPagoAnterior: before.estado_pago,
          });
        }
      }
    } catch (e) {
      console.error("⚠️ Emails pedido (actualizar) falló:", e?.message || e);
    }

    return pedido;
  }

  static async borrar(id) {
    await PedidoRepository.delete(id);
  }
}

export default PedidoService;

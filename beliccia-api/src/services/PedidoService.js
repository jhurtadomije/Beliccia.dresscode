import PedidoRepository from "../repositories/PedidoRepository.js";

class PedidoService {
  static async listar({ page = 1, limit = 12, estado = null, usuario_id = null }) {
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

  // payload esperado desde el front:
  // {
  //   envio: { nombre, direccion, ciudad, provincia, cp, pais, telefono },
  //   items: [{ producto_id, producto_variante_id, nombre_producto, descripcion_variante, sku, cantidad, precio_unitario }]
  //   gastos_envio?, descuento_total?, metodo_pago_id?, notas_cliente?
  // }
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

    // IVA simple (puedes ajustar por reglas futuras)
    const total_iva = 0; // si ahora no aplicas IVA real, deja 0
    const gastos_envio = Number(payload.gastos_envio ?? 0);
    const descuento_total = Number(payload.descuento_total ?? 0);

    const total = subtotal + total_iva + gastos_envio - descuento_total;

    const total_items = items.reduce((acc, it) => acc + Number(it.cantidad), 0);

    const envio = payload.envio || {};

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
      envio_telefono: envio.telefono ?? null,

      metodo_pago_id: payload.metodo_pago_id ?? null,
      estado_pago: "pendiente",

      notas_cliente: payload.notas_cliente ?? null,
      notas_internas: payload.notas_internas ?? null,
    };

    // preparar items para insertar con total calculado
    const itemsInsert = items.map((it) => ({
      ...it,
      total: Number((Number(it.precio_unitario) * Number(it.cantidad)).toFixed(2)),
    }));

    return PedidoRepository.crearPedidoCompleto({
      pedidoData,
      items: itemsInsert,
    });
  }

  static async actualizar(id, data) {
    const pedido = await PedidoRepository.update(id, data);
    if (!pedido) {
      const e = new Error("Pedido no encontrado");
      e.status = 404;
      throw e;
    }
    return pedido;
  }

  static async borrar(id) {
    await PedidoRepository.delete(id);
  }
}

export default PedidoService;

// services/PagoService.js
import Stripe from "stripe";
import PedidoService from "./PedidoService.js";
import { getPool } from "../config/db.js";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    const e = new Error("Falta STRIPE_SECRET_KEY en el entorno");
    e.status = 500;
    throw e;
  }
  return new Stripe(key);
}
const db = getPool(); // ✅ FIX

class PagoService {
  static async iniciarCheckout({ usuarioId, cartSessionId, envio, notas_cliente }) {
  const stripe = getStripe(); // ✅

  if (!usuarioId) {
    const e = new Error("Usuario no autenticado");
    e.status = 401;
    throw e;
  }

  const pedidoCreado = await PedidoService.crearDesdeCarrito(usuarioId, {
    envio,
    notas_cliente,
  });

  const pedido = pedidoCreado?.pedido ?? pedidoCreado;
  const pedidoId = pedido?.id;

  if (!pedidoId) {
    const e = new Error("No se pudo crear el pedido");
    e.status = 500;
    throw e;
  }

  // ✅ Cargar items reales del pedido desde BD
  const [itemsRows] = await db.query(
    `SELECT * FROM pedido_items WHERE pedido_id = ?`,
    [pedidoId]
  );

  const items = itemsRows;

  if (!items.length) {
    const e = new Error("No hay items para pagar");
    e.status = 400;
    throw e;
  }

  const metodoPagoId = await this.#getMetodoPagoIdByCodigo("stripe_card");

  const pagoId = await this.#crearPagoPendiente({
    pedidoId,
    metodoPagoId,
    importe: Number(pedido.total || 0),
    moneda: "EUR",
    modo: process.env.STRIPE_MODE || "test",
  });

  const line_items = items.map((it) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name:
          it.nombre_producto +
          (it.descripcion_variante ? ` - ${it.descripcion_variante}` : ""),
      },
      unit_amount: Math.round(Number(it.precio_unitario) * 100),
    },
    quantity: Number(it.cantidad || 1),
  }));

  const FRONT_URL = process.env.FRONT_URL || "http://localhost:5173";

  const sessionPayload = {
    mode: "payment",
    payment_method_types: ["card"],
    line_items,
    success_url: `${FRONT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${FRONT_URL}/checkout/cancel?pedido_id=${pedidoId}`,
    metadata: {
      pedido_id: String(pedidoId),
      pago_id: String(pagoId),
      usuario_id: String(usuarioId),
    },
  };

  const session = await stripe.checkout.sessions.create(sessionPayload);

  await db.query(
    `
    UPDATE pagos
    SET
      proveedor = 'stripe',
      referencia_pasarela = ?,
      raw_request = ?,
      raw_response = ?
    WHERE id = ?
    `,
    [
      session.id,
      JSON.stringify(sessionPayload),
      JSON.stringify({ id: session.id, url: session.url }),
      pagoId,
    ]
  );

  await db.query(
    `
    UPDATE pedidos
    SET metodo_pago_id = ?, estado_pago = 'pendiente', updated_at = NOW()
    WHERE id = ?
    `,
    [metodoPagoId, pedidoId]
  );

  return {
    ok: true,
    pedidoId,
    pagoId,
    checkoutUrl: session.url,
  };
}


  static async procesarWebhook(event) {
    const stripe = getStripe();
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;

        const pedidoId = Number(session.metadata?.pedido_id);
        const pagoId = Number(session.metadata?.pago_id);
        const sessionId = session.id;

        let cardBrand = null;
        let cardLast4 = null;

        try {
          const fullSession = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["payment_intent", "payment_intent.charges"],
          });

          const charge = fullSession.payment_intent?.charges?.data?.[0];
          cardBrand = charge?.payment_method_details?.card?.brand || null;
          cardLast4 = charge?.payment_method_details?.card?.last4 || null;
        } catch (_) {}

        if (pagoId) {
          await db.query(
            `
            UPDATE pagos
            SET
              estado = 'pagado',
              referencia_pasarela = COALESCE(?, referencia_pasarela),
              card_brand = COALESCE(?, card_brand),
              card_last4 = COALESCE(?, card_last4),
              raw_response = COALESCE(?, raw_response),
              updated_at = NOW()
            WHERE id = ?
            `,
            [sessionId, cardBrand, cardLast4, JSON.stringify(session), pagoId]
          );
        } else {
          await db.query(
            `
            UPDATE pagos
            SET
              estado = 'pagado',
              card_brand = COALESCE(?, card_brand),
              card_last4 = COALESCE(?, card_last4),
              raw_response = COALESCE(?, raw_response),
              updated_at = NOW()
            WHERE proveedor = 'stripe' AND referencia_pasarela = ?
            `,
            [cardBrand, cardLast4, JSON.stringify(session), sessionId]
          );
        }

        if (pedidoId) {
          await db.query(
            `
            UPDATE pedidos
            SET
              estado_pago = 'pagado',
              estado = 'confirmado',
              updated_at = NOW()
            WHERE id = ?
            `,
            [pedidoId]
          );

          await db.query(
            `
            INSERT INTO pedido_historial_estado
              (pedido_id, estado, comentario, cambiado_por)
            VALUES
              (?, 'confirmado', 'Pago confirmado por Stripe', NULL)
            `,
            [pedidoId]
          );
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const pedidoId = Number(session.metadata?.pedido_id);
        const pagoId = Number(session.metadata?.pago_id);

        if (pagoId) {
          await db.query(
            `
            UPDATE pagos
            SET
              estado = 'fallido',
              error_mensaje = 'Sesión expirada',
              raw_response = COALESCE(?, raw_response),
              updated_at = NOW()
            WHERE id = ?
            `,
            [JSON.stringify(session), pagoId]
          );
        }

        if (pedidoId) {
          await db.query(
            `
            UPDATE pedidos
            SET estado_pago = 'fallido', updated_at = NOW()
            WHERE id = ?
            `,
            [pedidoId]
          );
        }

        break;
      }

      default:
        break;
    }
  }

  static async verificarSession(sessionId) {
    const stripe = getStripe();
    return await stripe.checkout.sessions.retrieve(sessionId);
  }

  static async #getMetodoPagoIdByCodigo(codigo) {
    const [rows] = await db.query(
      `SELECT id FROM metodos_pago WHERE codigo = ? AND activo = 1 LIMIT 1`,
      [codigo]
    );

    const id = rows?.[0]?.id;
    if (!id) {
      const e = new Error(
        `Método de pago '${codigo}' no existe. Inserta stripe_card en metodos_pago.`
      );
      e.status = 500;
      throw e;
    }

    return id;
  }

  static async #crearPagoPendiente({ pedidoId, metodoPagoId, importe, moneda, modo }) {
    const [result] = await db.query(
      `
      INSERT INTO pagos
        (pedido_id, metodo_pago_id, proveedor, estado, importe, moneda, modo)
      VALUES
        (?, ?, 'stripe', 'pendiente', ?, ?, ?)
      `,
      [pedidoId, metodoPagoId, importe, moneda, modo]
    );

    return result.insertId;
  }
}

export default PagoService;

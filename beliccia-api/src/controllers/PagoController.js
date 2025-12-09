import PagoService from "../services/PagoService.js";

// POST /api/pagos/iniciar
export async function iniciarCheckout(req, res) {
  try {
    const usuarioId = req.user?.id;
    const cartSessionId = req.cartSessionId;

    const { envio, notas_cliente } = req.body;

    const result = await PagoService.iniciarCheckout({
      usuarioId,
      cartSessionId,
      envio,
      notas_cliente,
    });

    res.json(result);
  } catch (err) {
    console.error("iniciarCheckout error:", err);
    res.status(500).json({ ok: false, message: err.message || "Error iniciando checkout" });
  }
}

// GET /api/pagos/verificar?session_id=...
export async function verificarSession(req, res) {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ message: "session_id requerido" });
    }

    const session = await PagoService.verificarSession(session_id);

    res.json({
      id: session.id,
      payment_status: session.payment_status,
      status: session.status,
      metadata: session.metadata,
    });
  } catch (err) {
    console.error("verificarSession error:", err);
    res.status(500).json({ ok: false, message: "Error verificando sesión" });
  }
}

// POST /api/pagos/webhook
export async function webhookStripe(req, res) {
  try {
    const result = await PagoService.webhookStripe(req);
    res.json(result);
  } catch (err) {
    console.error("webhookStripe error:", err);
    // Si el error es de firma, Stripe espera 400
    const status = err?.message?.includes("signature") ? 400 : 500;
    res.status(status).send(err.message || "Webhook error");
  }
}
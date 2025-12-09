//src/controllers/StripeWebhookController.js
import Stripe from "stripe";
import PagoService from "../services/PagoService.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function stripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await PagoService.procesarWebhook(event);
    res.json({ received: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error procesando webhook" });
  }
}

// src/services/EmailService.js
import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  INFO_EMAIL = "info@beliccia.es",
} = process.env;

function assertEnv() {
  const missing = [];
  if (!SMTP_HOST) missing.push("SMTP_HOST");
  if (!SMTP_PORT) missing.push("SMTP_PORT");
  if (!SMTP_USER) missing.push("SMTP_USER");
  if (!SMTP_PASS) missing.push("SMTP_PASS");
  if (!SMTP_FROM) missing.push("SMTP_FROM");

  if (missing.length) {
    throw new Error(`Faltan variables SMTP en .env: ${missing.join(", ")}`);
  }
}

let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;

  assertEnv();

  _transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: false, // 587 => STARTTLS
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return _transporter;
}

export default class EmailService {
  // Envío genérico
  static async send({ to, subject, html, text, replyTo }) {
    const transporter = getTransporter();

    const mail = {
      from: SMTP_FROM,
      to,
      subject,
      text,
      html,
      ...(replyTo ? { replyTo } : {}),
    };

    return transporter.sendMail(mail);
  }

  // ✅ Aviso interno (a info@beliccia.es)
  static async notifyInternal({ subject, html, text }) {
    return this.send({
      to: INFO_EMAIL,
      subject,
      html,
      text,
      replyTo: INFO_EMAIL,
    });
  }

  // -----------------------------
  // PEDIDOS
  // -----------------------------
  static async pedidoCreadoCliente({ email, nombre, pedido }) {
    const subject = `✅ Pedido recibido ${pedido?.numero_pedido ? `(${pedido.numero_pedido})` : ""}`;
    const html = `
      <p>Hola ${nombre || ""},</p>
      <p>Hemos recibido tu pedido correctamente.</p>
      <p><strong>Estado:</strong> ${pedido?.estado || "pendiente"}</p>
      <p><strong>Total:</strong> ${pedido?.total ?? ""} €</p>
      <p>Gracias por confiar en Beliccia.</p>
    `;

    return this.send({ to: email, subject, html });
  }

  static async pedidoCreadoInternal({ pedido }) {
    const subject = `📦 Nuevo pedido recibido ${pedido?.numero_pedido ? `(${pedido.numero_pedido})` : ""}`;
    const html = `
      <p>Se ha recibido un nuevo pedido desde la web.</p>
      <ul>
        <li><strong>ID:</strong> ${pedido?.id}</li>
        <li><strong>Número:</strong> ${pedido?.numero_pedido || "-"}</li>
        <li><strong>Cliente:</strong> ${pedido?.envio_nombre || "-"}</li>
        <li><strong>Total:</strong> ${pedido?.total ?? ""} €</li>
        <li><strong>Estado:</strong> ${pedido?.estado || "-"}</li>
      </ul>
    `;
    return this.notifyInternal({ subject, html });
  }

  static async pedidoEstadoActualizadoCliente({ email, nombre, pedido, estadoAnterior }) {
    const subject = `📦 Tu pedido ha cambiado de estado: ${pedido?.estado}`;
    const html = `
      <p>Hola ${nombre || ""},</p>
      <p>Tu pedido ${pedido?.numero_pedido ? `<strong>${pedido.numero_pedido}</strong>` : ""} ha cambiado de estado.</p>
      <p><strong>Antes:</strong> ${estadoAnterior || "-"}</p>
      <p><strong>Ahora:</strong> ${pedido?.estado || "-"}</p>
    `;
    return this.send({ to: email, subject, html });
  }
  
  static async pedidoPagoActualizadoCliente({ email, nombre, pedido, estadoPagoAnterior }) {
  const subject = `💳 Estado del pago actualizado: ${pedido?.estado_pago}`;
  const html = `
    <p>Hola ${nombre || ""},</p>
    <p>Se ha actualizado el estado del pago de tu pedido ${
      pedido?.numero_pedido ? `<strong>${pedido.numero_pedido}</strong>` : ""
    }.</p>
    <p><strong>Antes:</strong> ${estadoPagoAnterior || "-"}</p>
    <p><strong>Ahora:</strong> ${pedido?.estado_pago || "-"}</p>
  `;
  return this.send({ to: email, subject, html });
}

  // -----------------------------
  // CITAS
  // -----------------------------
  static async citaSolicitadaCliente({ email, nombre, cita }) {
    const subject = `✅ Solicitud recibida (${cita?.tipo || "cita"})`;
    const html = `
      <p>Hola ${nombre || ""},</p>
      <p>Hemos recibido tu solicitud correctamente.</p>
      <p>En breve nos pondremos en contacto contigo.</p>
    `;
    return this.send({ to: email, subject, html });
  }

  static async citaSolicitadaInternal({ cita }) {
    const subject = `📅 Nueva solicitud desde la web (${cita?.tipo || "cita"})`;
    const html = `
      <p>Nueva solicitud recibida:</p>
      <ul>
        <li><strong>ID:</strong> ${cita?.id}</li>
        <li><strong>Nombre:</strong> ${cita?.nombre}</li>
        <li><strong>Email:</strong> ${cita?.email}</li>
        <li><strong>Teléfono:</strong> ${cita?.telefono || "-"}</li>
        <li><strong>Mensaje:</strong> ${cita?.mensaje || "-"}</li>
      </ul>
    `;
    return this.notifyInternal({ subject, html });
  }

  static async citaConfirmadaCliente({ email, nombre, cita }) {
    const fecha = cita?.fecha_confirmada
      ? new Date(cita.fecha_confirmada).toLocaleString("es-ES")
      : "-";

    const subject = `📅 Cita confirmada: ${fecha}`;
    const html = `
      <p>Hola ${nombre || ""},</p>
      <p>Tu cita ha sido confirmada.</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p>Si necesitas cambiarla, responde a este correo o escribe a ${INFO_EMAIL}.</p>
    `;
    return this.send({ to: email, subject, html, replyTo: INFO_EMAIL });
  }
}

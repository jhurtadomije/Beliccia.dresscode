// src/components/Contact.jsx
import { useState } from "react";
import api from "../services/api";

export default function Contact({ producto = null }) {
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    const formEl = e.currentTarget;
    setMsg(null);
    setSending(true);

    const form = new FormData(formEl);

    const payload = {
      nombre: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      telefono: String(form.get("telefono") || "").trim() || null,
      tipo: "info",
      mensaje: String(form.get("message") || "").trim(),
      producto_id: producto?.id ?? null,
      categoria_id: producto?.categoria_id ?? null,
    };

    try {
      await api.post("/citas", payload);

      setMsg({ type: "ok", text: "✅ ¡Enviado! Te contactaremos lo antes posible." });
      formEl.reset();
    } catch (err) {
      console.error(err);

      const backendMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "No se pudo enviar el mensaje. Inténtalo de nuevo.";

      setMsg({ type: "err", text: `❌ ${backendMsg}` });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-5 section fadeIn">
      <div className="container" style={{ maxWidth: 720 }}>
        <h2 className="mb-4 text-center">Contacto</h2>

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Nombre
            </label>
            <input
              name="name"
              type="text"
              className="form-control"
              id="name"
              placeholder="Tu nombre"
              autoComplete="name"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              name="email"
              type="email"
              className="form-control"
              id="email"
              placeholder="tu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">
              Teléfono (opcional)
            </label>
            <input
              name="telefono"
              type="tel"
              className="form-control"
              id="telefono"
              placeholder="Ej: 600 123 123"
              autoComplete="tel"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              Mensaje
            </label>
            <textarea
              name="message"
              className="form-control"
              id="message"
              rows={4}
              placeholder="Cuéntanos qué necesitas…"
              required
            />
          </div>

          {msg && (
            <div
              className={`alert ${msg.type === "ok" ? "alert-success" : "alert-danger"} py-2`}
              role="alert"
            >
              {msg.text}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary d-block mx-auto"
            disabled={sending}
          >
            {sending ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </section>
  );
}

  
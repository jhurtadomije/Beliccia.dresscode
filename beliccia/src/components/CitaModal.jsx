// src/components/CitaModal.jsx
import { useState } from "react";
import api from "../services/api";
import { resolveImageUrl } from "../services/imageUrl";

const PLACEHOLDER = "/placeholder.png";

export default function CitaModal({ open, onClose, producto }) {
  const [sendingCita, setSendingCita] = useState(false);
  const [citaMsg, setCitaMsg] = useState(null);

  if (!open || !producto) return null;

  const nombre = producto?.nombre || "Producto";
  const imgUrl = resolveImageUrl(
    producto?.imagen_portada || producto?.imagen || PLACEHOLDER
  );

  const close = () => {
    onClose?.();
    setCitaMsg(null);
    setSendingCita(false);
  };

  return (
    <div
      className="custom-modal-backdrop"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={`Solicitar información de ${nombre}`}
    >
      <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close" onClick={close} aria-label="Cerrar">
          &times;
        </button>

        <h5 className="mb-3">{nombre}</h5>

        <div className="modal-gallery mb-3 d-flex align-items-center">
          <img
            src={imgUrl}
            alt={`${nombre} - foto 1`}
            className="modal-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER;
            }}
            style={{
              maxWidth: 90,
              maxHeight: 90,
              marginRight: 8,
              borderRadius: 8,
              objectFit: "cover",
              border: "1px solid #eee",
            }}
          />
        </div>

        <form
          className="mt-2"
          onSubmit={async (e) => {
            e.preventDefault();

            const formEl = e.currentTarget;
            setCitaMsg(null);
            setSendingCita(true);

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

              setCitaMsg({
                type: "ok",
                text: "✅ ¡Listo! Hemos recibido tu solicitud.",
              });

              formEl.reset();
              setTimeout(() => close(), 800);
            } catch (err) {
              console.error(err);

              const backendMsg =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                "No se pudo enviar la solicitud. Inténtalo de nuevo.";

              setCitaMsg({ type: "err", text: `❌ ${backendMsg}` });
            } finally {
              setSendingCita(false);
            }
          }}
        >
          <input
            name="name"
            autoComplete="name"
            className="form-control mb-2"
            placeholder="Nombre"
            required
          />
          <input
            name="email"
            autoComplete="email"
            className="form-control mb-2"
            placeholder="Correo electrónico"
            type="email"
            required
          />
          <input
            name="telefono"
            autoComplete="tel"
            className="form-control mb-2"
            placeholder="Teléfono (opcional)"
          />
          <textarea
            name="message"
            autoComplete="off"
            className="form-control mb-2"
            placeholder="Mensaje o consulta"
            required
          />

          {citaMsg && (
            <div
              className={`alert ${
                citaMsg.type === "ok" ? "alert-success" : "alert-danger"
              } py-2`}
              role="alert"
            >
              {citaMsg.text}
            </div>
          )}

          <button
            className="btn btn-success w-100"
            type="submit"
            disabled={sendingCita}
          >
            {sendingCita ? "Enviando..." : "Enviar solicitud de información"}
          </button>
        </form>
      </div>
    </div>
  );
}

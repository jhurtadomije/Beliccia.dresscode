// src/components/CitaModal.jsx
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import api from "../services/api";
import { resolveImageUrl } from "../services/imageUrl";

const PLACEHOLDER = "/placeholder.png";

const GENERIC_PRODUCT = {
  id: null,
  categoria_id: null,
  nombre: "Cita en Beliccia",
  imagen_portada: PLACEHOLDER,
};

const pickFirstImage = (p) => {
  if (!p) return "";
  if (p.imagen_portada) return p.imagen_portada;
  if (p.imagen) return p.imagen;
  const first = Array.isArray(p.imagenes) ? p.imagenes[0] : null;
  if (typeof first === "string") return first;
  if (first?.url) return first.url;
  return "";
};

export default function CitaModal({ open, onClose, producto }) {
  const [sendingCita, setSendingCita] = useState(false);
  const [citaMsg, setCitaMsg] = useState(null);

  // ✅ Siempre hay “producto” para pintar modal (general o de un vestido)
  const p = producto ?? GENERIC_PRODUCT;

  const img = useMemo(
    () => resolveImageUrl(pickFirstImage(p)) || PLACEHOLDER,
    [p]
  );

  // Mantener scroll al abrir/cerrar modal
  useEffect(() => {
    if (!open) return;

    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    const prev = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };

    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;

    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.paddingRight = prev.paddingRight;
    };
  }, [open]);

  // ✅ Reset solo al abrir (NO dependas de producto?.id)
  useEffect(() => {
    if (!open) return;
    setCitaMsg(null);
    setSendingCita(false);
  }, [open]);

  // ✅ OJO: solo depende de open
  if (!open) return null;

  const nombre = p?.nombre || "Cita en Beliccia";

  const close = () => {
    onClose?.();
    setCitaMsg(null);
    setSendingCita(false);
  };

  return createPortal(
    <div
      className="custom-modal-backdrop"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={`Solicitar información - ${nombre}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(0,0,0,.45)",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
    >
      <div
        className="custom-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(720px, 100%)",
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: 16,
          background: "#fff",
        }}
      >
        <button
          type="button"
          className="btn-close"
          onClick={close}
          aria-label="Cerrar"
        >
          &times;
        </button>

        <h5 className="mb-3">{nombre}</h5>

        <div className="modal-gallery mb-3 d-flex align-items-center">
          <img
            src={img}
            alt={nombre}
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

            const consent = form.get("consent") === "on";
            if (!consent) {
              setCitaMsg({
                type: "err",
                text: "❌ Debes aceptar la Política de Privacidad para enviar la solicitud.",
              });
              setSendingCita(false);
              return;
            }

            const payload = {
              nombre: String(form.get("name") || "").trim(),
              email: String(form.get("email") || "").trim(),
              telefono: String(form.get("telefono") || "").trim() || null,
              tipo: "info",
              mensaje: String(form.get("message") || "").trim(),
              // ✅ si es cita general, se manda null
              producto_id: producto?.id ?? null,
              categoria_id: producto?.categoria_id ?? null,
              consentimiento_privacidad: true,
            };

            try {
              await api.post("/citas", payload);

              setCitaMsg({ type: "ok", text: "✅ ¡Listo! Hemos recibido tu solicitud." });
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
          <input name="name" autoComplete="name" className="form-control mb-2" placeholder="Nombre" required />
          <input name="email" autoComplete="email" className="form-control mb-2" placeholder="Correo electrónico" type="email" required />
          <input name="telefono" autoComplete="tel" className="form-control mb-2" placeholder="Teléfono (opcional)" />
          <textarea name="message" autoComplete="off" className="form-control mb-2" placeholder="Mensaje o consulta" required />

          <div className="form-check mt-2 mb-2">
            <input className="form-check-input" type="checkbox" id="consent" name="consent" required />
            <label className="form-check-label text-muted" htmlFor="consent" style={{ lineHeight: 1.4 }}>
              He leído y acepto la{" "}
              <Link to="/legal/privacidad" className="text-decoration-underline">
                Política de Privacidad
              </Link>
              .
            </label>
          </div>

          <p className="text-muted small mb-3" style={{ lineHeight: 1.6 }}>
            Tus datos serán tratados por <strong>Beliccia Dress Code</strong> para gestionar tu solicitud y contactarte.
            Más info en{" "}
            <Link to="/legal/privacidad" className="text-decoration-underline">
              Política de Privacidad
            </Link>
            .
          </p>

          {citaMsg && (
            <div className={`alert ${citaMsg.type === "ok" ? "alert-success" : "alert-danger"} py-2`} role="alert">
              {citaMsg.text}
            </div>
          )}

          <button className="btn btn-success w-100" type="submit" disabled={sendingCita}>
            {sendingCita ? "Enviando..." : "Enviar solicitud de información"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

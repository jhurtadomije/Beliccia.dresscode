import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  getConsent,
  acceptAll,
  rejectAll,
  setConsent,
} from "../utils/cookiesConsent";

export default function CookieBanner() {
  const [consent, setConsentState] = useState(null);
  const [openSettings, setOpenSettings] = useState(false);

  // Cargar estado al iniciar
  useEffect(() => {
    setConsentState(getConsent());
  }, []);

  // Escuchar cambios / abrir panel desde fuera
  useEffect(() => {
    const onChange = (e) => setConsentState(e.detail);
    const onOpen = () => setOpenSettings(true);

    window.addEventListener("cookie-consent:change", onChange);
    window.addEventListener("cookie-consent:open", onOpen);
    return () => {
      window.removeEventListener("cookie-consent:change", onChange);
      window.removeEventListener("cookie-consent:open", onOpen);
    };
  }, []);

  const hasDecided = !!consent;

  // Estado editable del panel
  const [draft, setDraft] = useState({
    necessary: true,
    preferences: false,
    analytics: false,
    marketing: false,
  });

  // Cuando abras panel, precarga con lo que haya guardado
  useEffect(() => {
    if (!openSettings) return;
    const current = getConsent();
    setDraft(current || { necessary: true, preferences: false, analytics: false, marketing: false });
  }, [openSettings]);

  const closeSettings = () => setOpenSettings(false);

  const handleAcceptAll = () => {
    acceptAll();
    setOpenSettings(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    setOpenSettings(false);
  };

  const handleSave = () => {
    setConsent(draft);
    setOpenSettings(false);
  };

  // Banner solo si no hay decisión aún
  const showBanner = !hasDecided;

  return (
    <>
      {showBanner &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2500,
              padding: 12,
              background: "rgba(255,255,255,.96)",
              boxShadow: "0 -12px 24px rgba(0,0,0,.08)",
              borderTop: "1px solid rgba(0,0,0,.06)",
              backdropFilter: "blur(6px)",
            }}
          >
            <div className="container">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                <div className="text-muted small" style={{ lineHeight: 1.6 }}>
                  Usamos cookies técnicas para que la web funcione. Además, con tu permiso,
                  podemos usar cookies de preferencias y analítica para mejorar tu experiencia.
                  Puedes aceptarlas, rechazarlas o configurarlas.{" "}
                  <Link to="/legal/cookies" className="text-decoration-underline">
                    Ver Política de Cookies
                  </Link>
                  .
                </div>

                <div className="d-flex gap-2 flex-wrap justify-content-center justify-content-md-end">
                  <button type="button" className="btn btn-outline-dark" onClick={handleRejectAll}>
                    Rechazar
                  </button>
                  <button type="button" className="btn btn-outline-dark" onClick={() => setOpenSettings(true)}>
                    Configurar
                  </button>
                  <button type="button" className="btn btn-dark" onClick={handleAcceptAll}>
                    Aceptar
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Panel de configuración */}
      {openSettings &&
        createPortal(
          <div
            onClick={closeSettings}
            role="dialog"
            aria-modal="true"
            aria-label="Configuración de cookies"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2600,
              background: "rgba(0,0,0,.45)",
              display: "grid",
              placeItems: "center",
              padding: 16,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(720px, 100%)",
                background: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(0,0,0,.25)",
              }}
            >
              <div className="p-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="mb-1">Preferencias de cookies</h5>
                    <div className="text-muted small">
                      Puedes cambiar tu consentimiento en cualquier momento.
                    </div>
                  </div>
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={closeSettings}>
                    Cerrar
                  </button>
                </div>

                <hr />

                {/* Necessary */}
                <div className="d-flex justify-content-between align-items-center py-2">
                  <div>
                    <div className="fw-semibold">Cookies técnicas (necesarias)</div>
                    <div className="text-muted small">
                      Imprescindibles para el funcionamiento, seguridad y carrito.
                    </div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input className="form-check-input" type="checkbox" checked disabled />
                  </div>
                </div>

                {/* Preferences */}
                <div className="d-flex justify-content-between align-items-center py-2">
                  <div>
                    <div className="fw-semibold">Preferencias</div>
                    <div className="text-muted small">Recuerdan opciones (si aplica).</div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={!!draft.preferences}
                      onChange={(e) => setDraft((p) => ({ ...p, preferences: e.target.checked }))}
                    />
                  </div>
                </div>

                {/* Analytics */}
                <div className="d-flex justify-content-between align-items-center py-2">
                  <div>
                    <div className="fw-semibold">Analítica</div>
                    <div className="text-muted small">
                      Ayudan a entender el uso para mejorar la web (solo si se aceptan).
                    </div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={!!draft.analytics}
                      onChange={(e) => setDraft((p) => ({ ...p, analytics: e.target.checked }))}
                    />
                  </div>
                </div>

                {/* Marketing */}
                <div className="d-flex justify-content-between align-items-center py-2">
                  <div>
                    <div className="fw-semibold">Marketing</div>
                    <div className="text-muted small">
                      Personalización publicitaria (solo si se aceptan).
                    </div>
                  </div>
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={!!draft.marketing}
                      onChange={(e) => setDraft((p) => ({ ...p, marketing: e.target.checked }))}
                    />
                  </div>
                </div>

                <div className="text-muted small mt-3">
                  Más información en{" "}
                  <Link to="/legal/cookies" className="text-decoration-underline" onClick={closeSettings}>
                    Política de Cookies
                  </Link>
                  .
                </div>

                <div className="d-flex gap-2 flex-wrap justify-content-end mt-4">
                  <button type="button" className="btn btn-outline-dark" onClick={handleRejectAll}>
                    Rechazar todo
                  </button>
                  <button type="button" className="btn btn-outline-dark" onClick={handleAcceptAll}>
                    Aceptar todo
                  </button>
                  <button type="button" className="btn btn-dark" onClick={handleSave}>
                    Guardar configuración
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

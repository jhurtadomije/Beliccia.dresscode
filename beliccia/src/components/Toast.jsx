// src/components/Toast.jsx
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

export default function Toast({
  show,
  message,
  onClose,
  duration = 2400,
  actionText,
  actionTo,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [show, duration, onClose]);

  if (!show) return null;

  return createPortal(
    <div className="bdc-toast-wrap" role="status" aria-live="polite">
      <div className="bdc-toast">
        <span className="bdc-toast__msg">{message}</span>

        <div className="bdc-toast__actions">
          {actionText && actionTo && (
            <button
              type="button"
              className="bdc-toast__btn"
              onClick={() => {
                onClose?.();
                navigate(actionTo);
              }}
            >
              {actionText}
            </button>
          )}

          <button
            type="button"
            className="bdc-toast__close"
            aria-label="Cerrar"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

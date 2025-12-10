// src/components/GoogleButton.jsx
import { useEffect, useRef } from "react";

export default function GoogleButton({
  onCredential,
  text = "signin_with",
  theme = "outline",
  size = "large",
  shape = "rectangular",
  width,
}) {
  const divRef = useRef(null);

  useEffect(() => {
    const google = window.google;
    if (!google?.accounts?.id || !divRef.current) return;

    // ⚠️ Usa tu client ID real en .env
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.warn("Falta VITE_GOOGLE_CLIENT_ID en .env");
      return;
    }

    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        onCredential?.(response.credential);
      },
    });

    google.accounts.id.renderButton(divRef.current, {
      theme,
      size,
      text, // "signin_with" | "signup_with" | "continue_with"
      shape,
      width,
    });

    // Opcional: One Tap desactivado por ahora
    // google.accounts.id.prompt();
  }, [onCredential, text, theme, size, shape, width]);

  return <div ref={divRef} />;
}

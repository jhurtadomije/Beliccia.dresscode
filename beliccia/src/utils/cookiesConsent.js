const KEY = "beliccia_cookie_consent_v1";

export const DEFAULT_CONSENT = {
  necessary: true,      // siempre true
  preferences: false,
  analytics: false,
  marketing: false,
  updatedAt: null,
};

export function getConsent() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // normaliza por si faltan claves
    return { ...DEFAULT_CONSENT, ...data, necessary: true };
  } catch {
    return null;
  }
}

export function setConsent(partial) {
  const payload = {
    ...DEFAULT_CONSENT,
    ...partial,
    necessary: true,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(payload));
  // evento para que otras partes reaccionen
  window.dispatchEvent(new CustomEvent("cookie-consent:change", { detail: payload }));
  return payload;
}

export function acceptAll() {
  return setConsent({
    preferences: true,
    analytics: true,
    marketing: true,
  });
}

export function rejectAll() {
  return setConsent({
    preferences: false,
    analytics: false,
    marketing: false,
  });
}

// Para abrir el panel desde cualquier sitio (footer, etc.)
export function openCookieSettings() {
  window.dispatchEvent(new Event("cookie-consent:open"));
}

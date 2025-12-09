// src/context/AuthContext.jsx


import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const STORAGE_KEY_TOKEN = "auth_token";
const STORAGE_KEY_USER = "auth_user";

const normalizeRole = (u) =>
  String(u?.role || u?.rol || "").toLowerCase().trim();

/**
 * Persistencia inmediata + headers globales
 * Evita race condition con /carrito/merge justo tras login/register
 */
function persistAuth(nextToken, nextUser) {
  try {
    if (nextToken) localStorage.setItem(STORAGE_KEY_TOKEN, nextToken);
    else localStorage.removeItem(STORAGE_KEY_TOKEN);

    if (nextUser)
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(nextUser));
    else localStorage.removeItem(STORAGE_KEY_USER);
  } catch {
    // silencio seguro
  }

  // ✅ Authorization inmediato
  if (nextToken) {
    api.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_TOKEN) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // ✅ Mantener consistencia
  useEffect(() => {
    persistAuth(token, user);
  }, [token, user]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });

      const nextToken = data?.token;
      const usuario = data?.user;

      if (!nextToken || !usuario) {
        return {
          ok: false,
          message: "La API no devuelve token o usuario en el formato esperado.",
        };
      }

      const nextUser = {
        ...usuario,
        role: usuario.rol || usuario.role,
      };

      // ✅ Persistencia inmediata (clave)
      persistAuth(nextToken, nextUser);

      setToken(nextToken);
      setUser(nextUser);

      return { ok: true, token: nextToken, user: nextUser };
    } catch (err) {
      console.error("Error en login:", err);
      return {
        ok: false,
        message:
          err.response?.data?.message ||
          "No se pudo iniciar sesión. Revisa tus credenciales.",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);

      const nextToken = data?.token;
      const usuario = data?.user;

      if (!nextToken || !usuario) {
        return { ok: false, message: "Registro inválido" };
      }

      const nextUser = {
        ...usuario,
        role: usuario.rol || usuario.role,
      };

      // ✅ Persistencia inmediata
      persistAuth(nextToken, nextUser);

      setToken(nextToken);
      setUser(nextUser);

      return { ok: true, token: nextToken, user: nextUser };
    } catch (err) {
      return {
        ok: false,
        message:
          err.response?.data?.message || "No se pudo completar el registro.",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    persistAuth(null, null);
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem("beliccia_cart_session_id")
    } catch {}
  }, []);

  const role = useMemo(() => normalizeRole(user), [user]);
  const isLoggedIn = Boolean(token && user);

  const canAccessAdmin = useMemo(
    () => ["admin", "dependienta"].includes(role),
    [role]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      isLoggedIn,
      isAdmin: canAccessAdmin, // alias compatible
      canAccessAdmin,
      loading,
      login,
      register,
      logout,
    }),
    [
      user,
      token,
      role,
      isLoggedIn,
      canAccessAdmin,
      loading,
      login,
      register,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
}

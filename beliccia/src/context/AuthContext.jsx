/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const STORAGE_KEY_TOKEN = "auth_token";
const STORAGE_KEY_USER = "auth_user";

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

  // Sincronizar con localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }

    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [token, user]);

  async function login(email, password) {
  setLoading(true);
  try {
    const { data } = await api.post("/auth/login", { email, password });

    console.log("Respuesta login API:", data);

    // Aquí usamos EXACTAMENTE lo que devuelve tu backend
    const token = data.token;
    const usuario = data.usuario;

    if (!token || !usuario) {
      return {
        ok: false,
        message:
          "La API no devuelve token o usuario en el formato esperado.",
      };
    }

    // Normalizamos el usuario para que el resto del front use .role
    const user = {
      ...usuario,
      role: usuario.rol, // 👈 clave: mapear rol -> role
    };

    setToken(token);
    setUser(user);

    return { ok: true };
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
}



  function logout() {
    setToken(null);
    setUser(null);
  }

  const isLoggedIn = Boolean(token && user);
  const isAdmin =
  user && (user.role === "admin" || user.role === "dependienta");


  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, isAdmin, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return ctx;
}

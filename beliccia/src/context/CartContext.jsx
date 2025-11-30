/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

// Contexto
const CartContext = createContext();

// Identificador normalizado para el carrito
// Prioriza slug (estable en la URL) y luego id numérico de BBDD
const getProductId = (p) => p?.slug ?? p?.id ?? null;

// Helper precios
const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export function CartProvider({ children }) {
  // Carga inicial desde localStorage
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persistir en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Añadir producto (o incrementar cantidad)
  function addToCart(product) {
    setItems((prev) => {
      const key = getProductId(product);
      if (!key) {
        console.warn(
          "Producto sin slug/id válido en addToCart:",
          product
        );
        return prev;
      }

      // Normalizamos el precio: primero `precio` si viene del front,
      // si no, usamos `precio_base` de la API.
      const unitPrice = asNumber(
        product.precio ?? product.precio_base
      );

      const existing = prev.find((i) => i.id === key);

      if (existing) {
        return prev.map((i) =>
          i.id === key
            ? {
                ...i,
                quantity: (i.quantity || 1) + 1,
              }
            : i
        );
      }

      return [
        ...prev,
        {
          ...product,
          // id normalizado para el carrito (slug o id)
          id: key,
          // id real de BBDD para cuando hablemos con la API de carritos/pedidos
          producto_id: product.id ?? null,
          // precio normalizado (número)
          precio: unitPrice,
          quantity: 1,
        },
      ];
    });
  }

  // Eliminar producto
  function removeFromCart(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  // Actualizar cantidad
  function updateQuantity(id, quantity) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, quantity: Math.max(1, Number(quantity) || 1) }
          : i
      )
    );
  }

  // Vaciar carrito
  function clearCart() {
    setItems([]);
  }

  // Totales derivados (útil para icono del header, resumen, etc.)
  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + (i.quantity || 0), 0),
    [items]
  );

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (acc, i) => acc + asNumber(i.precio) * (i.quantity || 0),
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return ctx;
}

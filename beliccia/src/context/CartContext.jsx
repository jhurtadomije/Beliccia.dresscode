// src/context/CartContext.jsx

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import api from "../services/api";

const CartContext = createContext(null);

const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function normalizeApiCartItems(apiItems = []) {
  return apiItems.map((it) => {
    const unitPrice = asNumber(it.precio_unitario);

    return {
      id: it.id,
      producto_variante_id: it.producto_variante_id,
      producto_id: it.producto_id,
      sku: it.sku,

      talla: it.talla ?? null,
      color: it.color ?? null,

      nombre: it.producto_nombre ?? "Producto",
      slug: it.producto_slug ?? null,

      precio: unitPrice,
      quantity: Number(it.cantidad || 1),

      imagenes: it.imagenes ?? undefined,
      imagen_portada: it.imagen_portada ?? undefined,
    };
  });
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  // Mantener ref para evitar dependencias innecesarias en callbacks
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const fetchCart = useCallback(async () => {
    setLoadingCart(true);
    try {
      const { data } = await api.get("/carrito");

      // 👇 Backend suele devolver { ok, carrito, items } o similar
      const apiItems = data?.items || data?.carrito?.items || [];
      const normalized = normalizeApiCartItems(apiItems);

      setItems(normalized);
    } catch (err) {
      // Si esto te estaba generando spam, lo dejamos en console.debug
      console.debug("fetchCart: no se pudo cargar carrito", err);
      setItems([]);
    } finally {
      setLoadingCart(false);
    }
  }, []);

  // Carga inicial real (una vez)
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (productOrVariante) => {
      try {
        const varianteId =
          Number(productOrVariante?.producto_variante_id) ||
          Number(productOrVariante?.variante_id) ||
          Number(productOrVariante?.id_variante) ||
          null;

        const productoId =
          Number(productOrVariante?.producto_id) ||
          Number(productOrVariante?.id) ||
          null;

        if (!varianteId && !productoId) {
          console.warn(
            "addToCart: falta producto_id o producto_variante_id",
            productOrVariante
          );
          return;
        }

        await api.post("/carrito/items", {
          producto_variante_id: varianteId ?? undefined,
          producto_id: productoId ?? undefined,
          cantidad: 1,
        });

        await fetchCart();
      } catch (err) {
        console.warn("addToCart falló", err);
      }
    },
    [fetchCart]
  );

  const removeFromCart = useCallback(async (itemId) => {
    try {
      await api.delete(`/carrito/items/${itemId}`);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      console.warn("removeFromCart falló", err);
    }
  }, []);

  const updateQuantity = useCallback(
    async (itemId, quantity) => {
      const qty = Math.max(1, Number(quantity) || 1);

      // Optimistic UI
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity: qty } : i))
      );

      try {
        await api.put(`/carrito/items/${itemId}`, { cantidad: qty });
        await fetchCart();
      } catch (err) {
        console.warn("updateQuantity falló", err);
        await fetchCart();
      }
    },
    [fetchCart]
  );

  const clearCart = useCallback(
    async () => {
      const current = itemsRef.current;

      // Optimistic
      setItems([]);

      try {
        // Si tienes endpoint backend tipo DELETE /carrito, úsalo.
        // await api.delete("/carrito");

        // Si no existe, borrado por items:
        await Promise.all(
          current.map((it) => api.delete(`/carrito/items/${it.id}`))
        );
      } catch (err) {
        console.warn("clearCart falló", err);
        await fetchCart();
      }
    },
    [fetchCart]
  );

  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + (i.quantity || 0), 0),
    [items]
  );

  const totalAmount = useMemo(
    () => items.reduce((acc, i) => acc + asNumber(i.precio) * (i.quantity || 0), 0),
    [items]
  );

  // ✅ valor memoizado para evitar renders en cascada
  const value = useMemo(
    () => ({
      items,
      loadingCart,
      fetchCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
    }),
    [
      items,
      loadingCart,
      fetchCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de un CartProvider");
  return ctx;
}

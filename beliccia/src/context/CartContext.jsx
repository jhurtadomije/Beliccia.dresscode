// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Creamos el contexto
const CartContext = createContext();

// Provider que envolverá nuestra app
export function CartProvider({ children }) {
  // Carga inicial desde localStorage
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Guarda en localStorage cada vez que cambia el carrito
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Añadir producto (o incrementar cantidad)
  function addToCart(product) {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  // Eliminar producto por id
  function removeFromCart(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  // Actualizar cantidad manualmente
  function updateQuantity(id, quantity) {
    setItems(prev =>
      prev.map(i =>
        i.id === id
          ? { ...i, quantity: Math.max(1, quantity) }
          : i
      )
    );
  }

  // Vaciar carrito
  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook para usar el contexto
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}

// src/pages/Carrito.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { IMAGE_BASE } from '../services/api';

export default function Carrito() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const total = items.reduce((sum, p) => sum + p.precio * p.quantity, 0);

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Tu Carrito</h2>
        {items.length === 0 ? (
          <p className="text-center">El carrito está vacío.</p>
        ) : (
          <>
            {items.map(p => (
              <div key={p.id} className="d-flex align-items-center mb-3">
                <img
                  src={`${IMAGE_BASE}/${p.imagenes[0].replace(/^\/?imagenes\//, '')}`}
                  alt={p.nombre}
                  style={{ width: '60px', marginRight: '1rem' }}
                />

                <div className="flex-grow-1">
                  <h5>{p.nombre}</h5>
                  <p>
                    €{p.precio} ×{' '}
                    <input
                      type="number"
                      value={p.quantity}
                      min="1"
                      onChange={e => updateQuantity(p.id, +e.target.value)}
                      style={{ width: '4rem', marginLeft: '0.5rem' }}
                    />
                  </p>
                </div>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => removeFromCart(p.id)}
                >
                  Eliminar
                </button>
              </div>
            ))}
            <h4 className="text-end">Total: €{total.toFixed(2)}</h4>
            <div className="text-end">
              <button className="btn btn-secondary me-2" onClick={clearCart}>
                Vaciar Carrito
              </button>
              <button
                className="btn btn-primary"
                onClick={() => alert('Checkout no implementado')}
              >
                Finalizar Compra
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

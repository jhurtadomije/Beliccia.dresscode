// src/pages/Carrito.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { resolveImageUrl } from '../services/imageUrl';

const PLACEHOLDER = '/placeholder.png';

export default function Carrito() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();

  const money = (n) =>
    new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })
      .format(Number(n || 0));

  const getId = (p) => p?.id ?? p?.sku ?? p?._id ?? p?.slug ?? p?.nombre;

  const total = items.reduce(
    (sum, p) => sum + Number(p.precio || 0) * Number(p.quantity || 1),
    0
  );

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Tu Carrito</h2>

        {items.length === 0 ? (
          <p className="text-center">El carrito está vacío.</p>
        ) : (
          <>
            {items.map((p) => {
              const id = getId(p);
              const firstImage =
                (Array.isArray(p?.imagenes) && p.imagenes[0]) ||
                p?.imagen ||
                '';
              const imgUrl = resolveImageUrl(firstImage) || PLACEHOLDER;

              return (
                <div
                  key={id}
                  className="d-flex align-items-center mb-3 p-2 border rounded"
                >
                  <img
                    src={imgUrl}
                    alt={p?.nombre || 'Producto'}
                    style={{
                      width: 70,
                      height: 90,
                      objectFit: 'cover',
                      borderRadius: 8,
                      marginRight: '1rem',
                    }}
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />

                  <div className="flex-grow-1">
                    <h5 className="mb-1">{p?.nombre || 'Producto'}</h5>
                    <div className="d-flex align-items-center">
                      <span className="me-2">{money(p?.precio)}</span>
                      <label className="me-2 mb-0" htmlFor={`qty-${id}`}>
                        ×
                      </label>
                      <input
                        id={`qty-${id}`}
                        type="number"
                        min={1}
                        step={1}
                        value={Number(p.quantity || 1)}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value || 1));
                          updateQuantity(id, val);
                        }}
                        onBlur={(e) => {
                          if (!e.target.value || Number(e.target.value) < 1) {
                            updateQuantity(id, 1);
                          }
                        }}
                        style={{ width: '4.5rem' }}
                        className="form-control form-control-sm"
                      />
                    </div>
                  </div>

                  <div className="text-end me-3 fw-semibold">
                    {money(Number(p?.precio || 0) * Number(p?.quantity || 1))}
                  </div>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeFromCart(id)}
                  >
                    Eliminar
                  </button>
                </div>
              );
            })}

            <hr />
            <div className="d-flex justify-content-end align-items-baseline">
              <h4 className="mb-0 me-3">Total:</h4>
              <h4 className="mb-0">{money(total)}</h4>
            </div>

            <div className="text-end mt-3">
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

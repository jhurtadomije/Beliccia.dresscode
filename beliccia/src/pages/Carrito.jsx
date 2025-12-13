// src/pages/Carrito.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../services/imageUrl";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePageMeta } from "../hooks/usePageMeta";

const PLACEHOLDER = "/placeholder.png";

const money = (n) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(Number(n || 0));

const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export default function Carrito() {
  const { items, removeFromCart, updateQuantity, clearCart, totalAmount } =
    useCart();

  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const handleCheckout = () => {
    if (!items.length) return;
    if (!isLoggedIn) {
      navigate("/checkout/auth");
      return;
    }
    navigate("/checkout");
  };

  usePageMeta({
    title: "Carrito | Beliccia",
    description:
      "Revisa tu carrito, ajusta cantidades y finaliza tu compra en Beliccia Dress Code.",
  });

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Tu Carrito</h2>

        {items.length === 0 ? (
          <p className="text-center">El carrito está vacío.</p>
        ) : (
          <>
            {items.map((p) => {
              // id ya viene normalizado desde CartContext (slug o id)
              const id = p.id;

              const firstImage =
                (Array.isArray(p?.imagenes) && p.imagenes[0]) ||
                p?.imagen_portada ||
                p?.imagen ||
                "";

              const imgUrl = resolveImageUrl(firstImage) || PLACEHOLDER;

              // precio normalizado: en el contexto guardamos `precio`,
              // pero por si acaso, caemos en `precio_base`
              const unitPrice = asNumber(p?.precio ?? p?.precio_base);
              const qty = Number(p.quantity || 1);

              return (
                <div
                  key={id}
                  className="d-flex align-items-center mb-3 p-2 border rounded"
                >
                  <img
                    src={imgUrl}
                    alt={p?.nombre || "Producto"}
                    style={{
                      width: 70,
                      height: 90,
                      objectFit: "cover",
                      borderRadius: 8,
                      marginRight: "1rem",
                    }}
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />

                  <div className="flex-grow-1">
                    <h5 className="mb-1">{p?.nombre || "Producto"}</h5>

                    {/* Si quieres mostrar talla / variante */}
                    {p?.talla && (
                      <p className="text-muted mb-1 small">Talla: {p.talla}</p>
                    )}

                    <div className="d-flex align-items-center">
                      <span className="me-2">{money(unitPrice)}</span>
                      <label className="me-2 mb-0" htmlFor={`qty-${id}`}>
                        ×
                      </label>
                      <input
                        id={`qty-${id}`}
                        type="number"
                        min={1}
                        step={1}
                        value={qty}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value || 1));
                          updateQuantity(id, val);
                        }}
                        onBlur={(e) => {
                          if (!e.target.value || Number(e.target.value) < 1) {
                            updateQuantity(id, 1);
                          }
                        }}
                        style={{ width: "4.5rem" }}
                        className="form-control form-control-sm"
                      />
                    </div>
                  </div>

                  <div className="text-end me-3 fw-semibold">
                    {money(unitPrice * qty)}
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
              <h4 className="mb-0">{money(totalAmount)}</h4>
            </div>

            <div className="text-end mt-3">
              <button className="btn btn-secondary me-2" onClick={clearCart}>
                Vaciar Carrito
              </button>
              <button className="btn btn-primary" onClick={handleCheckout}>
                Finalizar Compra
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

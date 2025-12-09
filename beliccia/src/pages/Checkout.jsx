// src/pages/Checkout.jsx
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { resolveImageUrl } from "../services/imageUrl";

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

export default function Checkout() {
  const { items, totalAmount } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    empresa: "",
    pais: "España",
    direccion1: "",
    direccion2: "",
    cp: "",
    poblacion: "",
    provincia: "",
    telefono: "",
    email: "",
    notas: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      nombre: prev.nombre || user.nombre || "",
      apellidos: prev.apellidos || user.apellidos || "",
      email: prev.email || user.email || "",
      telefono: prev.telefono || user.telefono || "",
    }));
  }, [user]);

  const subtotal = useMemo(() => asNumber(totalAmount), [totalAmount]);
  const shipping = 0;
  const total = subtotal + shipping;

  if (!items.length) {
    return (
      <section className="py-5 text-center">
        <div className="container">
          <h3>Tu carrito está vacío</h3>
        </div>
      </section>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const required = [
      ["nombre", "Nombre"],
      ["apellidos", "Apellidos"],
      ["direccion1", "Dirección"],
      ["cp", "Código postal"],
      ["poblacion", "Población"],
      ["provincia", "Provincia"],
      ["pais", "País"],
      ["telefono", "Teléfono"],
      ["email", "Email"],
    ];

    const missing = required.filter(([k]) => !String(form[k] || "").trim());
    if (missing.length) {
      return `Faltan campos obligatorios: ${missing.map((m) => m[1]).join(", ")}`;
    }

    return null;
  };

  const handleConfirm = async () => {
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }

    setLoading(true);
    setErr(null);

    try {
      const envio = {
        nombre: `${form.nombre} ${form.apellidos}`.trim(),
        direccion: form.direccion1,
        ciudad: form.poblacion,
        provincia: form.provincia,
        cp: form.cp,
        pais: form.pais || "España",
        telefono: form.telefono,
        // email NO es requerido por backend; puedes dejarlo fuera
      };

      // De momento Stripe Checkout = card.
      // Dejamos Bizum solo como UI futura.
      const { data } = await api.post("/pagos/iniciar", {
        envio,
        notas_cliente: form.notas || null,
      });

      if (!data?.checkoutUrl) {
        throw new Error("No se recibió checkoutUrl del servidor.");
      }

      window.location.href = data.checkoutUrl;
    } catch (e) {
      console.error(e);
      setErr(
        e.response?.data?.message ||
          e.message ||
          "No se pudo iniciar el pago. Revisa el carrito y vuelve a intentarlo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="mb-4">Checkout</h2>

        {err && <div className="alert alert-danger">{err}</div>}

        <div className="row g-5">
          {/* IZQUIERDA */}
          <div className="col-12 col-lg-7">
            <h5 className="mb-3">Detalles de facturación</h5>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Nombre *</label>
                <input
                  className="form-control"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Apellidos *</label>
                <input
                  className="form-control"
                  name="apellidos"
                  value={form.apellidos}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">
                  Nombre de la empresa (opcional)
                </label>
                <input
                  className="form-control"
                  name="empresa"
                  value={form.empresa}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label">País / Región *</label>
                <select
                  className="form-select"
                  name="pais"
                  value={form.pais}
                  onChange={handleChange}
                >
                  <option>España</option>
                  <option>Portugal</option>
                  <option>Francia</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Dirección de la calle *</label>
                <input
                  className="form-control mb-2"
                  name="direccion1"
                  placeholder="Nombre de la calle y número"
                  value={form.direccion1}
                  onChange={handleChange}
                  required
                />
                <input
                  className="form-control"
                  name="direccion2"
                  placeholder="Apartamento, habitación, etc. (opcional)"
                  value={form.direccion2}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Código postal / ZIP *</label>
                <input
                  className="form-control"
                  name="cp"
                  value={form.cp}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Población *</label>
                <input
                  className="form-control"
                  name="poblacion"
                  value={form.poblacion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Provincia *</label>
                <select
                  className="form-select"
                  name="provincia"
                  value={form.provincia}
                  onChange={handleChange}
                  required
                >
                  <option value="">Elige una opción…</option>
                  <option>Granada</option>
                  <option>Málaga</option>
                  <option>Sevilla</option>
                  <option>Madrid</option>
                  <option>Barcelona</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Teléfono *</label>
                <input
                  className="form-control"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 mt-3">
                <label className="form-label">
                  Notas del pedido (opcional)
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  name="notas"
                  placeholder="Indicaciones especiales, horario de entrega, etc."
                  value={form.notas}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* DERECHA */}
          <div className="col-12 col-lg-5">
            <h5 className="mb-3">Tu pedido</h5>

            <div className="border rounded">
              <div className="p-3">
                {items.map((i) => {
                  const firstImage =
                    (Array.isArray(i?.imagenes) && i.imagenes[0]) ||
                    i?.imagen_portada ||
                    i?.imagen ||
                    "";

                  const imgUrl = resolveImageUrl(firstImage) || PLACEHOLDER;

                  const unitPrice = asNumber(i?.precio ?? i?.precio_base);
                  const qty = Number(i?.quantity || 1);
                  const lineTotal = unitPrice * qty;

                  return (
                    <div
                      key={i.id}
                      className="d-flex justify-content-between align-items-start py-2 border-bottom"
                    >
                      <div className="d-flex">
                        <img
                          src={imgUrl}
                          alt={i?.nombre || "Producto"}
                          width={58}
                          height={72}
                          style={{
                            objectFit: "cover",
                            borderRadius: 6,
                            marginRight: 10,
                          }}
                          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                        />
                        <div>
                          <div className="fw-semibold">
                            {i?.nombre || "Producto"}
                            {i?.talla ? ` - ${i.talla}` : ""}
                          </div>
                          <span className="badge bg-dark rounded-pill">
                            x{qty}
                          </span>
                        </div>
                      </div>

                      <div className="text-end ms-2" style={{ minWidth: 90 }}>
                        {money(lineTotal)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <strong>{money(subtotal)}</strong>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Envío</span>
                  <span className="text-muted small">
                    {shipping === 0
                      ? "Introduce tu dirección para ver opciones de envío."
                      : money(shipping)}
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">Total</span>
                  <span className="fw-bold">{money(total)}</span>
                </div>
              </div>
            </div>

            {/* MÉTODO DE PAGO */}
            <div className="border rounded mt-4 p-3">
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  id="pay-card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <label className="form-check-label fw-semibold" htmlFor="pay-card">
                  Tarjeta de crédito / débito
                </label>
                <div className="text-muted small mt-1">
                  Pago seguro con Stripe Checkout.
                </div>
              </div>

              <hr />

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  id="pay-bizum"
                  checked={paymentMethod === "bizum"}
                  onChange={() => setPaymentMethod("bizum")}
                />
                <label className="form-check-label fw-semibold" htmlFor="pay-bizum">
                  Bizum
                </label>
                <div className="text-muted small mt-1">
                  Próximamente.
                </div>
              </div>
            </div>

            <button
              className="btn btn-dark w-100 mt-4"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Redirigiendo al pago..." : "Pagar y confirmar"}
            </button>

            <p className="text-muted small mt-2">
              Tus datos personales se utilizarán para procesar tu pedido y
              mejorar tu experiencia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

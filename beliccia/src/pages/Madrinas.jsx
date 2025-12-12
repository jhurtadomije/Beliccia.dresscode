// src/pages/Madrinas.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { resolveImageUrl } from "../services/imageUrl";

const PLACEHOLDER = "/placeholder.png";

const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// Normaliza flags tinyint(1) / string / boolean
const isFlagTrue = (v) => v === 1 || v === "1" || v === true;

// Priorizamos slug como identificador para la ruta de detalle
const getId = (p) => p?.slug ?? p?.id ?? p?.nombre;

// --------- helpers de tags_origen ---------

const deaccent = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const norm = (s) => deaccent(String(s || "").toLowerCase().trim());

const getTags = (producto) => {
  const raw = norm(producto?.tags_origen);
  if (!raw) return [];
  return raw.split(/[,\s]+/).filter(Boolean);
};

const hasAnyTag = (producto, expected) => {
  const tags = getTags(producto);
  if (!tags.length) return false;
  return tags.some((t) => expected.includes(t));
};

// Madrina = producto de categoría "fiesta" (o similar) + tag "madrina"
const isMadrina = (p) => {
  const cat = norm(p?.categoria); // "Fiesta", "Novias", etc.
  const esFiesta = cat.includes("fiesta");
  const esMadrinaPorTag = hasAnyTag(p, ["madrina", "madrinas"]);
  return esFiesta && esMadrinaPorTag;
};

// ---------- Card de madrina ----------

function MadrinaCard({ producto, onPedirCita }) {
  const [flipped, setFlipped] = useState(false);
  const { addToCart } = useCart();
  const location = useLocation();
  const from = location.pathname + location.search;

  const nombre = producto?.nombre || "Producto";
  const id = getId(producto);

  const firstImage = useMemo(() => {
    if (producto?.imagen_portada) return producto.imagen_portada;
    if (producto?.imagen) return producto.imagen;
    return "";
  }, [producto]);

  const imageUrl = resolveImageUrl(firstImage) || PLACEHOLDER;

  const descripcion =
    producto?.descripcion_larga ||
    producto?.descripcion_corta ||
    producto?.descripcion ||
    "";

  const price = asNumber(producto?.precio_base);
  const isOnline = isFlagTrue(producto?.venta_online);
  const isVisible = isFlagTrue(producto?.visible_web);

  // Si por lo que sea llega no visible, no lo mostramos
  if (!isVisible) return null;

  const canBuy = isOnline && price !== null;
  const showPrice = isOnline && price !== null;

  return (
    <div className="card-flip-container h-100">
      <div className={`card card-flip ${flipped ? "flipped" : ""} shadow`}>
        {/* Cara frontal */}
        <div className="card-face card-front">
          <img
            src={imageUrl}
            className="card-img-top"
            alt={nombre}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER;
            }}
            style={{ objectFit: "contain", aspectRatio: "3 / 4" }}
          />
          <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
            <h5 className="card-title">{nombre}</h5>

            {showPrice && <p className="card-text mb-0">€{price.toFixed(2)}</p>}

            {!isOnline && (
              <p className="card-text mb-0 text-muted small">
                Solo disponible en tienda física.
              </p>
            )}

            <button
              className="btn btn-outline-dark mt-4 mb-3"
              onClick={() => setFlipped(true)}
              aria-label={`Ver detalles de ${nombre}`}
            >
              Ver detalles
            </button>
          </div>
        </div>

        {/* Cara trasera */}
        <div className="card-face card-back">
          <div className="card-body text-center d-flex flex-column justify-content-between align-items-center">
            <h5 className="card-title">{nombre}</h5>
            {!!descripcion && <p className="card-text mb-3">{descripcion}</p>}

            {showPrice ? (
              <p className="fw-bold">Precio: €{price.toFixed(2)}</p>
            ) : isOnline ? (
              <p className="text-muted small mb-2">
                Consultar precio y disponibilidad.
              </p>
            ) : (
              <p className="text-muted small mb-2">
                Solo disponible en tienda física. Solicita cita para probártelo.
              </p>
            )}

            {canBuy ? (
              <button
                className="btn btn-success mb-2 w-100"
                onClick={() => addToCart({ producto_id: producto.id })}
              >
                Añadir al carrito
              </button>
            ) : (
              <button
                className="btn btn-primary mb-2 w-100"
                onClick={onPedirCita}
              >
                Solicitar información / cita
              </button>
            )}

            <Link
              to={`/producto/${encodeURIComponent(id)}`}
              state={{ from }}
              className="btn btn-dark mb-2 w-100"
            >
              Ver más
            </Link>

            <button
              className="btn btn-secondary mt-2"
              onClick={() => setFlipped(false)}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Página de Madrinas ----------

export default function Madrinas() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // estado de envío / mensajes (igual que Novias)
  const [sendingCita, setSendingCita] = useState(false);
  const [citaMsg, setCitaMsg] = useState(null);

  useEffect(() => {
    let alive = true;
    setCargando(true);
    setError(null);

    api
      .get("/productos", {
        params: {
          categoria: "fiesta", // slug de categoría en tu BBDD (Fiesta)
          page: 1,
          limit: 100,
        },
      })
      .then(({ data }) => {
        const arr = Array.isArray(data?.data) ? data.data : [];

        // Solo madrinas y visibles en web
        let madrinas = arr.filter(isMadrina);
        madrinas = madrinas.filter((p) => isFlagTrue(p.visible_web));

        if (alive) setProductos(madrinas);
      })
      .catch((err) => {
        console.error(err);
        if (alive) setError("No se pudieron cargar los vestidos de madrina.");
      })
      .finally(() => {
        if (alive) setCargando(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  if (cargando)
    return <section className="py-5 text-center">Cargando madrinas…</section>;

  if (error)
    return (
      <section className="py-5 text-center text-danger">{error}</section>
    );

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Colección Madrinas</h2>
        <div className="row g-4">
          {productos.length === 0 ? (
            <div className="col-12 text-center text-muted">
              No hay productos disponibles.
            </div>
          ) : (
            productos.map((p) => (
              <div className="col-12 col-sm-6 col-md-4" key={getId(p)}>
                <MadrinaCard
                  producto={p}
                  onPedirCita={() => {
                    setCitaMsg(null);
                    setSendingCita(false);
                    setProductoSeleccionado(p);
                    setShowModal(true);
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de contacto/solicitud */}
      {showModal && productoSeleccionado && (
        <div
          className="custom-modal-backdrop"
          onClick={() => {
            setShowModal(false);
            setCitaMsg(null);
            setSendingCita(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Solicitar información de ${
            productoSeleccionado?.nombre || "producto"
          }`}
        >
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn-close"
              onClick={() => {
                setShowModal(false);
                setCitaMsg(null);
                setSendingCita(false);
              }}
              aria-label="Cerrar"
            >
              &times;
            </button>

            <h5 className="mb-3">
              {productoSeleccionado?.nombre || "Producto"}
            </h5>

            <div className="modal-gallery mb-3 d-flex align-items-center">
              {[
                resolveImageUrl(
                  productoSeleccionado?.imagen_portada ||
                    productoSeleccionado?.imagen ||
                    PLACEHOLDER
                ),
              ].map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt={`${
                    productoSeleccionado?.nombre || "Producto"
                  } - foto ${i + 1}`}
                  className="modal-image"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER;
                  }}
                  style={{
                    maxWidth: 90,
                    maxHeight: 90,
                    marginRight: 8,
                    borderRadius: 8,
                    objectFit: "cover",
                    border: "1px solid #eee",
                  }}
                />
              ))}
            </div>

            <form
              className="mt-2"
              onSubmit={async (e) => {
                e.preventDefault();

                const formEl = e.currentTarget;
                setCitaMsg(null);
                setSendingCita(true);

                const form = new FormData(formEl);

                const payload = {
                  nombre: String(form.get("name") || "").trim(),
                  email: String(form.get("email") || "").trim(),
                  telefono: String(form.get("telefono") || "").trim() || null,
                  tipo: "info",
                  mensaje: String(form.get("message") || "").trim(),
                  producto_id: productoSeleccionado?.id ?? null,
                  categoria_id: productoSeleccionado?.categoria_id ?? null,
                };

                try {
                  await api.post("/citas", payload);

                  setCitaMsg({
                    type: "ok",
                    text: "✅ ¡Listo! Hemos recibido tu solicitud.",
                  });

                  formEl.reset();

                  setTimeout(() => setShowModal(false), 800);
                } catch (err) {
                  console.error(err);

                  const backendMsg =
                    err?.response?.data?.error ||
                    err?.response?.data?.message ||
                    "No se pudo enviar la solicitud. Inténtalo de nuevo.";

                  setCitaMsg({ type: "err", text: `❌ ${backendMsg}` });
                } finally {
                  setSendingCita(false);
                }
              }}
            >
              <input
                name="name"
                autoComplete="name"
                className="form-control mb-2"
                placeholder="Nombre"
                required
              />
              <input
                name="email"
                autoComplete="email"
                className="form-control mb-2"
                placeholder="Correo electrónico"
                type="email"
                required
              />
              <input
                name="telefono"
                autoComplete="tel"
                className="form-control mb-2"
                placeholder="Teléfono (opcional)"
              />
              <textarea
                name="message"
                autoComplete="off"
                className="form-control mb-2"
                placeholder="Mensaje"
                required
              />

              {citaMsg && (
                <div
                  className={`alert ${
                    citaMsg.type === "ok" ? "alert-success" : "alert-danger"
                  } py-2`}
                  role="alert"
                >
                  {citaMsg.text}
                </div>
              )}

              <button
                className="btn btn-success w-100"
                type="submit"
                disabled={sendingCita}
              >
                {sendingCita ? "Enviando..." : "Enviar solicitud"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

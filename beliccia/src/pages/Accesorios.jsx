// src/pages/Accesorios.jsx
import { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { resolveImageUrl } from "../services/imageUrl";

const PLACEHOLDER = "/placeholder.png";
const PRICE_LIMIT = 2500;

// ---------- helpers comunes ----------

const getId = (p) => p?.slug ?? p?.id ?? p?.nombre;

const money = (n) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(Number(n || 0));

const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const deaccent = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const norm = (s) => deaccent(String(s || "").toLowerCase().trim());

/**
 * Clasificamos complementos en:
 *  - "bolsos"
 *  - "tocados"
 *  - "otros"
 * usando nombre + tags_origen
 */
function getAccesorioGroup(producto) {
  const texto = norm(
    `${producto?.nombre || ""} ${producto?.tags_origen || ""}`
  );

  const esBolso =
    /\b(bolso|bolsos|clutch|bombonera|cartera|bandolera|bolsa|bolsas)\b/.test(
      texto
    );

  const esTocado =
    /\b(tocado|tocados|diadema|diademas|pamela|canotier|corona|coronas|tiara|tiaras|peineta|peinetas)\b/.test(
      texto
    );

  if (esBolso) return "bolsos";
  if (esTocado) return "tocados";
  return "otros";
}

// ---------- Card ----------

function AccesorioCard({ producto, onSolicitarInfo }) {
  const [flipped, setFlipped] = useState(false);
  const { addToCart } = useCart();
  const location = useLocation();
  const from = location.pathname + location.search;

  const id = getId(producto);
  const nombre = producto?.nombre || "Accesorio";

  const firstImage =
    producto?.imagen_portada ||
    producto?.imagen ||
    (Array.isArray(producto?.imagenes) && producto.imagenes[0]) ||
    "";
  const imageUrl = resolveImageUrl(firstImage) || PLACEHOLDER;

  const price = asNumber(producto?.precio_base);
  const canBuy = price !== null && price <= PRICE_LIMIT;
  const showPrice = price !== null && price <= PRICE_LIMIT;

  const descripcion =
    producto?.descripcion_larga ||
    producto?.descripcion_corta ||
    producto?.descripcion ||
    "";

  return (
    <div className="card-flip-container h-100">
      <div className={`card card-flip ${flipped ? "flipped" : ""} shadow`}>
        {/* Front */}
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
            {showPrice && <p className="card-text">{money(price)}</p>}
            <button
              className="btn btn-outline-dark mt-3"
              onClick={() => setFlipped(true)}
            >
              Ver detalles
            </button>
          </div>
        </div>

        {/* Back */}
        <div className="card-face card-back">
          <div className="card-body text-center d-flex flex-column justify-content-between align-items-center">
            <h5 className="card-title">{nombre}</h5>
            {!!descripcion && (
              <p className="card-text mb-3">{descripcion}</p>
            )}
            {showPrice && (
              <p className="fw-bold mb-3">{money(price)}</p>
            )}

            {canBuy ? (
              <button
                className="btn btn-success mb-2 w-100"
                onClick={() =>
                  addToCart({
                    ...producto,
                    precio: price ?? 0,
                  })
                }
              >
                Añadir al carrito
              </button>
            ) : (
              <button
                className="btn btn-primary mb-2 w-100"
                onClick={() => onSolicitarInfo(producto)}
              >
                Solicitar información
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

// ---------- Página Accesorios ----------

export default function Accesorios() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const location = useLocation();
  // Rutas esperadas: "/accesorios", "/tocados", "/bolsos", "/otros"
  const segmento = location.pathname.split("/")[1] || "";

  const filtroCat = ["tocados", "bolsos", "otros"].includes(segmento)
    ? segmento
    : null;

  const abrirModal = useCallback((p) => {
    setProductoSeleccionado(p);
    setShowModal(true);
  }, []);

  useEffect(() => {
    let alive = true;
    setCargando(true);
    setError(null);

    // Siempre tiramos de categoría "complementos" en la API,
    // y aquí en el front los separamos en bolsos/tocados/otros
    api
      .get("/productos", {
        params: {
          categoria: "complementos",
          page: 1,
          limit: 200,
        },
      })
      .then(({ data }) => {
        const arr = Array.isArray(data?.data) ? data.data : [];

        let accesorios = arr.map((p) => ({
          ...p,
          _grupoAccesorio: getAccesorioGroup(p),
        }));

        if (filtroCat) {
          accesorios = accesorios.filter(
            (p) => p._grupoAccesorio === filtroCat
          );
        }

        if (alive) setProductos(accesorios);
      })
      .catch((err) => {
        console.error(err);
        if (alive)
          setError("No se pudieron cargar los accesorios.");
      })
      .finally(() => {
        if (alive) setCargando(false);
      });

    return () => {
      alive = false;
    };
  }, [filtroCat]);

  if (cargando)
    return (
      <section className="py-5 text-center">
        Cargando accesorios…
      </section>
    );
  if (error)
    return (
      <section className="py-5 text-center text-danger">{error}</section>
    );

  const titulo =
    filtroCat === "bolsos"
      ? "Bolsos"
      : filtroCat === "tocados"
      ? "Tocados"
      : filtroCat === "otros"
      ? "Otros complementos"
      : "Todos los Accesorios";

  return (
    <section
      className="py-5"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="container">
        <h2 className="text-center mb-4">{titulo}</h2>

        <div className="row g-4">
          {productos.length === 0 ? (
            <div className="col-12 text-center text-muted">
              No hay accesorios disponibles.
            </div>
          ) : (
            productos.map((p) => (
              <div className="col-12 col-sm-6 col-md-4" key={getId(p)}>
                <AccesorioCard
                  producto={p}
                  onSolicitarInfo={abrirModal}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de contacto (Solicitar información) */}
      {showModal && productoSeleccionado && (
        <div
          className="custom-modal-backdrop"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Solicitar información de ${
            productoSeleccionado?.nombre || "producto"
          }`}
        >
          <div
            className="custom-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn-close"
              onClick={() => setShowModal(false)}
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
              onSubmit={(e) => {
                e.preventDefault();
                alert("¡Gracias! Te contactaremos.");
                setShowModal(false);
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
              <textarea
                name="message"
                autoComplete="off"
                className="form-control mb-2"
                placeholder="Mensaje"
                required
              />
              <button
                className="btn btn-success w-100"
                type="submit"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

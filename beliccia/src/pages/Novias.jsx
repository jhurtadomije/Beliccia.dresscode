// src/pages/Novias.jsx
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../services/imageUrl";

const PLACEHOLDER = "/placeholder.png";
const BUY_LIMIT = 3500;

// Convierte valor a número o null
const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// Priorizamos el slug como identificador para la ruta de detalle
const getId = (p) => p?.slug ?? p?.id ?? p?.nombre;

// Filtro por estilo usando tags_origen
// En BBDD: tags_origen podría contener cosas tipo "corte-recto, sirena, ...".
const matchEstilo = (producto, corteSlug) => {
  if (!corteSlug) return true; // sin filtro, pasa todo

  const tags = (producto?.tags_origen || "").toLowerCase();
  return tags.includes(corteSlug.toLowerCase());
};

// ---------- Card de producto de novia ----------

function NoviaCard({ producto, onSolicitarInfo }) {
  const [flipped, setFlipped] = useState(false);
  const { addToCart } = useCart();
  const location = useLocation();
  const from = location.pathname + location.search;

  const id = getId(producto);
  const nombre = producto?.nombre || "Vestido de novia";

  // Imagen principal: usamos imagen_portada que devuelve la API
  const firstImage = useMemo(() => {
    if (producto?.imagen_portada) return producto.imagen_portada;
    if (producto?.imagen) return producto.imagen;
    return "";
  }, [producto]);

  const imageUrl = resolveImageUrl(firstImage) || PLACEHOLDER;

  const price = asNumber(producto?.precio_base);
  const canBuy = price !== null && price <= BUY_LIMIT;
  const showPrice = price !== null && price <= BUY_LIMIT;

  const descripcion =
    producto?.descripcion_larga ||
    producto?.descripcion_corta ||
    producto?.descripcion ||
    "";

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
            style={{ objectFit: "cover", aspectRatio: "3 / 4" }}
          />
          <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
            <h5 className="card-title">{nombre}</h5>
            {showPrice && (
              <p className="card-text mb-0">€{price.toFixed(2)}</p>
            )}
            <button
              className="btn btn-outline-dark mt-4 mb-3"
              aria-label={`Ver detalles de ${nombre}`}
              onClick={() => setFlipped(true)}
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
            ) : (
              <p className="text-muted mb-2">
                Consulta disponibilidad y condiciones.
              </p>
            )}

            {canBuy ? (
              <button
                className="btn btn-success mb-2 w-100"
                onClick={() => addToCart({ producto_id: producto.id})}
              >
                Añadir al carrito
              </button>
            ) : (
              <button
                className="btn btn-primary mb-2 w-100"
                onClick={onSolicitarInfo}
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

// ---------- Página de Novias ----------

export default function Novias() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [searchParams] = useSearchParams();
  const corteSlug = searchParams.get("corte"); // "a", "recto", "sirena", "princesa"

  const corteLabel =
    {
      a: "Corte A",
      recto: "Corte recto",
      sirena: "Corte sirena",
      princesa: "Corte princesa",
    }[corteSlug] || null;

  // Cargar productos de la API propia (categoría Novias)
  useEffect(() => {
    setCargando(true);
    setError(null);

    api
      .get("/productos", {
        params: {
          categoria: "novias", // slug de categoría en tu BBDD
          page: 1,
          limit: 100,
        },
      })
      .then((response) => {
        const payload = response.data;
        const arr = Array.isArray(payload?.data) ? payload.data : [];

        let novias = arr;

        // Filtro opcional por estilo usando tags_origen
        if (corteSlug) {
          novias = novias.filter((p) => matchEstilo(p, corteSlug));
        }

        setProductos(novias || []);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudieron cargar los vestidos de novia.");
      })
      .finally(() => setCargando(false));
  }, [corteSlug]);

  // Scroll arriba al cambiar filtro
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [corteSlug]);

  if (cargando)
    return (
      <section className="py-5 text-center">
        Cargando vestidos de novia…
      </section>
    );

  if (error)
    return (
      <section className="py-5 text-center text-danger">{error}</section>
    );

  return (
    <section
      className="py-5"
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="container">
        <h2 className="text-center mb-4">Colección de Novias</h2>

        {corteLabel && (
          <p className="text-center fst-italic">
            Filtrando por estilo: <strong>{corteLabel}</strong>
          </p>
        )}

        <div className="row g-4">
          {productos.length === 0 ? (
            <div className="col-12 text-center text-muted">
              No hay vestidos disponibles.
            </div>
          ) : (
            productos.map((p) => (
              <div
                className="col-12 col-sm-6 col-md-4"
                key={getId(p)}
              >
                <NoviaCard
                  producto={p}
                  onSolicitarInfo={() => {
                    setProductoSeleccionado(p);
                    setShowModal(true);
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de contacto */}
      {showModal && productoSeleccionado && (
        <div
          className="custom-modal-backdrop"
          onClick={() => setShowModal(false)}
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
              className="mt-2"
              onSubmit={(e) => {
                e.preventDefault();
                alert("¡Gracias! Te contactaremos pronto.");
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
                placeholder="Mensaje o consulta"
                required
              />
              <button className="btn btn-success w-100" type="submit">
                Enviar solicitud de información
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

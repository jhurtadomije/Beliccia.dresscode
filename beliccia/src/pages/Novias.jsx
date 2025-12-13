// src/pages/Novias.jsx
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../services/imageUrl";
import { usePageMeta } from "../hooks/usePageMeta";
import CitaModal from "../components/CitaModal";

const PLACEHOLDER = "/placeholder.png";

// Convierte valor a número o null
const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// Normaliza flags tinyint(1) / string / boolean
const isFlagTrue = (v) => v === 1 || v === "1" || v === true;

// Priorizamos el slug como identificador para la ruta de detalle
const getId = (p) => p?.slug ?? p?.id ?? p?.nombre;

// Filtro por estilo usando tags_origen
const matchEstilo = (producto, corteSlug) => {
  if (!corteSlug) return true;
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

  const firstImage = useMemo(() => {
    if (producto?.imagen_portada) return producto.imagen_portada;
    if (producto?.imagen) return producto.imagen;
    return "";
  }, [producto]);

  const imageUrl = resolveImageUrl(firstImage) || PLACEHOLDER;

  const price = asNumber(producto?.precio_base);
  const isOnline = isFlagTrue(producto?.venta_online);
  const isVisible = isFlagTrue(producto?.visible_web);

  if (!isVisible) return null;

  const canBuy = isOnline && price !== null;
  const showPrice = isOnline && price !== null;

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

            {showPrice && <p className="card-text mb-0">€{price.toFixed(2)}</p>}

            {!isOnline && (
              <p className="card-text mb-0 text-muted small">
                Solo disponible en tienda física.
              </p>
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
            ) : isOnline ? (
              <p className="text-muted mb-2">Consultar precio y disponibilidad.</p>
            ) : (
              <p className="text-muted mb-2">
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
                onClick={onSolicitarInfo}
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

// ---------- Página de Novias ----------
export default function Novias() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [searchParams] = useSearchParams();
  const corteSlug = searchParams.get("corte");

  const corteLabel =
    {
      a: "Corte A",
      recto: "Corte recto",
      sirena: "Corte sirena",
      princesa: "Corte princesa",
    }[corteSlug] || null;

  usePageMeta({
    title: corteLabel ? `Novias (${corteLabel}) | Beliccia` : "Novias | Beliccia",
    description:
      "Colección de vestidos de novia. Descubre estilos y solicita información o cita.",
  });

  useEffect(() => {
    setCargando(true);
    setError(null);

    api
      .get("/productos", {
        params: {
          categoria: "novias",
          page: 1,
          limit: 100,
        },
      })
      .then((response) => {
        const payload = response.data;
        const arr = Array.isArray(payload?.data) ? payload.data : [];

        let novias = arr.filter((p) => isFlagTrue(p.visible_web));

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [corteSlug]);

  if (cargando)
    return (
      <section className="py-5 text-center">Cargando vestidos de novia…</section>
    );

  if (error)
    return <section className="py-5 text-center text-danger">{error}</section>;

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
              <div className="col-12 col-sm-6 col-md-4" key={getId(p)}>
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

      {/* ✅ Modal reutilizado */}
      <CitaModal
        open={showModal}
        producto={productoSeleccionado}
        onClose={() => setShowModal(false)}
      />
    </section>
  );
}

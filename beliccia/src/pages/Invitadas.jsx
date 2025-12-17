// src/pages/Invitadas.jsx
import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../services/imageUrl";
import { usePageMeta } from "../hooks/usePageMeta";
import CitaModal from "../components/CitaModal";
import { flyToCartFromEl } from "../utils/cartFly";

const PLACEHOLDER = "/placeholder.png";

// Convierte valor a número o null
const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// Normaliza flags tinyint(1) / string / boolean
const isFlagTrue = (v) => v === 1 || v === "1" || v === true;

// Priorizamos slug para que el detalle vaya por /producto/:slug
const getId = (p) => p?.slug ?? p?.id ?? p?.nombre;

// ---------- helpers con tags_origen ----------
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

// Invitada = categoría fiesta + tag invitada
const isInvitada = (p) => {
  const cat = norm(p?.categoria);

  const esCategoriaInvitadas = cat.includes("invitada"); // "invitadas"
  const esFiesta = cat.includes("fiesta");
  const esInvitadaPorTag = hasAnyTag(p, ["invitada", "invitadas"]);

  return esCategoriaInvitadas || (esFiesta && esInvitadaPorTag);
};

// ---------- Card de invitada ----------
function InvitadaCard({ producto, onPedirCita }) {
  const [flipped, setFlipped] = useState(false);
  const { addToCart } = useCart();
  const location = useLocation();
  const from = location.pathname + location.search;

  const imgRef = useRef(null); // ✅ para el fly

  const nombre = producto?.nombre || "Producto de invitada";
  const descripcion =
    producto?.descripcion_larga ||
    producto?.descripcion_corta ||
    producto?.descripcion ||
    "";

  const id = getId(producto);

  const firstImage = useMemo(() => {
    if (producto?.imagen_portada) return producto.imagen_portada;
    if (producto?.imagen) return producto.imagen;
    return "";
  }, [producto]);

  const imageUrl = resolveImageUrl(firstImage) || PLACEHOLDER;

  const price = asNumber(producto?.precio_base);
  const isOnline = isFlagTrue(producto?.venta_online);
  const isVisible = isFlagTrue(producto?.visible_web);

  // Seguridad: si llega algo no visible, no lo pintamos
  if (!isVisible) return null;

  const canBuy = isOnline && price !== null;
  const showPrice = isOnline && price !== null;

  return (
    <div className="card-flip-container h-100">
      <div className={`card card-flip ${flipped ? "flipped" : ""} shadow`}>
        {/* Cara frontal */}
        <div className="card-face card-front">
          <img
            ref={imgRef}
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
              type="button"
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
              <p className="text-muted mb-2">
                Consultar precio y disponibilidad.
              </p>
            ) : (
              <p className="text-muted mb-2">
                Solo disponible en tienda física.
              </p>
            )}

            {canBuy ? (
              <button
                type="button"
                className="btn btn-success mb-2 w-100"
                onClick={() => {
                  addToCart({ producto_id: producto.id });
                  flyToCartFromEl(imgRef.current); // ✅ fly
                }}
              >
                Añadir al carrito
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary mb-2 w-100"
                onClick={onPedirCita}
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
              type="button"
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

// ---------- Página de Invitadas ----------
export default function Invitadas() {
  usePageMeta({
    title: "Invitadas | Beliccia",
    description:
      "Colección de invitadas. Descubre diseños con estilo y solicita información o disponibilidad.",
  });

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    let alive = true;
    setCargando(true);
    setError(null);

    api
      .get("/productos", {
        params: {
          
          page: 1,
          limit: 100,
        },
      })
      .then(({ data }) => {
        const arr = Array.isArray(data?.data) ? data.data : [];

        const invitadas = arr
          .filter(isInvitada)
          .filter((p) => isFlagTrue(p.visible_web));

        if (alive) setProductos(invitadas);
      })
      .catch((err) => {
        console.error(err);
        if (alive) setError("No se pudieron cargar los vestidos de invitadas.");
      })
      .finally(() => {
        if (alive) setCargando(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  if (cargando)
    return <section className="py-5 text-center">Cargando invitadas…</section>;

  if (error)
    return <section className="py-5 text-center text-danger">{error}</section>;

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Colección Invitadas</h2>

        <div className="row g-4">
          {productos.length === 0 ? (
            <div className="col-12 text-center text-muted">
              No hay productos disponibles.
            </div>
          ) : (
            productos.map((p) => (
              <div className="col-12 col-sm-6 col-md-4" key={p.id ?? getId(p)}>
                <InvitadaCard
                  producto={p}
                  onPedirCita={() => {
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

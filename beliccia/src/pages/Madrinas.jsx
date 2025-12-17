// src/pages/Madrinas.jsx
import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { resolveImageUrl } from "../services/imageUrl";
import { usePageMeta } from "../hooks/usePageMeta";
import CitaModal from "../components/CitaModal";
import { flyToCartFromEl } from "../utils/cartFly";

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

// Madrina = fiesta + tag "madrina"
const isMadrina = (p) => {
  const cat = norm(p?.categoria);

  const esCategoriaMadrinas = cat.includes("madrina");   // "madrinas"
  const esFiesta = cat.includes("fiesta");
  const esMadrinaPorTag = hasAnyTag(p, ["madrina", "madrinas"]);

  return esCategoriaMadrinas || (esFiesta && esMadrinaPorTag);
};

// ---------- Card de madrina ----------
function MadrinaCard({ producto, onPedirCita }) {
  const [flipped, setFlipped] = useState(false);
  const { addToCart } = useCart();
  const location = useLocation();
  const from = location.pathname + location.search;

  const imgRef = useRef(null); // ✅ para el fly

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

// ---------- Página de Madrinas ----------
export default function Madrinas() {
  usePageMeta({
    title: "Madrinas | Beliccia",
    description:
      "Colección de vestidos de madrina. Asesoramiento personalizado y opción de solicitar información o cita.",
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
    return <section className="py-5 text-center text-danger">{error}</section>;

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
              <div className="col-12 col-sm-6 col-md-4" key={p.id ?? getId(p)}>
                <MadrinaCard
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

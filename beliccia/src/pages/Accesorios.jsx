// src/pages/Accesorios.jsx
import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import { resolveImageUrl } from "../services/imageUrl";
import CitaModal from "../components/CitaModal";
import { usePageMeta } from "../hooks/usePageMeta";
import { flyToCartFromEl } from "../utils/cartFly";

const PLACEHOLDER = "/placeholder.png";

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

// Normaliza flags tinyint(1) / string / boolean
const isFlagTrue = (v) => v === 1 || v === "1" || v === true;

const deaccent = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const norm = (s) =>
  deaccent(
    String(s || "")
      .toLowerCase()
      .trim()
  );

/**
 * Clasificamos complementos en:
 *  - bolsos
 *  - tocados
 *  - otros
 */
function getAccesorioGroup(producto) {
  const texto = norm(`${producto?.nombre || ""} ${producto?.tags_origen || ""}`);

  if (/\b(bolso|bolsos|clutch|bombonera|cartera|bandolera|bolsa|bolsas)\b/.test(texto))
    return "bolsos";

  if (/\b(tocado|tocados|diadema|diademas|pamela|canotier|corona|tiara|peineta)\b/.test(texto))
    return "tocados";

  return "otros";
}

// ---------- Card ----------
function AccesorioCard({ producto, onSolicitarInfo }) {
  const [flipped, setFlipped] = useState(false);
  const { addToCart } = useCart();
  const location = useLocation();
  const from = location.pathname + location.search;

  const imgRef = useRef(null); // ✅ para el fly

  const id = getId(producto);
  const nombre = producto?.nombre || "Accesorio";

  const firstImage =
    producto?.imagen_portada ||
    producto?.imagen ||
    (Array.isArray(producto?.imagenes) && producto.imagenes[0]) ||
    "";

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
        {/* Front */}
        <div className="card-face card-front">
          <img
            ref={imgRef}
            src={imageUrl}
            className="card-img-top"
            alt={nombre}
            loading="lazy"
            onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
            style={{ objectFit: "contain", aspectRatio: "3 / 4" }}
          />
          <div className="card-body text-center">
            <h5 className="card-title">{nombre}</h5>
            {showPrice && <p>{money(price)}</p>}
            {!isOnline && (
              <p className="text-muted small">
                Solo disponible en tienda física.
              </p>
            )}
            <button
              type="button"
              className="btn btn-outline-dark mt-3"
              onClick={() => setFlipped(true)}
            >
              Ver detalles
            </button>
          </div>
        </div>

        {/* Back */}
        <div className="card-face card-back">
          <div className="card-body text-center d-flex flex-column justify-content-between">
            <h5>{nombre}</h5>
            {!!descripcion && <p>{descripcion}</p>}

            {showPrice ? (
              <p className="fw-bold">{money(price)}</p>
            ) : (
              <p className="text-muted">Consultar precio y disponibilidad.</p>
            )}

            {canBuy ? (
              <button
                type="button"
                className="btn btn-success w-100 mb-2"
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
                className="btn btn-primary w-100 mb-2"
                onClick={() => onSolicitarInfo(producto)}
              >
                Solicitar información
              </button>
            )}

            <Link
              to={`/producto/${encodeURIComponent(id)}`}
              state={{ from }}
              className="btn btn-dark w-100 mb-2"
            >
              Ver más
            </Link>

            <button
              type="button"
              className="btn btn-secondary"
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

// ---------- Página Complementos ----------
export default function Accesorios() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const location = useLocation();
  const segmento = location.pathname.split("/")[1] || "";

  const filtroCat = ["tocados", "bolsos", "otros"].includes(segmento)
    ? segmento
    : null;

  const seoTitle =
    filtroCat === "bolsos"
      ? "Bolsos | Beliccia"
      : filtroCat === "tocados"
      ? "Tocados | Beliccia"
      : filtroCat === "otros"
      ? "Otros complementos | Beliccia"
      : "Complementos | Beliccia";

  const seoDescription =
    filtroCat === "bolsos"
      ? "Descubre bolsos y clutch para completar tu look. Solicita información o disponibilidad en Beliccia."
      : filtroCat === "tocados"
      ? "Tocados, diademas y accesorios de pelo para invitada o novia. Solicita información en Beliccia."
      : filtroCat === "otros"
      ? "Complementos seleccionados para ceremonias y eventos. Solicita información en Beliccia."
      : "Complementos de Beliccia: bolsos, tocados y más. Solicita información o disponibilidad.";

  usePageMeta({
    title: seoTitle,
    description: seoDescription,
  });

  const abrirModal = useCallback((p) => {
    setProductoSeleccionado(p);
    setShowModal(true);
  }, []);

  useEffect(() => {
    let alive = true;
    setCargando(true);
    setError(null);

    api
      .get("/productos", {
        params: { categoria: "complementos", page: 1, limit: 200 },
      })
      .then(({ data }) => {
        let accesorios = (data?.data || [])
          .filter((p) => isFlagTrue(p.visible_web))
          .map((p) => ({ ...p, _grupo: getAccesorioGroup(p) }));

        if (filtroCat) accesorios = accesorios.filter((p) => p._grupo === filtroCat);

        if (alive) setProductos(accesorios);
      })
      .catch(() => alive && setError("No se pudieron cargar los accesorios."))
      .finally(() => alive && setCargando(false));

    return () => (alive = false);
  }, [filtroCat]);

  if (cargando)
    return <section className="py-5 text-center">Cargando accesorios…</section>;

  if (error)
    return <section className="py-5 text-center text-danger">{error}</section>;

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">
          {filtroCat === "bolsos"
            ? "Bolsos"
            : filtroCat === "tocados"
            ? "Tocados"
            : filtroCat === "otros"
            ? "Otros complementos"
            : "Complementos"}
        </h2>

        <div className="row g-4">
          {productos.map((p) => (
            <div className="col-12 col-sm-6 col-md-4" key={getId(p)}>
              <AccesorioCard producto={p} onSolicitarInfo={abrirModal} />
            </div>
          ))}
        </div>
      </div>

      {/* Modal reutilizado */}
      <CitaModal
        open={showModal}
        producto={productoSeleccionado}
        onClose={() => setShowModal(false)}
      />
    </section>
  );
}

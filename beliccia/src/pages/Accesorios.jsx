// src/pages/Accesorios.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { resolveImageUrl } from "../services/imageUrl";
import { usePageMeta } from "../hooks/usePageMeta";

const PLACEHOLDER = "/placeholder.png";

const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// ---------- helpers comunes ----------
const getId = (p) => p?.slug ?? p?.id ?? p?.nombre;

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

  if (
    /\b(bolso|bolsos|clutch|bombonera|cartera|bandolera|bolsa|bolsas)\b/.test(
      texto
    )
  )
    return "bolsos";

  if (
    /\b(tocado|tocados|diadema|diademas|pamela|canotier|corona|tiara|peineta)\b/.test(
      texto
    )
  )
    return "tocados";

  return "otros";
}

// ---------- Card (SIN FLIP, estilo “relacionados”) ----------
function AccesorioCard({ producto }) {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.pathname + location.search;

  const id = getId(producto);
  const nombre = producto?.nombre || "Accesorio";

  const firstImage = useMemo(() => {
    return (
      producto?.imagen_portada ||
      producto?.imagen ||
      (Array.isArray(producto?.imagenes) && producto.imagenes[0]) ||
      ""
    );
  }, [producto]);

  const imageUrl = resolveImageUrl(firstImage) || PLACEHOLDER;

  const isOnline = isFlagTrue(producto?.venta_online);
  const isVisible = isFlagTrue(producto?.visible_web);

  // ✅ precio
  const price = asNumber(producto?.precio_base);
  const showPrice = isOnline && price !== null;

  if (!isVisible) return null;

  const goDetail = () => {
    navigate(`/producto/${encodeURIComponent(id)}`, { state: { from } });
  };

  return (
    <div
      className="bdc-grid-card h-100"
      role="link"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") goDetail();
      }}
      style={{ cursor: "pointer" }}
      aria-label={`Abrir detalle de ${nombre}`}
    >
      {/* ✅ Imagen “a lo relacionados”: wrap + cover */}
      <div className="bdc-grid-imgWrap">
        <img
          src={imageUrl}
          className="bdc-grid-img"
          alt={nombre}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
        />
      </div>

      <div className="p-3 text-center">
        <div className="fw-semibold">{nombre}</div>

        {isOnline ? (
          showPrice ? (
            <div className="text-muted small">€{price.toFixed(2)}</div>
          ) : (
            <div className="text-muted small">Disponible online</div>
          )
        ) : (
          <div className="text-muted small">
            Solo disponible en tienda física.
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Página Complementos ----------
export default function Accesorios() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

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

        if (filtroCat)
          accesorios = accesorios.filter((p) => p._grupo === filtroCat);

        if (alive) setProductos(accesorios);
      })
      .catch(() => alive && setError("No se pudieron cargar los accesorios."))
      .finally(() => alive && setCargando(false));

    return () => {
      alive = false;
    };
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
              <AccesorioCard producto={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

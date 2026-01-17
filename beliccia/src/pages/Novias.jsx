// src/pages/Novias.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import { resolveImageUrl } from "../services/imageUrl";
import { usePageMeta } from "../hooks/usePageMeta";

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

// ---------- Card (estilo “relacionados”) ----------
function NoviaCard({ producto }) {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.pathname + location.search;

  const id = getId(producto);
  const nombre = producto?.nombre || "Vestido de novia";

  const firstImage = useMemo(() => {
    if (producto?.imagen_portada) return producto.imagen_portada;
    if (producto?.imagen) return producto.imagen;
    return "";
  }, [producto]);

  const imageUrl = resolveImageUrl(firstImage) || PLACEHOLDER;

  const isVisible = isFlagTrue(producto?.visible_web);
  const isOnline = isFlagTrue(producto?.venta_online);

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
      <div className="bdc-grid-imgWrap">
        <img
          src={imageUrl}
          className="bdc-grid-img"
          alt={nombre}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER;
          }}
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
          <div className="text-muted small">Solo disponible en tienda física.</div>
        )}
      </div>
    </div>
  );
}

// ---------- Página ----------
export default function Novias() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

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
        params: { categoria: "novias", page: 1, limit: 100 },
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
    <section className="py-5" style={{ backgroundColor: "var(--background-color)" }}>
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
                <NoviaCard producto={p} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

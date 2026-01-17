// src/pages/Madrinas.jsx
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

const isFlagTrue = (v) => v === 1 || v === "1" || v === true;
const getId = (p) => p?.slug ?? p?.id ?? p?.nombre;

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

const isMadrina = (p) => {
  const cat = norm(p?.categoria);
  const esCategoriaMadrinas = cat.includes("madrina");
  const esFiesta = cat.includes("fiesta");
  const esMadrinaPorTag = hasAnyTag(p, ["madrina", "madrinas"]);
  return esCategoriaMadrinas || (esFiesta && esMadrinaPorTag);
};

function MadrinaCard({ producto }) {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.pathname + location.search;

  const id = getId(producto);
  const nombre = producto?.nombre || "Producto";

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

export default function Madrinas() {
  usePageMeta({
    title: "Madrinas | Beliccia",
    description:
      "Colección de vestidos de madrina. Asesoramiento personalizado y opción de solicitar información o cita.",
  });

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setCargando(true);
    setError(null);

    api
      .get("/productos", { params: { page: 1, limit: 100 } })
      .then(({ data }) => {
        const arr = Array.isArray(data?.data) ? data.data : [];
        const madrinas = arr
          .filter(isMadrina)
          .filter((p) => isFlagTrue(p.visible_web));

        if (alive) setProductos(madrinas);
      })
      .catch((err) => {
        console.error(err);
        if (alive) setError("No se pudieron cargar los vestidos de madrina.");
      })
      .finally(() => alive && setCargando(false));

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
                <MadrinaCard producto={p} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

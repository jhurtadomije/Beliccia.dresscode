// src/pages/ProductoDetalle.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../services/imageUrl";
import { usePageMeta } from "../hooks/usePageMeta";
import CitaModal from "../components/CitaModal";

const PLACEHOLDER = "/placeholder.png";
const BUY_LIMIT = 250;

const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// Tallas estándar para pintar disponibilidad
const CANONICAL_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
  "46",
  "48",
  "50",
  "52",
  "54",
  "56",
];

// mini helper para description SEO
const toPlain = (s) =>
  String(s || "")
    .replace(/\s+/g, " ")
    .trim();

const truncate = (s, max = 155) => {
  const t = toPlain(s);
  if (!t) return "";
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
};

export default function ProductoDetalle() {
  // En tu código usamos slug en la URL, pero lo llamas "id"
  const { id } = useParams(); // slug
  const location = useLocation();
  const { addToCart } = useCart();

  const [item, setItem] = useState(null);
  const [images, setImages] = useState([]); // array de objetos { id, url, ... }
  const [mainIdx, setMainIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // Carga del producto: /api/productos/:slug
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);

    api
      .get(`/productos/${encodeURIComponent(id)}`)
      .then(({ data }) => {
        if (!alive) return;
        setItem(data);

        // data.imagenes viene ya como array [{ id, url, alt_text, es_portada, orden }]
        if (Array.isArray(data?.imagenes) && data.imagenes.length) {
          setImages(data.imagenes);
          setMainIdx(0);
        } else if (data?.imagen_portada || data?.imagen) {
          // fallback por si acaso
          setImages([{ url: data.imagen_portada || data.imagen }]);
          setMainIdx(0);
        } else {
          setImages([]);
        }
      })
      .catch((e) => {
        console.error(e);
        if (!alive) return;
        setErr("No se pudo cargar el producto.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  const nombre = item?.nombre || "Producto";

  // Precio: usamos precio_base de tu tabla productos
  const price = asNumber(item?.precio_base);
  const canBuy = price !== null && price <= BUY_LIMIT;
  const showPrice = price !== null && price <= BUY_LIMIT; // mismo criterio que en las listas

  const descripcionLarga = item?.descripcion_larga || "";
  const descripcionCorta = item?.descripcion_corta || "";
  const descripcion = descripcionLarga || descripcionCorta;

  // ✅ SEO dinámico
  const seoTitle = useMemo(() => {
    if (!item) return "Producto | Beliccia";
    const extra =
      item?.marca || item?.coleccion
        ? ` · ${item.marca || ""}${item.marca && item.coleccion ? " / " : ""}${
            item.coleccion || ""
          }`
        : "";
    return `${nombre}${extra} | Beliccia`;
  }, [item, nombre]);

  const seoDescription = useMemo(() => {
    if (!item)
      return "Detalles del producto, disponibilidad y opciones en Beliccia Dress Code.";
    const base =
      item?.descripcion_corta ||
      item?.descripcion_larga ||
      `Descubre ${nombre} y solicita información o disponibilidad.`;
    return truncate(base, 155);
  }, [item, nombre]);

  usePageMeta({
    title: seoTitle,
    description: seoDescription,
  });

  // Tallas desde producto_variantes
  const sizes = useMemo(() => {
    if (!Array.isArray(item?.variantes)) return [];
    const set = new Set(
      item.variantes
        .filter((v) => v.activo && v.stock > 0 && v.talla)
        .map((v) => String(v.talla).toUpperCase())
    );
    return [...set];
  }, [item]);

  // Variante por defecto para añadir al carrito
  const defaultVariant = useMemo(() => {
    const vars = Array.isArray(item?.variantes) ? item.variantes : [];
    if (!vars.length) return null;

    return (
      vars.find((v) => v.activo && v.stock > 0) ||
      vars.find((v) => v.activo) ||
      vars[0] ||
      null
    );
  }, [item]);

  // Galería: convertimos imágenes (objetos) a URLs
  const gallery = useMemo(() => {
    if (Array.isArray(images) && images.length) {
      return images
        .map((img) => (typeof img === "string" ? img : img.url))
        .filter(Boolean);
    }
    const fallback = item?.imagen_portada || item?.imagen || PLACEHOLDER;
    return [fallback];
  }, [images, item]);

  const onAddToCart = useCallback(() => {
    if (!item) return;

    if (!defaultVariant?.id) {
      alert("Este producto no tiene variantes disponibles.");
      return;
    }

    addToCart({
      producto_variante_id: defaultVariant.id,
    });

    alert("¡Añadido al carrito!");
  }, [addToCart, item, defaultVariant]);

  // -------- Volver inteligente --------
  const stateFrom =
    location.state && typeof location.state.from === "string"
      ? location.state.from
      : null;

  const guessedBack = useMemo(() => {
    const cat = String(item?.categoria || "").toLowerCase();
    // La API te devuelve c.nombre como "Novias", "Madrinas", "Invitadas", "Complementos"
    if (cat === "novias") return "/novias";
    if (cat === "madrinas") return "/madrinas";
    if (cat === "invitadas") return "/invitadas";
    if (cat === "complementos") return "/accesorios";
    return "/";
  }, [item]);

  const backTo = stateFrom || guessedBack;

  if (loading)
    return <section className="py-5 text-center">Cargando producto…</section>;
  if (err)
    return <section className="py-5 text-center text-danger">{err}</section>;
  if (!item)
    return (
      <section className="py-5 text-center text-muted">
        Producto no encontrado.
      </section>
    );

  return (
    <section className="py-5">
      <div className="container">
        <div className="row g-4">
          {/* Galería */}
          <div className="col-12 col-md-7">
            <div className="detail-main-image mb-3">
              <img
                src={resolveImageUrl(gallery[mainIdx] || PLACEHOLDER)}
                alt={nombre}
                className="w-100"
                style={{
                  objectFit: "cover",
                  aspectRatio: "3 / 4",
                  borderRadius: 12,
                }}
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
              />
            </div>
            {gallery.length > 1 && (
              <div className="detail-thumbs d-flex flex-wrap gap-2">
                {gallery.slice(0, 12).map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMainIdx(i)}
                    className={`p-0 border-0 bg-transparent ${
                      i === mainIdx ? "opacity-100" : "opacity-75"
                    }`}
                    style={{ cursor: "pointer" }}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    <img
                      src={resolveImageUrl(img)}
                      alt={`${nombre} - foto ${i + 1}`}
                      style={{
                        width: 96,
                        height: 128,
                        objectFit: "cover",
                        borderRadius: 8,
                        border:
                          i === mainIdx ? "2px solid #333" : "1px solid #eee",
                      }}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = PLACEHOLDER;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="col-12 col-md-5">
            <h1 className="h3 mb-2">{nombre}</h1>

            {/* Marca / colección si quieres mostrar el contexto */}
            {(item?.marca || item?.coleccion) && (
              <p className="text-muted mb-2">
                {item?.marca && <span>{item.marca}</span>}
                {item?.marca && item?.coleccion && <span> · </span>}
                {item?.coleccion && <span>{item.coleccion}</span>}
              </p>
            )}

            {showPrice ? (
              <p className="h5 mb-3">€{price.toFixed(2)}</p>
            ) : (
              <p className="text-muted mb-3">
                Consulta disponibilidad y condiciones.
              </p>
            )}

            {descripcion && (
              <p className="mb-3" style={{ whiteSpace: "pre-wrap" }}>
                {descripcion}
              </p>
            )}

            {/* Tallas (desde variantes) */}
            {sizes.length > 0 && (
              <>
                <h6 className="mt-3">Tallas disponibles</h6>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {CANONICAL_SIZES.map((sz) => {
                    const available = sizes.includes(sz);
                    return (
                      <span
                        key={sz}
                        className={`badge ${
                          available ? "bg-dark" : "bg-light text-muted"
                        }`}
                        style={{
                          textDecoration: available ? "none" : "line-through",
                          border: available ? "none" : "1px solid #ddd",
                          padding: "0.6rem 0.8rem",
                          borderRadius: "999px",
                          fontWeight: 500,
                        }}
                        aria-label={
                          available ? `${sz} disponible` : `${sz} no disponible`
                        }
                      >
                        {sz}
                      </span>
                    );
                  })}
                </div>
              </>
            )}

            {/* CTAs */}
            <div className="d-grid gap-2 mt-3">
              {canBuy ? (
                <button
                  className="btn btn-success btn-lg"
                  onClick={onAddToCart}
                  disabled={!defaultVariant}
                >
                  Añadir al carrito
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowModal(true)}
                >
                  Solicitar información
                </button>
              )}
            </div>

            {/* Volver */}
            <div className="mt-4 pt-3 border-top">
              <Link
                to={backTo}
                className="btn btn-outline-secondary"
                style={{ textDecoration: "none" }}
              >
                Volver
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Modal reutilizado */}
      <CitaModal
        open={showModal}
        producto={item}
        onClose={() => setShowModal(false)}
      />
    </section>
  );
}

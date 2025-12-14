// src/pages/ProductoDetalle.jsx
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { resolveImageUrl } from "../services/imageUrl";
import { usePageMeta } from "../hooks/usePageMeta";
import CitaModal from "../components/CitaModal";
import Toast from "../components/Toast";
import { flyToCartFromEl } from "../utils/cartFly";

const PLACEHOLDER = "/placeholder.png";

const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// Normaliza flags tinyint(1) / string / boolean
const isFlagTrue = (v) => v === 1 || v === "1" || v === true;

const norm = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const getTags = (p) => {
  const raw = norm(p?.tags_origen);
  if (!raw) return [];
  return raw.split(/[,\s]+/).filter(Boolean);
};

const getId = (p) => p?.slug ?? p?.id ?? p?.nombre;

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
  const { id } = useParams(); // slug
  const location = useLocation();
  const { addToCart } = useCart();

  const [item, setItem] = useState(null);
  const [images, setImages] = useState([]);
  const [mainIdx, setMainIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [related, setRelated] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  const [showModal, setShowModal] = useState(false);

  // Toast
  const [toast, setToast] = useState({ show: false, message: "" });

  // Ref a la imagen principal para el fly
  const mainImgRef = useRef(null);

  useEffect(() => {
    if (!item) return;

    let alive = true;
    setLoadingRelated(true);

    const myTags = getTags(item);
    const myMarca = norm(item?.marca);
    const mySlug = norm(item?.slug || id);
    const myId = item?.id;

    // intentamos usar categoría (la API en listado acepta "novias", "fiesta", "complementos"...)
    const cat = norm(item?.categoria);

    api
      .get("/productos", {
        params: {
          categoria: cat || undefined,
          page: 1,
          limit: 100,
        },
      })
      .then(({ data }) => {
        if (!alive) return;

        const arr = Array.isArray(data?.data) ? data.data : [];

        // visibles
        const visibles = arr.filter((p) => isFlagTrue(p?.visible_web));

        // sin el actual
        const sinActual = visibles.filter((p) => {
          const ps = norm(p?.slug);
          const pid = p?.id;
          if (myId != null && pid === myId) return false;
          if (mySlug && ps && ps === mySlug) return false;
          return true;
        });

        // scoring simple
        const scored = sinActual
          .map((p) => {
            let score = 0;

            // misma marca suma
            if (myMarca && norm(p?.marca) === myMarca) score += 3;

            // tags comunes suman
            const ptags = getTags(p);
            if (myTags.length && ptags.length) {
              const common = ptags.filter((t) => myTags.includes(t)).length;
              score += Math.min(common, 4); // max 4 puntos por tags
            }

            // si es online, un poquito más (opcional)
            if (isFlagTrue(p?.venta_online)) score += 0.5;

            return { p, score };
          })
          .sort((a, b) => b.score - a.score);

        // si todo da 0, igualmente devolvemos “misma categoría”
        const top = scored.slice(0, 6).map((x) => x.p);

        setRelated(top);
      })
      .catch((e) => {
        console.error(e);
        if (alive) setRelated([]);
      })
      .finally(() => {
        if (alive) setLoadingRelated(false);
      });

    return () => {
      alive = false;
    };
  }, [item, id]);

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

        if (Array.isArray(data?.imagenes) && data.imagenes.length) {
          setImages(data.imagenes);
          setMainIdx(0);
        } else if (data?.imagen_portada || data?.imagen) {
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

  // ✅ Compra SOLO depende de venta_online (API)
  const isOnline = isFlagTrue(item?.venta_online);
  const price = asNumber(item?.precio_base);

  // Mostrar precio solo si es online y hay precio
  const showPrice = isOnline && price !== null;

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
        .filter((v) => v.activo && Number(v.stock) > 0 && v.talla)
        .map((v) => String(v.talla).toUpperCase())
    );
    return [...set];
  }, [item]);

  // Variante por defecto para añadir al carrito
  const defaultVariant = useMemo(() => {
    const vars = Array.isArray(item?.variantes) ? item.variantes : [];
    if (!vars.length) return null;

    return (
      vars.find((v) => v.activo && Number(v.stock) > 0) ||
      vars.find((v) => v.activo) ||
      vars[0] ||
      null
    );
  }, [item]);

  // ✅ Se puede comprar si es online y tenemos variante válida
  const canBuy = isOnline && !!defaultVariant?.id;

  // Galería
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

    // Seguridad: si no es online, abrimos modal
    if (!isFlagTrue(item?.venta_online)) {
      setShowModal(true);
      return;
    }

    if (!defaultVariant?.id) {
      setToast({ show: true, message: "⚠️ No hay variantes disponibles." });
      return;
    }

    addToCart({ producto_variante_id: defaultVariant.id });

    //  Fly hacia el carrito (igual que en las cards)
    flyToCartFromEl(mainImgRef.current);

    //  Feedback + bump del icono
    setToast({ show: true, message: "✅ Añadido al carrito" });
    window.dispatchEvent(new Event("cart:bump"));
  }, [addToCart, item, defaultVariant]);

  // -------- Volver inteligente --------
  const stateFrom =
    location.state && typeof location.state.from === "string"
      ? location.state.from
      : null;

  const guessedBack = useMemo(() => {
    const cat = String(item?.categoria || "").toLowerCase();
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
  if (!item) {
    return (
      <section className="py-5 text-center text-muted">
        Producto no encontrado.
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="row g-4">
          {/* Galería */}
          <div className="col-12 col-md-7">
            <div className="detail-main-image mb-3">
              <img
                ref={mainImgRef}
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

            {/* Tallas */}
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
                  type="button"
                  className="btn btn-success btn-lg"
                  onClick={onAddToCart}
                >
                  Añadir al carrito
                </button>
              ) : (
                <button
                  type="button"
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
          {/* Relacionados */}
          <div className="mt-5">
            <div className="d-flex align-items-end justify-content-between mb-3">
              <h3 className="h5 mb-0">También te puede gustar</h3>
              {loadingRelated && (
                <span className="text-muted small">Cargando…</span>
              )}
            </div>

            {related.length === 0 ? (
              <p className="text-muted small mb-0">
                No hay productos relacionados disponibles.
              </p>
            ) : (
              <div
                className="d-flex gap-3 pb-2"
                style={{
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {related.map((p) => {
                  const rid = getId(p);
                  const nombreRel = p?.nombre || "Producto";
                  const imgRel =
                    resolveImageUrl(p?.imagen_portada || p?.imagen) ||
                    PLACEHOLDER;

                  const priceRel = asNumber(p?.precio_base);
                  const isOnlineRel = isFlagTrue(p?.venta_online);
                  const showPriceRel = isOnlineRel && priceRel !== null;

                  return (
                    <Link
                      key={rid}
                      to={`/producto/${encodeURIComponent(rid)}`}
                      className="text-decoration-none text-dark"
                      style={{ minWidth: 220, maxWidth: 240, flex: "0 0 auto" }}
                    >
                      <div className="bdc-related-card h-100">
                        <div className="bdc-related-imgWrap">
                          <img
                            className="bdc-related-img"
                            src={imgRel}
                            alt={nombreRel}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = PLACEHOLDER;
                            }}
                          />
                        </div>

                        <div className="p-3 text-center">
                          <div className="fw-semibold">{nombreRel}</div>

                          {showPriceRel ? (
                            <div className="text-muted small">
                              €{priceRel.toFixed(2)}
                            </div>
                          ) : (
                            <div className="text-muted small">
                              Solo en tienda física
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <CitaModal
        open={showModal}
        producto={item}
        onClose={() => setShowModal(false)}
      />
      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </section>
  );
}

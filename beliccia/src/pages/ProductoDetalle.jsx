// src/pages/ProductoDetalle.jsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api, { API_BASE, IMAGE_BASE } from '../services/api';
import { useCart } from '../context/CartContext';

const PLACEHOLDER = '/placeholder.png';
const BUY_LIMIT = 250;

const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// ==== URL helpers (API o estático /imagenes) ====
const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE).origin;
  } catch {
    return '';
  }
})();

function resolveImageUrl(raw) {
  if (!raw) return PLACEHOLDER;
  if (/^https?:\/\//i.test(raw)) return raw;                 // absoluta
  if (raw.startsWith('/api/')) return `${API_ORIGIN}${raw}`; // servida por API
  if (raw.startsWith('/imagenes/')) {
    const rel = raw.replace(/^\/?imagenes\//, '');
    return `${IMAGE_BASE}/${rel}`;                           // estática
  }
  return raw; // fallback tal cual
}

// ==== Tallas: extracción desde descripción "T 52", "T XL", ... ====
const CANONICAL_SIZES = [
  'XS','S','M','L','XL','XXL','3XL',
  '34','36','38','40','42','44','46','48','50','52','54','56'
];

function extractSizesFromText(text) {
  if (!text) return [];
  const matches = [...text.matchAll(/\bT\s*([0-9]{2}|XS|S|M|L|XL|XXL|3XL)\b/gi)];
  const found = matches.map(m => m[1].toUpperCase());
  const set = new Set(found.filter(x => CANONICAL_SIZES.includes(x)));
  return [...set];
}

export default function ProductoDetalle() {
  const { id } = useParams();        // id lo usamos como slug
  const location = useLocation();
  const { addToCart } = useCart();

  const [item, setItem] = useState(null);
  const [images, setImages] = useState([]);  // aquí guardaremos objetos { url, ... }
  const [mainIdx, setMainIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Carga del producto (desde /api/productos/:slug)
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr(null);

    api
      .get(`/productos/${encodeURIComponent(id)}`)
      .then(({ data }) => {
        if (!alive) return;
        setItem(data);

        // Imágenes desde la propia respuesta: data.imagenes (array de objetos)
        if (Array.isArray(data?.imagenes) && data.imagenes.length) {
          setImages(data.imagenes); // [{ id, url, alt_text, ... }, ...]
          setMainIdx(0);
        } else if (data?.imagen) {
          // por si acaso tienes un campo simple "imagen"
          setImages([{ url: data.imagen }]);
          setMainIdx(0);
        } else {
          setImages([]);
        }
      })
      .catch((e) => {
        console.error(e);
        if (!alive) return;
        setErr('No se pudo cargar el producto.');
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [id]);

  // Adaptamos los campos a tu API:
  const price = asNumber(item?.precio_base);            // antes item?.precio
  const canBuy = price !== null && price <= BUY_LIMIT;
  const showPrice = price !== null;                     // puedes mantener el límite si quieres

  const descripcionLarga = item?.descripcion_larga || '';
  const descripcionCorta = item?.descripcion_corta || '';

  const sizes = useMemo(
    () => extractSizesFromText(descripcionLarga || descripcionCorta),
    [descripcionLarga, descripcionCorta]
  );

  // Convertimos images (objetos) a lista de URLs para la galería
  const gallery = useMemo(() => {
    if (Array.isArray(images) && images.length) {
      // si viene [{ url, alt_text, ... }] -> nos quedamos con url
      return images.map((img) => (typeof img === 'string' ? img : img.url)).filter(Boolean);
    }
    return [PLACEHOLDER];
  }, [images]);

  const onAddToCart = useCallback(() => {
    if (!item) return;
    // Aquí podrías enriquecer con talla seleccionada cuando la tengas
    addToCart({
      ...item,
      precio: price ?? 0, // adaptamos a la estructura que espere tu CartContext
    });
    alert('¡Añadido al carrito!');
  }, [addToCart, item, price]);

  // -------- Volver inteligente --------
  const stateFrom =
    location.state && typeof location.state.from === 'string'
      ? location.state.from
      : null;

  const guessedBack = useMemo(() => {
    const cat = String(item?.categoria || '').toLowerCase();
    const sub = String(item?.subcategoria || '').toLowerCase();

    if (cat === 'fiesta' && (sub === 'madrina' || sub === 'madrinas')) return '/madrinas';
    if (cat === 'fiesta' && (sub === 'invitada' || sub === 'invitadas')) return '/invitadas';
    if (cat === 'complementos' || cat === 'accesorios') return '/accesorios';
    if (cat === 'novias') return '/novias';
    return '/';
  }, [item]);

  const backTo = stateFrom || guessedBack;

  if (loading)
    return <section className="py-5 text-center">Cargando producto…</section>;
  if (err)
    return (
      <section className="py-5 text-center text-danger">{err}</section>
    );
  if (!item)
    return (
      <section className="py-5 text-center text-muted">
        Producto no encontrado.
      </section>
    );

  const nombre = item?.nombre || item?.name || 'Producto';
  const descripcion = descripcionLarga || descripcionCorta;

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
                  objectFit: 'cover',
                  aspectRatio: '3 / 4',
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
                      i === mainIdx ? 'opacity-100' : 'opacity-75'
                    }`}
                    style={{ cursor: 'pointer' }}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    <img
                      src={resolveImageUrl(img)}
                      alt={`${nombre} - foto ${i + 1}`}
                      style={{
                        width: 96,
                        height: 128,
                        objectFit: 'cover',
                        borderRadius: 8,
                        border:
                          i === mainIdx
                            ? '2px solid #333'
                            : '1px solid #eee',
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

            {showPrice ? (
              <p className="h5 mb-3">€{price.toFixed(2)}</p>
            ) : (
              <p className="text-muted mb-3">
                Consulta disponibilidad y condiciones.
              </p>
            )}

            {descripcion && (
              <p className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>
                {descripcion}
              </p>
            )}

            {/* Tallas (si se detectan) */}
            {sizes.length > 0 && (
              <>
                <h6 className="mt-3">Tallas Disponibles</h6>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {CANONICAL_SIZES.map((sz) => {
                    const available = sizes.includes(sz);
                    return (
                      <span
                        key={sz}
                        className={`badge ${
                          available ? 'bg-dark' : 'bg-light text-muted'
                        } `}
                        style={{
                          textDecoration: available ? 'none' : 'line-through',
                          border: available ? 'none' : '1px solid #ddd',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '999px',
                          fontWeight: 500,
                        }}
                        aria-label={
                          available
                            ? `${sz} disponible`
                            : `${sz} no disponible`
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

            {/* Separador y Volver */}
            <div className="mt-4 pt-3 border-top">
              <Link
                to={backTo}
                className="btn btn-outline-secondary"
                style={{ textDecoration: 'none' }}
              >
                Volver
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de contacto */}
      {showModal && (
        <div
          className="custom-modal-backdrop"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Solicitar información de ${nombre}`}
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

            <h5 className="mb-3">{nombre}</h5>

            <div className="modal-gallery mb-3 d-flex align-items-center">
              {gallery.slice(0, 8).map((img, i) => (
                <img
                  key={i}
                  src={resolveImageUrl(img)}
                  alt={`${nombre} - foto ${i + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER;
                  }}
                  style={{
                    maxWidth: 90,
                    maxHeight: 90,
                    marginRight: 8,
                    borderRadius: 8,
                    objectFit: 'cover',
                    border: '1px solid #eee',
                  }}
                />
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('¡Gracias! Te contactaremos.');
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
                placeholder="Mensaje"
                required
              />
              <button className="btn btn-success w-100" type="submit">
                Enviar solicitud
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

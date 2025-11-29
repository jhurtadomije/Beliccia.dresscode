// src/pages/Novias.jsx
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { resolveImageUrl } from '../services/imageUrl';

const PLACEHOLDER = '/placeholder.png';
const BUY_LIMIT = 250;

const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// ⚠️ IMPORTANTE: priorizamos slug para que el detalle funcione bien
const getId = (p) => p?.slug ?? p?.id ?? p?.sku ?? p?._id ?? p?.nombre;

// ---------- helpers de normalización y detección “novias” ----------
const deaccent = (s) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
const norm = (s) => deaccent(String(s || '').toLowerCase().trim());

const NOVIA_WORDS = new Set([
  'novia',
  'novias',
  'coleccion novias',
  'colección novias',
  'bridal',
  'wedding',
  'bride',
]);

// Adaptado a la nueva API: usamos sobre todo la categoría y el nombre
const isNovia = (p) => {
  const categoria = norm(p?.categoria); // viene del backend como alias c.nombre AS categoria
  const nombre = norm(p?.nombre);
  const coleccion = norm(p?.coleccion);

  return (
    NOVIA_WORDS.has(categoria) ||
    categoria.includes('novia') ||
    coleccion.includes('novia') ||
    nombre.includes('novia') ||
    nombre.includes('bridal')
  );
};

// dedupe por slug/id...
const dedupeByKey = (arr) => {
  const seen = new Set();
  return (arr || []).filter((p) => {
    const k = getId(p) ?? '';
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

// ¿tiene imagen real o usa placeholder?
const hasRealImage = (p) => {
  const first =
    (Array.isArray(p?.imagenes) && p.imagenes[0]) || p?.imagen || '';
  const url = resolveImageUrl(first) || '';
  return url && !url.endsWith('/placeholder.png');
};

function NoviaCard({ producto, onSolicitarInfo }) {
  const [flipped, setFlipped] = useState(false);
  const { addToCart } = useCart();
  const location = useLocation();
  const from = location.pathname + location.search;

  const id = getId(producto);
  const nombre = producto?.nombre || 'Vestido de novia';

  const firstImage = useMemo(() => {
    if (Array.isArray(producto?.imagenes) && producto.imagenes.length)
      return producto.imagenes[0];
    if (producto?.imagen) return producto.imagen;
    return '';
  }, [producto]);

  const imageUrl = resolveImageUrl(firstImage) || PLACEHOLDER;

  // ⚠️ Adaptado: usamos precio_base del backend
  const price = asNumber(producto?.precio_base);
  const canBuy = price !== null && price <= BUY_LIMIT;
  const showPrice = price !== null && price <= BUY_LIMIT; // mismo criterio que tenías

  // descripción adaptada a descripcion_corta/larga
  const descripcion =
    producto?.descripcion_larga ||
    producto?.descripcion_corta ||
    producto?.descripcion ||
    '';

  return (
    <div className="card-flip-container h-100">
      <div className={`card card-flip ${flipped ? 'flipped' : ''} shadow`}>
        {/* Front */}
        <div className="card-face card-front">
          <img
            src={imageUrl}
            className="card-img-top"
            alt={nombre}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER;
            }}
            style={{ objectFit: 'cover', aspectRatio: '3 / 4' }}
          />
          <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
            <h5 className="card-title">{nombre}</h5>
            {showPrice && (
              <p className="card-text mb-0">€{price.toFixed(2)}</p>
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

        {/* Back */}
        <div className="card-face card-back">
          <div className="card-body text-center d-flex flex-column justify-content-between align-items-center">
            <h5 className="card-title">{nombre}</h5>
            {!!descripcion && (
              <p className="card-text mb-3">{descripcion}</p>
            )}

            {showPrice ? (
              <p className="fw-bold">Precio: €{price.toFixed(2)}</p>
            ) : (
              <p className="text-muted mb-2">
                Consulta disponibilidad y condiciones.
              </p>
            )}

            {canBuy ? (
              <button
                className="btn btn-success mb-2 w-100"
                onClick={() =>
                  addToCart({
                    ...producto,
                    precio: price ?? 0, // adaptamos a lo que use el carrito
                  })
                }
              >
                Añadir al carrito
              </button>
            ) : (
              <button
                className="btn btn-primary mb-2 w-100"
                onClick={onSolicitarInfo}
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

export default function Novias() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [searchParams] = useSearchParams();
  const corteSlug = searchParams.get('corte');
  const estilosMap = {
    a: 'Corte A',
    recto: 'Corte Recto',
    sirena: 'Corte Sirena',
    princesa: 'Corte Princesa',
  };
  const corteNombre = estilosMap[corteSlug];

  useEffect(() => {
    // Traemos todo y filtramos en cliente por “novias”
    api
      .get('/productos', { params: { limite: 1000 } })
      .then(({ data }) => {
        const arr = Array.isArray(data)
          ? data
          : Array.isArray(data?.resultados)
          ? data.resultados
          : Array.isArray(data?.items)
          ? data.items
          : [];

        // 1) Solo los que pertenezcan a Novias (según categoria/nombre/coleccion)
        let novias = arr.filter(isNovia);

        // 2) Filtro por estilo si aplica (si en el futuro guardas estilo en la BD)
        if (corteNombre) {
          novias = novias.filter((p) => p?.estilo === corteNombre);
        }

        // 3) Dedupe y ordenar: primero con imagen real
        novias = dedupeByKey(novias).sort((a, b) => {
          const ai = hasRealImage(a) ? 1 : 0;
          const bi = hasRealImage(b) ? 1 : 0;
          return bi - ai;
        });

        setProductos(novias || []);
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudieron cargar los vestidos de novia.');
      })
      .finally(() => setCargando(false));
  }, [corteNombre]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [corteNombre]);

  if (cargando)
    return (
      <section className="py-5 text-center">
        Cargando vestidos de novia…
      </section>
    );
  if (error)
    return (
      <section className="py-5 text-center text-danger">{error}</section>
    );

  return (
    <section
      className="py-5"
      style={{ backgroundColor: 'var(--background-color)' }}
    >
      <div className="container">
        <h2 className="text-center mb-4">Colección de Novias</h2>

        {corteNombre && (
          <p className="text-center fst-italic">
            Filtrando por estilo: <strong>{corteNombre}</strong>
          </p>
        )}

        <div className="row g-4">
          {productos.length === 0 ? (
            <div className="col-12 text-center text-muted">
              No hay vestidos disponibles.
            </div>
          ) : (
            productos.map((p, idx) => (
              <div
                className="col-12 col-sm-6 col-md-4"
                key={`${getId(p)}-${idx}`}
              >
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

      {/* Modal de contacto */}
      {showModal && productoSeleccionado && (
        <div
          className="custom-modal-backdrop"
          onClick={() => setShowModal(false)}
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
            <h5 className="mb-3">
              {productoSeleccionado?.nombre || 'Producto'}
            </h5>

            <div className="modal-gallery mb-3 d-flex align-items-center">
              {(Array.isArray(productoSeleccionado?.imagenes) &&
              productoSeleccionado.imagenes.length
                ? productoSeleccionado.imagenes
                : [productoSeleccionado?.imagen || PLACEHOLDER]
              )
                .slice(0, 8)
                .map((img, i) => {
                  const imgUrl = resolveImageUrl(img);
                  return (
                    <img
                      key={i}
                      src={imgUrl}
                      alt={`${
                        productoSeleccionado?.nombre || 'Producto'
                      } - foto ${i + 1}`}
                      className="modal-image"
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
                  );
                })}
            </div>

            <form
              className="mt-2"
              onSubmit={(e) => {
                e.preventDefault();
                alert('¡Gracias! Te contactaremos pronto.');
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
                placeholder="Mensaje o consulta"
                required
              />
              <button
                className="btn btn-success w-100"
                type="submit"
              >
                Enviar solicitud de información
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

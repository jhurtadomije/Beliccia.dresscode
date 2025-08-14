// src/pages/Invitadas.jsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { API_BASE, IMAGE_BASE } from '../services/api';
import { useCart } from '../context/CartContext';

const PLACEHOLDER = '/placeholder.png'; // asegúrate de tenerlo en /public
const BUY_LIMIT = 250;

const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// Origen API para rutas /api/...
const API_ORIGIN = (() => {
  try { return new URL(API_BASE).origin; } catch { return ''; }
})();

// Normaliza URL de imagen (API o /imagenes)
function resolveImageUrl(raw) {
  if (!raw) return PLACEHOLDER;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith('/api/')) return `${API_ORIGIN}${raw}`;
  if (raw.startsWith('/imagenes/')) {
    const rel = raw.replace(/^\/?imagenes\//, '');
    return `${IMAGE_BASE}/${rel}`;
  }
  return raw;
}

const getId = (p) => p?.id ?? p?.sku ?? p?._id ?? p?.slug ?? p?.nombre ?? String(Math.random());
const getFirstImageRaw = (p) => {
  const arr = Array.isArray(p?.imagenes) ? p.imagenes.filter(Boolean) : [];
  return arr[0] || p?.imagen || '';
};
const hasRawImagePath = (p) => Boolean(getFirstImageRaw(p)?.trim());

// Detecta si el src actual del <img> es el placeholder
const isPlaceholderSrc = (src) => {
  try {
    const u = new URL(src, window.location.origin);
    return u.pathname.endsWith('/placeholder.png');
  } catch {
    return String(src).includes('/placeholder.png');
  }
};

function InvitadaCard({ producto, onPedirCita, onImageStatus }) {
  const [flipped, setFlipped] = useState(false);
  const { addToCart } = useCart();
  const location = useLocation();
  const from = location.pathname + location.search;

  const nombre = producto?.nombre || producto?.name || 'Producto';
  const descripcion = producto?.descripcion || producto?.description || '';
  const id = getId(producto);

  const firstRaw = useMemo(() => getFirstImageRaw(producto), [producto]);
  const imageUrl = resolveImageUrl(firstRaw);

  const price = asNumber(producto?.precio);
  const canBuy = price !== null && price <= BUY_LIMIT;
  const showPrice = canBuy; // solo mostramos precio si ≤ 250

  return (
    <div className="card-flip-container h-100">
      <div className={`card card-flip ${flipped ? 'flipped' : ''} shadow`}>
        {/* Cara frontal */}
        <div className="card-face card-front">
          <img
            src={imageUrl}
            className="card-img-top"
            alt={nombre}
            loading="lazy"
            onLoad={(e) => {
              // ¡Solo marcamos "ok" si NO es el placeholder!
              if (!isPlaceholderSrc(e.currentTarget.src)) {
                onImageStatus?.(id, true);
              }
            }}
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER;
              onImageStatus?.(id, false);
            }}
            style={{ objectFit: 'contain', aspectRatio: '3 / 4' }}
          />
          <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
            <h5 className="card-title">{nombre}</h5>
            {showPrice && <p className="card-text mb-0">€{price.toFixed(2)}</p>}
            <button
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
            {showPrice && <p className="fw-bold">Precio: €{price.toFixed(2)}</p>}
            {!canBuy && <p className="text-muted mb-2">Consulta disponibilidad y pide tu cita</p>}

            {canBuy ? (
              <button
                className="btn btn-success mb-2 w-100"
                onClick={() => addToCart(producto)}
              >
                Añadir al carrito
              </button>
            ) : (
              <button className="btn btn-primary mb-2 w-100" onClick={onPedirCita}>
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

            <button className="btn btn-secondary mt-2" onClick={() => setFlipped(false)}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Invitadas() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Mapa: id -> true (cargó real), false (falló), undefined (aún no sabemos)
  const [imgOk, setImgOk] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const abrirModal = useCallback((p) => {
    setProductoSeleccionado(p);
    setShowModal(true);
  }, []);

  const handleImageStatus = useCallback((id, ok) => {
    setImgOk(prev => (prev[id] === ok ? prev : { ...prev, [id]: ok }));
  }, []);

  useEffect(() => {
    let alive = true;
    setCargando(true);
    setError(null);

    api.get('/productos', { params: { categoria: 'fiesta', subcategoria: 'invitada' } })
      .then(({ data }) => {
        const arr =
          Array.isArray(data) ? data :
          Array.isArray(data?.resultados) ? data.resultados :
          Array.isArray(data?.items) ? data.items :
          [];

        // Pre-orden: primero los que traen *ruta* de imagen, luego sin ruta
        const preSorted = [...arr].sort(
          (a, b) => Number(hasRawImagePath(b)) - Number(hasRawImagePath(a))
        );

        if (alive) setProductos(preSorted);
      })
      .catch(() => {
        if (alive) setError('No se pudieron cargar los vestidos de invitadas.');
      })
      .finally(() => {
        if (alive) setCargando(false);
      });

    return () => { alive = false; };
  }, []);

  // Orden final por estado real de carga: ok > unknown > fail
  const displayList = useMemo(() => {
    const score = (p) => {
      const id = getId(p);
      const st = imgOk[id];
      if (st === true) return 2;      // imagen real confirmada
      if (st === undefined) return 1; // aún no sabemos
      return 0;                       // falló -> placeholder
    };
    return [...productos].sort((a, b) => {
      const s = score(b) - score(a);
      if (s !== 0) return s;
      // empate: preferimos el que tenga ruta de imagen
      return Number(hasRawImagePath(b)) - Number(hasRawImagePath(a));
    });
  }, [productos, imgOk]);

  if (cargando) return <section className="py-5 text-center">Cargando invitadas…</section>;
  if (error) return <section className="py-5 text-center text-danger">{error}</section>;

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Colección Invitadas</h2>
        <div className="row g-4">
          {displayList.length === 0 ? (
            <div className="col-12 text-center text-muted">No hay productos disponibles.</div>
          ) : (
            displayList.map((p) => (
              <div className="col-12 col-sm-6 col-md-4" key={getId(p)}>
                <InvitadaCard
                  producto={p}
                  onPedirCita={() => abrirModal(p)}
                  onImageStatus={handleImageStatus}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de contacto / cita */}
      {showModal && productoSeleccionado && (
        <div
          className="custom-modal-backdrop"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Solicitar información de ${productoSeleccionado?.nombre || productoSeleccionado?.name || 'producto'}`}
        >
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn-close"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar"
            >
              &times;
            </button>

            <h5 className="mb-3">
              {productoSeleccionado?.nombre || productoSeleccionado?.name || 'Producto'}
            </h5>

            <div className="modal-gallery mb-3 d-flex align-items-center">
              {(Array.isArray(productoSeleccionado?.imagenes) && productoSeleccionado.imagenes.length
                  ? productoSeleccionado.imagenes
                  : [getFirstImageRaw(productoSeleccionado) || PLACEHOLDER]
               )
                .slice(0, 8)
                .map((img, i) => {
                  const imgUrl = resolveImageUrl(img);
                  return (
                    <img
                      key={i}
                      src={imgUrl}
                      alt={`${productoSeleccionado?.nombre || 'Producto'} - foto ${i + 1}`}
                      className="modal-image"
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                      style={{ maxWidth: 90, maxHeight: 90, marginRight: 8, borderRadius: 8, objectFit: 'cover', border: '1px solid #eee' }}
                    />
                  );
                })}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('¡Gracias! Te contactaremos.');
                setShowModal(false);
              }}
            >
              <input name="name" autoComplete="name" className="form-control mb-2" placeholder="Nombre" required />
              <input name="email" autoComplete="email" className="form-control mb-2" placeholder="Correo electrónico" type="email" required />
              <textarea name="message" autoComplete="off" className="form-control mb-2" placeholder="Mensaje" required />
              <button className="btn btn-success w-100" type="submit">Enviar solicitud</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

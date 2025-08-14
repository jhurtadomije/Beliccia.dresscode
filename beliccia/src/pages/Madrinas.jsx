// src/pages/Madrinas.jsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api, { API_BASE, IMAGE_BASE } from '../services/api';

const PLACEHOLDER = '/placeholder.png'; // asegúrate de tenerlo en /public
const BUY_LIMIT = 250; // tope para permitir compra online

const asNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// Origen absoluto de la API para componer URLs /api/...
const API_ORIGIN = (() => {
  try { return new URL(API_BASE).origin; } catch { return ''; }
})();

// Normaliza cualquier valor de imagen que nos llegue
function resolveImageUrl(raw) {
  if (!raw) return PLACEHOLDER;
  if (/^https?:\/\//i.test(raw)) return raw;                 // absoluta
  if (raw.startsWith('/api/')) return `${API_ORIGIN}${raw}`; // servida por la API
  if (raw.startsWith('/imagenes/')) {
    const rel = raw.replace(/^\/?imagenes\//, '');
    return `${IMAGE_BASE}/${rel}`;                           // estática
  }
  return raw; // fallback
}

function MadrinaCard({ producto, onPedirCita }) {
  const [flipped, setFlipped] = useState(false);
  const { addToCart } = useCart();
  const location = useLocation();
  const from = location.pathname + location.search;

  const nombre = producto?.nombre || producto?.name || 'Producto';
  const descripcion = producto?.descripcion || producto?.description || '';
  const id = producto?.id ?? producto?.sku ?? producto?._id ?? nombre;

  const imagenes = useMemo(() => {
    if (Array.isArray(producto?.imagenes) && producto.imagenes.length) return producto.imagenes;
    if (producto?.imagen) return [producto.imagen];
    return [PLACEHOLDER];
  }, [producto]);

  const imageUrl = resolveImageUrl(producto?.imagen || imagenes[0]);

  const price = asNumber(producto?.precio);
  const canBuy = price !== null && price <= BUY_LIMIT;
  const showPrice = canBuy; // solo mostramos precio si <= BUY_LIMIT

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
            onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
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

            {canBuy ? (
              <button
                className="btn btn-success mb-2 w-100"
                onClick={() => addToCart(producto)}
              >
                Añadir al carrito
              </button>
            ) : (
              <>
                <p className="text-muted small mb-2">
                  Este artículo no está disponible para venta online. Solicita información y te responderemos a la mayor brevedad posible.
                </p>
                <button
                  className="btn btn-primary mb-2 w-100"
                  onClick={onPedirCita}
                >
                  Solicitar información
                </button>
              </>
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

export default function Madrinas() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const abrirModal = useCallback((p) => {
    setProductoSeleccionado(p);
    setShowModal(true);
  }, []);

  useEffect(() => {
    let alive = true;
    setCargando(true);
    setError(null);

    // Madrinas: categoria=fiesta & subcategoria=madrina
    api.get('/productos', { params: { categoria: 'fiesta', subcategoria: 'madrina', limit: 24 } })
      .then(({ data }) => {
        const arr =
          Array.isArray(data) ? data :
          Array.isArray(data?.resultados) ? data.resultados :
          Array.isArray(data?.items) ? data.items :
          [];
        if (alive) setProductos(arr);
      })
      .catch(() => {
        if (alive) setError('No se pudieron cargar los vestidos de madrina.');
      })
      .finally(() => {
        if (alive) setCargando(false);
      });

    return () => { alive = false; };
  }, []);

  if (cargando) return <section className="py-5 text-center">Cargando madrinas…</section>;
  if (error) return <section className="py-5 text-center text-danger">{error}</section>;

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Colección Madrinas</h2>
        <div className="row g-4">
          {productos.length === 0 ? (
            <div className="col-12 text-center text-muted">No hay productos disponibles.</div>
          ) : (
            productos.map((p) => (
              <div className="col-12 col-sm-6 col-md-4" key={p.id ?? p.sku ?? p._id ?? p.nombre}>
                <MadrinaCard producto={p} onPedirCita={() => abrirModal(p)} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de contacto/solicitud */}
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
                  : [productoSeleccionado?.imagen || PLACEHOLDER]
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

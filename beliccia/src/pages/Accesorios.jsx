// src/pages/Accesorios.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api, { IMAGE_BASE } from '../services/api';

/**
 * Componente para mostrar un accesorio con flip y action
 */
function AccesorioCard({ producto }) {
  const [flipped, setFlipped] = useState(false);
  const { addToCart } = useCart();

  const relativePath = producto.imagenes[0].replace(/^\/?imagenes\//, '');
  const imageUrl = `${IMAGE_BASE}/${relativePath}`;

  return (
    <div className="card-flip-container h-100">
      <div className={`card card-flip ${flipped ? 'flipped' : ''} shadow`}>
        {/* Front */}
        <div className="card-front">
          <img src={imageUrl} className="card-img-top" alt={producto.nombre} loading="lazy" />
          <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
            <h5 className="card-title">{producto.nombre}</h5>
            <p className="card-text">€{producto.precio}</p>
            <button className="btn btn-outline-dark mt-4 mb-3" onClick={() => setFlipped(true)}>
              Ver detalles
            </button>
          </div>
        </div>
        {/* Back */}
        <div className="card-back">
          <div className="card-body text-center d-flex flex-column justify-content-between align-items-center">
            <h5 className="card-title">{producto.nombre}</h5>
            <p className="card-text mb-3">{producto.descripcion}</p>
            <p className="fw-bold">Precio: €{producto.precio}</p>
            <button
              className="btn btn-success mb-2"
              style={{ width: '100%' }}
              onClick={() => addToCart(producto)}
            >
              Añadir al carrito
            </button>
            <button
              className="btn btn-secondary mt-auto"
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

/**
 * Página de accesorios, que puede filtrar según la ruta:
 * /accesorios (todos), /tocados, /bolsos, /pendientes
 */
export default function Accesorios() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Detectar categoría de ruta
  const segmento = location.pathname.split('/')[1] || '';
  const filtroCat = ['tocados', 'bolsos', 'pendientes'].includes(segmento)
    ? segmento
    : null;

  useEffect(() => {
    api.get('/productos?limite=1000')
      .then(({ data }) => {
        const all = Array.isArray(data) ? data : data.resultados;
        // Filtrar solo las tres categorías de accesorios
        const accesorios = all.filter(p => ['tocados', 'bolsos', 'pendientes'].includes(p.categoria));
        // Si hay filtroCat, aplicar
        const resultados = filtroCat
          ? accesorios.filter(p => p.categoria === filtroCat)
          : accesorios;
        setProductos(resultados);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar los accesorios.');
      })
      .finally(() => setCargando(false));
  }, [filtroCat]);

  if (cargando) return <section className="py-5 text-center">Cargando accesorios…</section>;
  if (error) return <section className="py-5 text-center text-danger">{error}</section>;

  return (
    <section className="py-5" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="container">
        <h2 className="text-center mb-4">{
          filtroCat
            ? `Accesorios: ${filtroCat.charAt(0).toUpperCase() + filtroCat.slice(1)}`
            : 'Todos los Accesorios'
        }</h2>
        <div className="row g-4">
          {productos.length === 0 ? (
            <div className="col-12 text-center text-muted">No hay accesorios disponibles.</div>
          ) : (
            productos.map(p => (
              <div className="col-12 col-sm-6 col-md-4" key={p.id}>
                <AccesorioCard producto={p} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

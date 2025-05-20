// src/pages/Novias.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { IMAGE_BASE } from '../services/api';

function NoviaCard({ producto, onPedirCita }) {
  const [flipped, setFlipped] = useState(false);
  const relativePath = producto.imagenes[0].replace(/^\/?imagenes\//, '');
  const imageUrl = `${IMAGE_BASE}/${relativePath}`;

  return (
    <div className="card-flip-container h-100">
      <div className={`card card-flip ${flipped ? 'flipped' : ''} shadow`}>
        {/* Frontal */}
        <div className="card-front">
          <img
            src={imageUrl}
            className="card-img-top"
            alt={producto.nombre}
            loading="lazy"
          />
          <div className="card-body text-center">
            <h5 className="card-title">{producto.nombre}</h5>
            <p className="card-text">€{producto.precio}</p>
            <button
              className="btn btn-outline-dark mt-2"
              onClick={() => setFlipped(true)}
            >
              Ver detalles
            </button>
          </div>
        </div>

        {/* Trasera */}
        <div className="card-back">
          <div className="card-body text-center d-flex flex-column justify-content-between align-items-center">
            <h5 className="card-title">{producto.nombre}</h5>
            <p className="card-text mb-3">{producto.descripcion}</p>
            <p className="fw-bold">Precio: €{producto.precio}</p>

            {producto.ventaOnline ? (
              <button
                className="btn btn-success mb-2"
                style={{ width: '100%' }}
                onClick={() => alert('¡Añadido al carrito!')}
              >
                Añadir al carrito
              </button>
            ) : (
              <button
                className="btn btn-primary mb-2"
                style={{ width: '100%' }}
                onClick={onPedirCita}
              >
                Pedir cita
              </button>
            )}

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

export default function Novias() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Lectura de parámetro ?corte=
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
    api.get('/productos?cat=novias')
      .then(({ data }) => {
        // Extraer array (paginado o directo)
        const arr = Array.isArray(data) ? data : data.resultados;
        // Filtrar por estilo si aplica
        const filtrados = corteNombre
          ? arr.filter(p => p.estilo === corteNombre)
          : arr;
        setProductos(filtrados);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar los vestidos de novia.');
      })
      .finally(() => {
        setCargando(false);
      });
  }, [corteNombre]);

  if (cargando) return (
    <section className="py-5 text-center">Cargando vestidos de novia…</section>
  );
  if (error) return (
    <section className="py-5 text-center text-danger">{error}</section>
  );

  return (
    <section className="py-5" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="container">
        <h2 className="text-center mb-4">Colección de Novias</h2>

        {/* Mostrar filtro activo */}
        {corteNombre && (
          <p className="text-center fst-italic">
            Filtrando por estilo: <strong>{corteNombre}</strong>
          </p>
        )}

        <div className="row g-4">
          {productos.length === 0 ? (
            <div className="col-12 text-center text-muted">No hay vestidos disponibles.</div>
          ) : (
            productos.map(p => (
              <div className="col-12 col-sm-6 col-md-4" key={p.id}>
                <NoviaCard
                  producto={p}
                  onPedirCita={() => {
                    setProductoSeleccionado(p);
                    setShowModal(true);
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de cita */}
      {showModal && productoSeleccionado && (
        <div className="custom-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="custom-modal" onClick={e => e.stopPropagation()}>
            <button className="btn-close" onClick={() => setShowModal(false)}>&times;</button>
            <h5 className="mb-3">{productoSeleccionado.nombre}</h5>
            <div className="modal-gallery mb-3">
              {productoSeleccionado.imagenes.map((img, i) => {
                const imgUrl = `${IMAGE_BASE}/${img.replace(/^\/?imagenes\//, '')}`;
                return (
                  <img
                    key={i}
                    src={imgUrl}
                    alt={`${productoSeleccionado.nombre} - foto ${i + 1}`}
                    className="modal-image"
                    style={{
                      maxWidth: '90px',
                      maxHeight: '90px',
                      marginRight: '8px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                    }}
                  />
                );
              })}
            </div>
            <form
              className="mt-2"
              onSubmit={e => {
                e.preventDefault();
                alert('¡Gracias! Te contactaremos pronto.');
                setShowModal(false);
              }}
            >
              <input name="name" autoComplete="name" className="form-control mb-2" placeholder="Nombre" required />
              <input name="email" autoComplete="email" className="form-control mb-2" placeholder="Correo electrónico" type="email" required />
              <textarea name="message" autoComplete="off" className="form-control mb-2" placeholder="Mensaje o consulta" required />
              <button className="btn btn-success w-100" type="submit">Enviar solicitud de cita</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

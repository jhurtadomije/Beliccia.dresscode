// src/pages/Invitadas.jsx
import { useEffect, useState } from 'react';
import api, { IMAGE_BASE } from '../services/api';

function InvitadaCard({ producto, onPedirCita }) {
  const [flipped, setFlipped] = useState(false);
  const relativePath = producto.imagenes[0].replace(/^\/?imagenes\//, '');
  const imageUrl = `${IMAGE_BASE}/${relativePath}`;

  return (
    <div className="card-flip-container h-100">
      <div className={`card card-flip ${flipped ? 'flipped' : ''} shadow`}>
        <div className="card-front">
          <img src={imageUrl} className="card-img-top" alt={producto.nombre} loading="lazy" />
          <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
            <h5 className="card-title">{producto.nombre}</h5>
            <button className="btn btn-outline-dark mt-4 mb-3" onClick={() => setFlipped(true)}>
              Ver detalles
            </button>
          </div>
        </div>
        <div className="card-back">
          <div className="card-body text-center d-flex flex-column justify-content-between align-items-center">
            <h5 className="card-title">{producto.nombre}</h5>
            <p className="card-text mb-3">{producto.descripcion}</p>
            <p>Consulta disponibilidad y pide tu cita</p>
            <button className="btn btn-primary mb-2" onClick={onPedirCita} style={{ width: '100%' }}>
              Pedir Cita
            </button>
            <a href={`/invitadas/${producto.id}`} className="btn btn-dark mb-2" style={{ width: '100%' }}>
              Ver más
            </a>
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
  const [showModal, setShowModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    api.get('/productos?cat=invitada')
      .then(({ data }) => {
        // data puede venir paginado u directo
        const arr = Array.isArray(data) ? data : data.resultados;
        setProductos(arr);
      })
      .catch(() => setError('No se pudieron cargar los vestidos de invitadas.'))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <section className="py-5 text-center">Cargando invitadas…</section>;
  if (error) return <section className="py-5 text-center text-danger">{error}</section>;

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Colección Invitadas</h2>
        <div className="row g-4">
          {productos.length === 0 ? (
            <div className="col-12 text-center text-muted">No hay productos disponibles.</div>
          ) : (
            productos.map(p => (
              <div className="col-12 col-sm-6 col-md-4" key={p.id}>
                <InvitadaCard
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
                      objectFit: 'cover'
                    }}
                  />
                );
              })}
            </div>
            <form
              onSubmit={e => {
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

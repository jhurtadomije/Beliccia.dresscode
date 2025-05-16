// src/pages/Novias.jsx
import { useEffect, useState } from 'react';
import api, { IMAGE_BASE } from '../services/api';

// Card de Novia con flip
// Card de Novia con flip
function NoviaCard({ producto, onPedirCita }) {
  const [flipped, setFlipped] = useState(false);
  const relativePath = producto.imagenes[0].replace(/^\/?imagenes\/?/, '');
  const imageUrl = `${IMAGE_BASE}/${relativePath}`;

  return (
    <div className="card-flip-container h-100">
      <div className={`card card-flip ${flipped ? 'flipped' : ''} shadow`}>
        {/* Cara Frontal */}
        <div className="card-front">
          <img
            src={imageUrl}
            className="card-img-top"
            alt={producto.nombre}
            loading="lazy"
          />
          <div className="card-body text-center d-flex flex-column justify-content-center align-items-center">
            <h5 className="card-title">{producto.nombre}</h5>
            <button
              className="btn btn-outline-dark mt-4 mb-3"
              onClick={() => setFlipped(true)}
            >
              Ver detalles
            </button>
          </div>
        </div>
        {/* Cara Trasera */}
        <div className="card-back">
          <div className="card-body text-center d-flex flex-column justify-content-between align-items-center">
            <h5 className="card-title">{producto.nombre}</h5>
            <p className="card-text mb-3">{producto.descripcion}</p>
            <p>Para más información, consulta con nosotros o pide tu cita</p>
            <button
              className="btn btn-primary mb-2"
              onClick={onPedirCita}
              style={{ width: '100%' }}
            >
              Pedir Cita
            </button>
            <a
              href={`/novias/${producto.id}`}
              className="btn btn-dark mb-2"
              style={{ width: '100%' }}
            >
              Ver más
            </a>
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

  useEffect(() => {
    api.get('/productos?cat=novias')
      .then(({ data }) => {
        setProductos(data);
        setCargando(false);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar los vestidos de novia.');
        setCargando(false);
      });
  }, []);

  if (cargando) return (
    <section className="py-5" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="container text-center">Cargando vestidos de novia…</div>
    </section>
  );
  if (error) return (
    <section className="py-5" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="container text-center text-danger">{error}</div>
    </section>
  );
  if (!Array.isArray(productos)) return (
    <section className="py-5" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="container text-center text-danger">
        La respuesta de la API no es un array válido.
      </div>
    </section>
  );

  return (
    <section className="py-5" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="container">
        <h2 className="text-center mb-4">Colección de Novias</h2>
        <div className="row g-4">
          {productos.map(p => (
            <div className="col-12 col-sm-6 col-md-4" key={p.id}>
              <NoviaCard 
                producto={p} 
                onPedirCita={() => {
                  setProductoSeleccionado(p);
                  setShowModal(true);
                }} 
              />
            </div>
          ))}
        </div>
      </div>
      {/* MODAL AQUÍ, FUERA DEL GRID */}
      {showModal && productoSeleccionado && (
        <div className="custom-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="custom-modal" onClick={e => e.stopPropagation()}>
            <button className="btn-close" onClick={() => setShowModal(false)} style={{ float: 'right' }}>&times;</button>
            <h5 className="mb-3">{productoSeleccionado.nombre}</h5>
            <div className="modal-gallery mb-3">
              {productoSeleccionado.imagenes.map((img, i) => {
                const imgUrl = `${IMAGE_BASE}/${img.replace(/^\/?imagenes\/?/, '')}`;
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
            {/* Formulario de cita */}
            <form
              className="mt-2"
              onSubmit={e => {
                e.preventDefault();
                alert('¡Gracias! Te contactaremos pronto.');
                setShowModal(false);
              }}
            >
              <input className="form-control mb-2" placeholder="Nombre" required />
              <input className="form-control mb-2" placeholder="Correo electrónico" type="email" required />
              <textarea className="form-control mb-2" placeholder="Mensaje o consulta" required />
              <button className="btn btn-success w-100" type="submit">
                Enviar solicitud de cita
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

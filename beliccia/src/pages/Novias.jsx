// src/pages/Novias.jsx
import { useEffect, useState } from 'react';
import api, { IMAGE_BASE } from '../services/api';

export default function Novias() {
  const [productos, setProductos] = useState([]);
  const [cargando,  setCargando]  = useState(true);
  const [error,     setError]     = useState(null);

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
          {productos.map(p => {
            // Eliminamos el posible prefijo "imagenes/" para evitar duplicados
            const relativePath = p.imagenes[0].replace(/^\/?imagenes\/?/, '');
            const imageUrl = `${IMAGE_BASE}/${relativePath}`;

            return (
              <div className="col-md-4" key={p.id}>
                <div className="card h-100 shadow">
                  <img
                    src={imageUrl}
                    className="card-img-top"
                    alt={p.nombre}
                    loading="lazy"
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{p.nombre}</h5>
                    <p className="card-text">
                      {p.descripcion.length > 100
                        ? p.descripcion.slice(0,100) + '…'
                        : p.descripcion}
                    </p>
                    {p.tallas.length > 0 && (
                      <p className="fw-bold">
                        Tallas: {p.tallas.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

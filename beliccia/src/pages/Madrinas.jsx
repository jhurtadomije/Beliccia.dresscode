// src/pages/Madrinas.jsx
import { useEffect, useState } from 'react';

export default function Madrinas() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('https://api.escuelajs.co/api/v1/products?categoryId=2&limit=12')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  return (
    <section className="py-5" style={{ backgroundColor: 'var(--background-color)' }}>
      <div className="container">
        <h2 className="text-center mb-4">Colección de Madrinas</h2>
        <div className="row">
          {productos.map(producto => (
            <div className="col-md-4 mb-4" key={producto.id}>
              <div className="card h-100 shadow">
                <img src={producto.images[0]} className="card-img-top" alt={producto.title} />
                <div className="card-body text-center">
                  <h5 className="card-title">{producto.title}</h5>
                  <p className="card-text">{producto.description.slice(0, 100)}...</p>
                  <p className="fw-bold">{producto.price} €</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
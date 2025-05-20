// src/components/FiltrosEstiloNovia.jsx
import React from 'react';

const estilos = [
  { nombre: 'Corte A', slug: 'a', img: '/imagenes/estilos/novia-corte-a.png' },
  { nombre: 'Corte Recto', slug: 'recto', img: '/imagenes/estilos/novia-corte-recto.png' },
  { nombre: 'Corte Sirena', slug: 'sirena', img: '/imagenes/estilos/novia-corte-sirena.png' },
  { nombre: 'Corte Princesa', slug: 'princesa', img: '/imagenes/estilos/novia-corte-princesa.png' },
];

export default function FiltrosEstiloNovia({ onSelect }) {
  return (
    <div className="row justify-content-center gy-4 gx-3">
      {estilos.map(estilo => (
        <div key={estilo.slug} className="col-6 col-md-3 text-center">
          <button
            type="button"
            className="btn-filtro-estilo"
            onClick={() => onSelect(estilo.slug)}
            title={`Ver vestidos de ${estilo.nombre}`}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <img
              src={estilo.img}
              alt={estilo.nombre}
              className="img-fluid mb-2"
              style={{ maxHeight: '160px' }}
            />
            <div style={{ fontWeight: 500 }}>{estilo.nombre}</div>
          </button>
        </div>
      ))}
    </div>
  );
}

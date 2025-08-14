// src/pages/Visitanos.jsx
import React from 'react';
import Contact from '../components/Contact'; // si ya lo tienes separado

const ADDRESS = 'Avenida de los Claveles 16, local 1, Maracena, Granada';
const MAP_Q = encodeURIComponent(ADDRESS);
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_Q}&output=embed`;
const MAPS_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${MAP_Q}`;

export default function Visitanos() {
  return (
    <section id="visitanos" className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Visítanos</h2>

        {/* Mapa de Google (usar URL embebible) */}
        <div className="mb-5">
          <div className="ratio ratio-4x3 rounded overflow-hidden shadow-sm">
            <iframe
              title="Mapa Beliccia"
              src={MAP_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>
        </div>

        {/* Datos de contacto */}
        <div className="text-center mb-4">
          <p>
            <strong>Dirección:</strong> {ADDRESS}
          </p>
          <p>
            <strong>Horario:</strong> Lunes a Viernes de 10:00 a 13:30 y de 17:00 a 20:30
          </p>
          <p>
            Sábados de 10:00 a 13:30 
          </p>
          <p>
            <strong>Teléfono:</strong> 958 000 000
          </p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <a
              className="btn btn-primary"
              href={MAPS_DIRECTIONS}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir indicaciones en Google Maps"
            >
              Cómo llegar
            </a>
            <a
              className="btn btn-outline-secondary"
              href={`https://www.google.com/maps/search/?api=1&query=${MAP_Q}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir ubicación en Google Maps"
            >
              Ver en Google Maps
            </a>
          </div>
        </div>

        {/* Formulario de contacto */}
        <Contact />
      </div>
    </section>
  );
}

// src/components/Services.jsx
import { Link } from "react-router-dom";

export default function Services() {
  const services = [
    {
      icon: "fas fa-cut",
      title: "Taller Propio",
      text: "Diseñamos vestidos personalizados adaptados a tus necesidades.",
    },
    {
      icon: "fas fa-palette",
      title: "Asesoramiento",
      text: "Te ayudamos a encontrar el look perfecto para tu evento.",
    },
    {
      icon: "fas fa-clipboard-list",
      title: "Colecciones Exclusivas",
      text: "Explora nuestra línea premium de diseños únicos.",
    },
  ];

  return (
    <section id="services" className="py-5 section fadeIn">
      <div className="container text-center">
        <h2 className="mb-4">Servicios</h2>

        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <i className={`${service.icon} fa-3x text-primary mb-3`} />
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-text">{service.text}</p>
            </div>
          ))}
        </div>

        {/* ✅ único CTA fuera de las cards */}
        <div className="mt-4">
          <Link to="/atelier" className="btn btn-dark">
            Atelier
          </Link>
        </div>
      </div>
    </section>
  );
}

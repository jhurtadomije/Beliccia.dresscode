// src/components/Collections.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Collections() {
  useEffect(() => {
    const el = document.getElementById("carouselCollections");
    if (el && window.bootstrap) {
      const carousel = new window.bootstrap.Carousel(el, {
        interval: 4000,
        ride: "carousel",
        pause: false,
        keyboard: true,
        touch: true,
      });
      carousel.cycle();
    }
  }, []);

  const slides = [
    {
      src: "/imagenes/colecciones/vestido19.jpg",
      title: "Novias",
      text: "Descubre nuestra colección de novia.",
      to: "/novias",
    },
    {
      src: "/imagenes/colecciones/2604.jpg",
      title: "Madrinas",
      text: "Elegancia para ocasiones únicas.",
      to: "/madrinas",
    },
    {
      src: "/imagenes/colecciones/invitada.jpeg",
      title: "Invitadas",
      text: "Looks que marcan la diferencia.",
      to: "/invitadas",
    },
    {
      src: "/imagenes/colecciones/tocados.jpeg",
      title: "Tocados",
      text: "Detalles que elevan tu estilo.",
      to: "/tocados",
    },
    {
      src: "/imagenes/colecciones/bolsos.jpeg",
      title: "Bolsos",
      text: "Complementos únicos.",
      to: "/bolsos",
    },
  ];

  return (
    <section
      id="collections"
      className="py-5"
      style={{ background: "var(--background-color)" }}
    >
      <div className="container text-center">
        <h2 className="mb-4">Colecciones</h2>

        <div
          id="carouselCollections"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          {/* Indicadores */}
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselCollections"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : undefined}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Slides */}
          <div className="carousel-inner">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`carousel-item collections-item ${
                  index === 0 ? "active" : ""
                }`}
              >
                {/* Imagen clicable */}
                <Link to={slide.to} className="d-block w-100">
                  <img
                    src={slide.src}
                    className="d-block w-100 collections-slide-img"
                    alt={slide.title}
                    loading="lazy"
                  />
                </Link>

                {/* Caption */}
                <div className="carousel-caption d-none d-md-block">
                  <h5>{slide.title}</h5>
                  <p>{slide.text}</p>
                  
                </div>
              </div>
            ))}
          </div>

          {/* Controles */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselCollections"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Anterior</span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselCollections"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
    </section>
  );
}

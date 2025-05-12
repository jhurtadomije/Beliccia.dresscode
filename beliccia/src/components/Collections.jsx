import { useEffect } from 'react';

export default function Collections() {
  useEffect(() => {
    const el = document.getElementById('carouselCollections');
    if (el && window.bootstrap) {
      const carousel = new window.bootstrap.Carousel(el, {
        interval: 5000,
        ride: 'carousel',
        pause: false,
        keyboard: true,
        touch: true
      });
      carousel.cycle();
    }
  }, []);

    const slides = [
      {
        src: '/imagenes/colecciones/vestido2.jpg',
        title: 'Vestidos de Novia',
        text: 'Lujosos diseños de novia con detalles únicos.',
      },
      {
        src: '/imagenes/colecciones/vestido6.jpg',
        title: 'Vestidos de Novia Exclusivos',
        text: 'Elegancia para tus momentos más especiales.',
      },
      {
        src: '/imagenes/colecciones/vestido8.jpg',
        title: 'Vestidos de Cóctel',
        text: 'Diseños modernos para destacar en cualquier evento.',
      },
      {
        src: '/imagenes/colecciones/vestido11.jpg',
        title: 'Vestidos de fiesta',
        text: 'Detalles delicados y elegancia clásica.',
      },
      {
        src: '/imagenes/colecciones/vestido13.jpg',
        title: 'Vestidos cortos',
        text: 'Detalles delicados y elegancia clásica.',
      },
      {
        src: '/imagenes/colecciones/vestido19.jpg',
        title: 'Vestidos de Fiesta Elegante',
        text: 'Diseños únicos para destacar en cualquier ocasión.',
      },
      {
        src: '/imagenes/colecciones/vestido24.jpg',
        title: 'Encajes de Ensueño',
        text: 'Detalles delicados y elegancia clásica.',
      },
      {
        src: '/imagenes/colecciones/vestido28.jpg',
        title: 'Elegancia',
        text: 'Detalles delicados y elegancia clásica.',
      },
    ];
  
    return (
      <section id="collections" className="py-5" style={{ background: 'var(--background-color)' }}>
        <div className="container text-center">
          <h2 className="mb-4">Colecciones</h2>
  
          <div id="carouselCollections" className="carousel slide" data-bs-ride="carousel">
            {/* Indicadores */}
            <div className="carousel-indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#carouselCollections"
                  data-bs-slide-to={index}
                  className={index === 0 ? 'active' : ''}
                  aria-current={index === 0 ? 'true' : undefined}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
            </div>
  
            {/* Slides */}
            <div className="carousel-inner" style={{ minHeight: '400px' }}>
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? 'active' : ''}`}
                >
                  <img src={slide.src} className="d-block w-100" alt={slide.title} />
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
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselCollections"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        </div>
      </section>
    );
  }
  
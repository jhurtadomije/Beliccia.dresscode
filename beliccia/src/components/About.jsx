import { useEffect, useState } from 'react';
import { getRandomAnimation } from '../utils/animations';

export default function About() {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    const randomClass = getRandomAnimation();
    setAnimationClass(`section ${randomClass}`);
  }, []);

  return (
    <section id="about" className={`py-5 ${animationClass}`}>
      <div className="container">
        <h2 className="text-center mb-4">Sobre Nosotros</h2>

        <div className="row align-items-center">
          <div className="col-md-6 mb-4">
            <img
              src="/imagenes/about.webp"
              alt="Sobre Nosotros"
              className="img-fluid rounded shadow"
            />
          </div>

          <div className="col-md-6 text-center">
            <p>
              En Beliccia, diseñamos y ofrecemos vestidos únicos para novias,
              fiesta y ocasiones especiales...
            </p>

            <a href="#Tienda" className="btn btn-primary mb-3 me-2">
              Visita nuestra Tienda Online
            </a>
            <a href="#contact" className="btn btn-secondary mb-3">
              Pide tu cita
            </a>

            <div className="social-icons mt-3">
              <a href="#" className="me-3 text-secondary" aria-label="Facebook">
                <i className="fab fa-facebook fa-2x"></i>
              </a>
              <a href="#" className="me-3 text-secondary" aria-label="Instagram">
                <i className="fab fa-instagram fa-2x"></i>
              </a>
              <a href="#" className="text-secondary" aria-label="Pinterest">
                <i className="fab fa-pinterest fa-2x"></i>
              </a>
            </div>

            <div className="newsletter p-4 mt-5 bg-primary-color rounded shadow">
              <h3 className="text-center text-uppercase fw-bold">
                Suscríbete a nuestro Newsletter
              </h3>
              <p className="text-center">
                Recibe las últimas novedades y colecciones directamente en tu correo.
              </p>
              <form className="text-center">
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control mx-auto"
                    style={{ maxWidth: '400px' }}
                    placeholder="Tu correo electrónico"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg">
                  Suscribirse
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

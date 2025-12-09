// src/components/Footer.jsx
import { Link } from "react-router-dom";

function PlaceholderLink({ children }) {
  return (
    <span
      className="text-decoration-none text-secondary"
      style={{ cursor: "not-allowed", opacity: 0.75 }}
      title="Disponible más adelante"
    >
      {children}
    </span>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg--background-color text-secondary pt-5">
      <div className="container">
        {/* Categorías y enlaces */}
        <div className="row text-center text-md-start">
          <div className="col-md-3 mb-3">
            <h6 className="text-uppercase fw-bold">Categorías</h6>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/novias"
                  className="text-decoration-none text-secondary"
                >
                  Vestidos de novia
                </Link>
              </li>
              <li>
                <Link
                  to="/fiesta"
                  className="text-decoration-none text-secondary"
                >
                  Vestidos de fiesta
                </Link>
              </li>
              <li>
                <Link
                  to="/complementos"
                  className="text-decoration-none text-secondary"
                >
                  Complementos
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-3">
            <h6 className="text-uppercase fw-bold">¿Necesitas ayuda?</h6>
            <ul className="list-unstyled">
              <li>
                <PlaceholderLink>Preguntas frecuentes</PlaceholderLink>
              </li>
              <li>
                <Link
                  to="/#contact"
                  className="text-decoration-none text-secondary"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <PlaceholderLink>Mapa web</PlaceholderLink>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-3">
            <h6 className="text-uppercase fw-bold">Puntos de venta</h6>
            <ul className="list-unstyled">
              <li>
                <PlaceholderLink>Tiendas recomendadas</PlaceholderLink>
              </li>
              <li>
                <PlaceholderLink>Abre tu tienda</PlaceholderLink>
              </li>
              <li>
                <PlaceholderLink>Hazte distribuidor</PlaceholderLink>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-3">
            <h6 className="text-uppercase fw-bold">Empresa</h6>
            <ul className="list-unstyled">
              <li>
                <PlaceholderLink>Sobre nosotros</PlaceholderLink>
              </li>
              <li>
                <PlaceholderLink>Únete a nuestro equipo</PlaceholderLink>
              </li>
              <li>
                {/* Área privada dependientas/admin */}
                <Link
                  to="/admin/login"
                  className="text-decoration-none text-secondary"
                >
                  Área privada
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="text-center my-4">
          {/* Si aún no tienes URLs reales, mejor dejar placeholders */}
          <span className="text-secondary me-3" aria-label="Facebook">
            <i className="fab fa-facebook fa-lg" />
          </span>
          <span className="text-secondary me-3" aria-label="Instagram">
            <i className="fab fa-instagram fa-lg" />
          </span>
          <span className="text-secondary me-3" aria-label="Pinterest">
            <i className="fab fa-pinterest fa-lg" />
          </span>
          <span className="text-secondary me-3" aria-label="YouTube">
            <i className="fab fa-youtube fa-lg" />
          </span>
          <span className="text-secondary" aria-label="LinkedIn">
            <i className="fab fa-linkedin fa-lg" />
          </span>
        </div>

        {/* Legales */}
        <div className="text-center border-top pt-3">
          <p className="mb-1">
            &copy; {year} Beliccia Dress Code | Todos los derechos reservados.
          </p>

          <ul className="list-inline mb-0">
            <li className="list-inline-item">
              <PlaceholderLink>Información legal</PlaceholderLink>
            </li>
            <li className="list-inline-item">
              <PlaceholderLink>Política de privacidad</PlaceholderLink>
            </li>
            <li className="list-inline-item">
              <PlaceholderLink>Política de cookies</PlaceholderLink>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

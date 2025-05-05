export default function Footer() {
    return (
      <footer className="bg--background-color text-secondary pt-5">
        <div className="container">
          {/* Categorías y enlaces */}
          <div className="row text-center text-md-start">
            <div className="col-md-3 mb-3">
              <h6 className="text-uppercase fw-bold">Categorías</h6>
              <ul className="list-unstyled">
                <li><a href="#collections" className="text-decoration-none text-secondary">Vestidos de novia</a></li>
                <li><a href="#collections" className="text-decoration-none text-secondary">Vestidos de fiesta</a></li>
                <li><a href="#collections" className="text-decoration-none text-secondary">Vestidos de comunión</a></li>
              </ul>
            </div>
            <div className="col-md-3 mb-3">
              <h6 className="text-uppercase fw-bold">¿Necesitas ayuda?</h6>
              <ul className="list-unstyled">
                <li><a href="#contact" className="text-decoration-none text-secondary">Preguntas frecuentes</a></li>
                <li><a href="#contact" className="text-decoration-none text-secondary">Contacto</a></li>
                <li><a href="#" className="text-decoration-none text-secondary">Mapa web</a></li>
              </ul>
            </div>
            <div className="col-md-3 mb-3">
              <h6 className="text-uppercase fw-bold">Puntos de venta</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-decoration-none text-secondary">Tiendas recomendadas</a></li>
                <li><a href="#" className="text-decoration-none text-secondary">Abre tu tienda</a></li>
                <li><a href="#" className="text-decoration-none text-secondary">Hazte distribuidor</a></li>
              </ul>
            </div>
            <div className="col-md-3 mb-3">
              <h6 className="text-uppercase fw-bold">Empresa</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-decoration-none text-secondary">Sobre nosotros</a></li>
                <li><a href="#" className="text-decoration-none text-secondary">Únete a nuestro equipo</a></li>
              </ul>
            </div>
          </div>
  
          {/* Redes sociales */}
          <div className="text-center my-4">
            <a href="#" className="text-secondary me-3"><i className="fab fa-facebook fa-lg"></i></a>
            <a href="#" className="text-secondary me-3"><i className="fab fa-instagram fa-lg"></i></a>
            <a href="#" className="text-secondary me-3"><i className="fab fa-pinterest fa-lg"></i></a>
            <a href="#" className="text-secondary me-3"><i className="fab fa-youtube fa-lg"></i></a>
            <a href="#" className="text-secondary"><i className="fab fa-linkedin fa-lg"></i></a>
          </div>
  
          {/* Legales */}
          <div className="text-center border-top pt-3">
            <p className="mb-1">&copy; 2025 Beliccia Dress Code | Todos los derechos reservados.</p>
            <ul className="list-inline mb-0">
              <li className="list-inline-item"><a href="#" className="text-decoration-none text-secondary">Información legal</a></li>
              <li className="list-inline-item"><a href="#" className="text-decoration-none text-secondary">Política de privacidad</a></li>
              <li className="list-inline-item"><a href="#" className="text-decoration-none text-secondary">Política de cookies</a></li>
            </ul>
          </div>
        </div>
      </footer>
    );
  }
  
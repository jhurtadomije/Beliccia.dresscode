export default function Header() {
    return (
      <header>
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <a className="navbar-brand" href="#">
              <img
                src="/imagenes/logo.png"
                alt="Logo Beliccia"
                className="d-inline-block align-text-top"
              />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="line line1"></span>
              <span className="line line2"></span>
              <span className="line line3"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link" href="#hero">
                    Inicio
                  </a>
                </li>
  
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#collections"
                    id="coleccionesDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Colecciones
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="coleccionesDropdown">
                    <li><a className="dropdown-item" href="/novias">Novias</a></li>
                    <li><a className="dropdown-item" href="/madrinas">Madrinas</a></li>
                    <li><a className="dropdown-item" href="/invitadas">Invitadas</a></li>
                  </ul>
                </li>
  
                <li className="nav-item">
                  <a className="nav-link" href="#about">
                    Sobre Nosotros
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#services">
                    Servicios
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="https://jhurtadomije.github.io/Tienda/">
                    Tienda
                  </a>
                </li>
                <li className="nav-item dropdown">
                    <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        id="contactDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Contacto
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="contactDropdown">
                        <li><a className="dropdown-item" href="#contact">Formulario</a></li>
                        <li><a className="dropdown-item" href="/visitanos">Visítanos</a></li>
                    </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    );
  }
  
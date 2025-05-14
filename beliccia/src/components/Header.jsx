import { useEffect, useRef, useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const collapseRef = useRef(null);
  const togglerRef = useRef(null);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        collapseRef.current &&
        !collapseRef.current.contains(e.target) &&
        togglerRef.current &&
        !togglerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header>
      <nav className="navbar navbar-expand-lg">
        <div className="container d-flex align-items-center justify-content-between position-relative">

          {/* Botón hamburguesa */}
          <button
            ref={togglerRef}
            className={`navbar-toggler ${menuOpen ? 'open' : ''}`}
            type="button"
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span className="line line1"></span>
            <span className="line line2"></span>
            <span className="line line3"></span>
          </button>

          {/* Logo */}
          <a className="navbar-brand" href="/">
            <img
              src="/imagenes/logo.png"
              alt="Logo Beliccia"
              className="d-inline-block align-text-top"
            />
          </a>

          {/* Menú desplegable */}
          <div
            ref={collapseRef}
            className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/#hero">Inicio</a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#collections"
                  id="coleccionesDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Colecciones
                </a>
                <ul className="dropdown-menu" aria-labelledby="coleccionesDropdown">
                  <li><a className="dropdown-item" href="/novias">Novias</a></li>
                  <li><a className="dropdown-item" href="/invitadas">Invitadas</a></li>
                  <li><a className="dropdown-item" href="/accesorios">Accesorios</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#about">Sobre Nosotros</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#services">Servicios</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="https://jhurtadomije.github.io/Tienda/">Tienda</a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="contactDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Contacto
                </a>
                <ul className="dropdown-menu" aria-labelledby="contactDropdown">
                  <li><a className="dropdown-item" href="/#contact">Formulario</a></li>
                  <li><a className="dropdown-item" href="/visitanos">Visítanos</a></li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Iconos */}
          <div className="navbar-icons d-flex ms-auto">
            <a href="/buscar" className="icon-link me-2" title="Buscar">
              <i className="fas fa-search"></i>
            </a>
            <a href="/carrito" className="icon-link me-2" title="Carrito">
              <i className="fas fa-shopping-cart"></i>
            </a>
            <a href="/login" className="icon-link" title="Iniciar sesión">
              <i className="fas fa-user"></i>
            </a>
          </div>

        </div>
      </nav>
    </header>
  );
}

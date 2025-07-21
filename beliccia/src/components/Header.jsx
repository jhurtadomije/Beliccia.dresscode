// src/components/Header.jsx
import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import FiltrosEstiloNovia from './FiltrosEstiloNovia';

export default function Header() {
  const location = useLocation();
  const isNoviasPage = location.pathname.startsWith('/novias');

  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalEstilosVisible, setModalEstilosVisible] = useState(false);

  const collapseRef = useRef(null);
  const togglerRef = useRef(null);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const handleEligeEstiloClick = e => {
    e.preventDefault();
    setModalEstilosVisible(true);
  };

  // Habilita submenús anidados
  useEffect(() => {
    const container = collapseRef.current;
    if (!container) return;
    const toggles = container.querySelectorAll('.dropdown-submenu > .dropdown-toggle');
    toggles.forEach(toggle => {
      toggle.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        // Ocultar otras sublistas
        toggles.forEach(t => {
          if (t !== toggle) {
            t.nextElementSibling.classList.remove('show');
          }
        });
        toggle.nextElementSibling.classList.toggle('show');
      });
    });
    return () => {
      toggles.forEach(toggle => {
        toggle.replaceWith(toggle.cloneNode(true));
      });
    };
  }, [menuOpen]);

  // Cambia estilo al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cierra el menú al click fuera
  useEffect(() => {
    const handleClickOutside = e => {
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

  // Cierra el menú al navegar a otra ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Bloquea scroll del body cuando menú/modal está abierto
  useEffect(() => {
    document.body.style.overflow = (menuOpen || modalEstilosVisible) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, modalEstilosVisible]);

  return (
    <header
      className={`main-header${expanded ? ' expanded' : ''}${scrolled ? ' scrolled' : ''}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <nav className="navbar navbar-expand-lg">
        <div className="container d-flex align-items-center justify-content-between position-relative">

          {/* Botón hamburguesa */}
          <button
            ref={togglerRef}
            className={`navbar-toggler ${menuOpen ? 'open' : ''}`}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span className="line line1" />
            <span className="line line2" />
            <span className="line line3" />
          </button>

          {/* Logo */}
          <Link className="navbar-brand" to="/">
            <img src="/imagenes/logo.png" alt="Logo Beliccia" />
          </Link>

          {/* Menú principal */}
          <div
            ref={collapseRef}
            className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}
            id="navbarNav"
          >
            <ul className="navbar-nav">

              {/* Inicio */}
              <li className="nav-item">
                <NavLink className="nav-link" to="/#hero">Inicio</NavLink>
              </li>

              {/* Colecciones */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#colecciones"
                  id="coleccionesDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Colecciones
                </a>
                <ul className="dropdown-menu" aria-labelledby="coleccionesDropdown">

                  {/* Novias */}
                  <li className="dropdown-submenu dropend">
                    <a
                      className="dropdown-item dropdown-toggle"
                      href="/novias"
                    >
                      Novias
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink className="dropdown-item" to="/novias">
                          Ver todo
                        </NavLink>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleEligeEstiloClick}
                        >
                          Elige tu estilo
                        </button>
                      </li>
                    </ul>
                  </li>

                  {/* Invitadas */}
                  <li>
                    <NavLink className="dropdown-item" to="/invitadas">
                      Invitadas
                    </NavLink>
                  </li>

                  {/* Complementos */}
                  <li className="dropdown-submenu dropend">
                    <a
                      className="dropdown-item dropdown-toggle"
                      href="/accesorios"
                    >
                      Complementos
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink className="dropdown-item" to="/tocados">
                          Tocados
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="dropdown-item" to="/bolsos">
                          Bolsos
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="dropdown-item" to="/pendientes">
                          Pendientes
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              {/* Sobre Nosotros */}
              <li className="nav-item">
                <NavLink className="nav-link" to="/#about">Sobre Nosotros</NavLink>
              </li>

              {/* Servicios */}
              <li className="nav-item">
                <NavLink className="nav-link" to="/#services">Servicios</NavLink>
              </li>

              {/* Contacto */}
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
                  <li>
                    <NavLink className="dropdown-item" to="/#contact">Formulario</NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/visitanos">Visítanos</NavLink>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Iconos */}
          <div className="navbar-icons d-flex ms-auto">
            <Link to="/buscar" className="icon-link me-2" title="Buscar"><i className="fas fa-search" /></Link>
            <Link to="/carrito" className="icon-link me-2" title="Carrito"><i className="fas fa-shopping-cart" /></Link>
            <Link to="/login" className="icon-link" title="Iniciar sesión"><i className="fas fa-user" /></Link>
          </div>
        </div>
      </nav>

      {/* Modal Estilos Novia */}
      {modalEstilosVisible && (
      <div className="custom-modal-backdrop" onClick={() => setModalEstilosVisible(false)}>
        <div className="custom-modal" onClick={e => e.stopPropagation()}>
          <button className="btn-close" onClick={() => setModalEstilosVisible(false)}>&times;</button>
          <h4 className="mb-3 text-center">Elige tu estilo</h4>
          <FiltrosEstiloNovia
            onSelect={slug => {
              window.location.href = `/novias?corte=${slug}`;
              setModalEstilosVisible(false);
            }}
          />
        </div>
      </div>
      )}
    </header>
  );
}

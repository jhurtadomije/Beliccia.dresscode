// src/components/Header.jsx
import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import FiltrosEstiloNovia from './FiltrosEstiloNovia';

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);              // overlay móvil
  const [expanded, setExpanded] = useState(false);              // efecto hover general
  const [scrolled, setScrolled] = useState(false);
  const [modalEstilosVisible, setModalEstilosVisible] = useState(false);
  const [hasOpenDesktopMenu, setHasOpenDesktopMenu] = useState(false);

  const collapseRef = useRef(null);
  const togglerRef = useRef(null);
  const hoverTimersRef = useRef(new Map());
  const collapseHdrTimeout = useRef(null);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  const closeAllSubmenus = () => {
    const root = collapseRef.current;
    if (!root) return;
    root.querySelectorAll('.dropdown-menu.show').forEach(ul => ul.classList.remove('show'));
    root.querySelectorAll('.dropdown-toggle[aria-expanded="true"]').forEach(btn => btn.setAttribute('aria-expanded', 'false'));
  };

  // ✅ NUEVO: manejador de desplegables en móvil (sin listeners externos)
  const toggleDropdown = (e) => {
    // Solo actuamos en móvil
    if (window.innerWidth >= 992) return;
    e.preventDefault();
    e.stopPropagation();
    const btn = e.currentTarget;
    const menu = btn.nextElementSibling; // el <ul.dropdown-menu> siguiente
    if (!menu) return;

    const isOpen = menu.classList.contains('show');

    // Cerrar hermanos del mismo nivel
    const parentMenu = menu.parentElement?.parentElement; // el <ul> padre
    if (parentMenu) {
      parentMenu.querySelectorAll(':scope > li > .dropdown-menu.show').forEach(ul => {
        if (ul !== menu) ul.classList.remove('show');
      });
      parentMenu
        .querySelectorAll(':scope > li > .dropdown-toggle[aria-expanded="true"]')
        .forEach(b => { if (b !== btn) b.setAttribute('aria-expanded', 'false'); });
    }

    // Toggle actual
    menu.classList.toggle('show', !isOpen);
    btn.setAttribute('aria-expanded', (!isOpen).toString());
  };

  // ------------------ SUBMENÚS EN DESKTOP (hover-intent) ------------------
  useEffect(() => {
    if (window.innerWidth < 992) return;
    const root = collapseRef.current;
    if (!root) return;

    const HOVER_OPEN_DELAY = 70;   // ms
    const HOVER_CLOSE_DELAY = 320; // ms

    const items = root.querySelectorAll(
      '.navbar-nav > .nav-item.dropdown, .dropdown-submenu.dropend'
    );
    const timers = hoverTimersRef.current;
    const handlers = [];

    const openItem = (item) => {
      item.classList.add('open');
      setHasOpenDesktopMenu(true);
      setExpanded(true);
    };
    const closeItem = (item) => {
      item.classList.remove('open');
      if (!root.querySelector('.nav-item.dropdown.open, .dropdown-submenu.dropend.open')) {
        setHasOpenDesktopMenu(false);
        clearTimeout(collapseHdrTimeout.current);
        collapseHdrTimeout.current = setTimeout(() => setExpanded(false), 120);
      }
    };

    items.forEach((item) => {
      const onEnter = () => {
        const tm = timers.get(item);
        if (tm?.close) { clearTimeout(tm.close); tm.close = null; }
        const openTm = setTimeout(() => openItem(item), HOVER_OPEN_DELAY);
        timers.set(item, { ...(timers.get(item) || {}), open: openTm });
      };
      const onLeave = () => {
        const tm = timers.get(item);
        if (tm?.open) { clearTimeout(tm.open); tm.open = null; }
        const closeTm = setTimeout(() => closeItem(item), HOVER_CLOSE_DELAY);
        timers.set(item, { ...(timers.get(item) || {}), close: closeTm });
      };

      item.addEventListener('mouseenter', onEnter);
      item.addEventListener('mouseleave', onLeave);
      handlers.push({ item, onEnter, onLeave });
    });

    return () => {
      handlers.forEach(({ item, onEnter, onLeave }) => {
        item.removeEventListener('mouseenter', onEnter);
        item.removeEventListener('mouseleave', onLeave);
      });
      timers.forEach(({ open, close }) => {
        if (open) clearTimeout(open);
        if (close) clearTimeout(close);
      });
      timers.clear();
    };
  }, [location]);

  // Estilo al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Click FUERA para cerrar (desktop/móvil)
  useEffect(() => {
    const handleClickOutside = e => {
      if (
        collapseRef.current &&
        !collapseRef.current.contains(e.target) &&
        togglerRef.current &&
        !togglerRef.current.contains(e.target)
      ) {
        closeAllSubmenus();
        setHasOpenDesktopMenu(false);
        setExpanded(false);
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cierra el overlay al navegar
  useEffect(() => {
    closeAllSubmenus();
    setHasOpenDesktopMenu(false);
    setExpanded(false);
    closeMenu();
  }, [location]);

  // Bloquea scroll del body cuando menú/modal está abierto
  useEffect(() => {
    document.body.style.overflow = (menuOpen || modalEstilosVisible) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, modalEstilosVisible]);

  // ESC para cerrar
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeAllSubmenus();
        setHasOpenDesktopMenu(false);
        setExpanded(false);
        closeMenu();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header
      className={`main-header${(expanded || hasOpenDesktopMenu) ? ' expanded' : ''}${scrolled ? ' scrolled' : ''}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => {
        if (window.innerWidth >= 992) {
          clearTimeout(collapseHdrTimeout.current);
          collapseHdrTimeout.current = setTimeout(() => {
            if (!hasOpenDesktopMenu) setExpanded(false);
          }, 160);
        } else {
          setExpanded(false);
        }
      }}
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

              <li className="nav-item">
                <NavLink className="nav-link" to="/#hero">Inicio</NavLink>
              </li>

              {/* Colecciones */}
              <li className="nav-item dropdown">
                <button
                  type="button"
                  className="nav-link dropdown-toggle btn-reset-link"
                  id="coleccionesDropdown"
                  aria-expanded="false"
                  onClick={toggleDropdown}   // <-- aquí
                >
                  Colecciones
                </button>
                <ul className="dropdown-menu" aria-labelledby="coleccionesDropdown">
                  {/* Novias */}
                  <li className="dropdown-submenu dropend">
                    <button
                      type="button"
                      className="dropdown-item dropdown-toggle"
                      aria-expanded="false"
                      onClick={toggleDropdown}   // <-- y aquí
                    >
                      Novias
                    </button>
                    <ul className="dropdown-menu">
                      <li><NavLink className="dropdown-item" to="/novias">Ver todo</NavLink></li>
                      <li>
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={(e) => { e.preventDefault(); setModalEstilosVisible(true); }}
                        >
                          Elige tu estilo
                        </button>
                      </li>
                    </ul>
                  </li>

                  {/* Fiesta */}
                  <li className="dropdown-submenu dropend">
                    <button
                      type="button"
                      className="dropdown-item dropdown-toggle"
                      aria-expanded="false"
                      onClick={toggleDropdown}
                    >
                      Fiesta
                    </button>
                    <ul className="dropdown-menu">
                      {/* Madrinas */}
                      <li className="dropdown-submenu dropend">
                        <button
                          type="button"
                          className="dropdown-item dropdown-toggle"
                          aria-expanded="false"
                          onClick={toggleDropdown}
                        >
                          Madrinas
                        </button>
                        <ul className="dropdown-menu">
                          <li><NavLink className="dropdown-item" to="/madrinas">Ver todo</NavLink></li>
                        </ul>
                      </li>
                      {/* Invitadas */}
                      <li className="dropdown-submenu dropend">
                        <button
                          type="button"
                          className="dropdown-item dropdown-toggle"
                          aria-expanded="false"
                          onClick={toggleDropdown}
                        >
                          Invitadas
                        </button>
                        <ul className="dropdown-menu">
                          <li><NavLink className="dropdown-item" to="/invitadas">Ver todo</NavLink></li>
                        </ul>
                      </li>
                    </ul>
                  </li>

                  {/* Complementos */}
                  <li className="dropdown-submenu dropend">
                    <button
                      type="button"
                      className="dropdown-item dropdown-toggle"
                      aria-expanded="false"
                      onClick={toggleDropdown}
                    >
                      Complementos
                    </button>
                    <ul className="dropdown-menu">
                      <li><NavLink className="dropdown-item" to="/tocados">Tocados</NavLink></li>
                      <li><NavLink className="dropdown-item" to="/bolsos">Bolsos</NavLink></li>
                      <li><NavLink className="dropdown-item" to="/otros">Otros</NavLink></li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li className="nav-item"><NavLink className="nav-link" to="/#about">Conócenos</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/#services">Servicios</NavLink></li>

              {/* Contacto */}
              <li className="nav-item dropdown">
                <button
                  type="button"
                  className="nav-link dropdown-toggle btn-reset-link"
                  id="contactDropdown"
                  aria-expanded="false"
                  onClick={toggleDropdown}
                >
                  Contacto
                </button>
                <ul className="dropdown-menu" aria-labelledby="contactDropdown">
                  <li><NavLink className="dropdown-item" to="/#contact">Formulario</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/visitanos">Visítanos</NavLink></li>
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

      {/* Overlay móvil para cerrar tocando fuera */}
      {menuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => {
            closeAllSubmenus();
            setHasOpenDesktopMenu(false);
            setExpanded(false);
            closeMenu();
          }}
        />
      )}

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

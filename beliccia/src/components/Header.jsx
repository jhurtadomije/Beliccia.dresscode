// src/components/Header.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import FiltrosEstiloNovia from "./FiltrosEstiloNovia";

const DESKTOP_BP = 992;

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartIconRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalEstilosVisible, setModalEstilosVisible] = useState(false);
  const [hasOpenDesktopMenu, setHasOpenDesktopMenu] = useState(false);

  const navRef = useRef(null); // ✅ nuevo: para detectar "click fuera" correctamente
  const collapseRef = useRef(null);
  const togglerRef = useRef(null);
  const hoverTimersRef = useRef(new Map());
  const collapseHdrTimeout = useRef(null);

  const isDesktop = () => window.innerWidth >= DESKTOP_BP;
  const isHome = location.pathname === "/";
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((p) => !p), []);
  const [cartBump, setCartBump] = useState(false);

  useEffect(() => {
    const onBump = () => {
      setCartBump(true);
      setTimeout(() => setCartBump(false), 450);
    };
    window.addEventListener("cart:bump", onBump);
    return () => window.removeEventListener("cart:bump", onBump);
  }, []);

  const closeAllSubmenus = useCallback(() => {
    const root = collapseRef.current;
    if (!root) return;

    // móvil: .show
    root
      .querySelectorAll(".dropdown-menu.show")
      .forEach((ul) => ul.classList.remove("show"));
    root
      .querySelectorAll('.dropdown-toggle[aria-expanded="true"]')
      .forEach((btn) => btn.setAttribute("aria-expanded", "false"));

    // desktop: .open
    root
      .querySelectorAll(
        ".nav-item.dropdown.open, .dropdown-submenu.dropend.open"
      )
      .forEach((li) => li.classList.remove("open"));
  }, []);

  const resetHeaderState = useCallback(() => {
    closeAllSubmenus();
    setHasOpenDesktopMenu(false);
    setExpanded(false);
    setMenuOpen(false);
    setModalEstilosVisible(false);
  }, [closeAllSubmenus]);

  const toggleDropdown = useCallback((e) => {
    // SOLO MÓVIL
    if (isDesktop()) return;

    e.preventDefault();
    e.stopPropagation();

    const btn = e.currentTarget;
    const menu = btn.nextElementSibling;
    if (!menu) return;

    const isOpen = menu.classList.contains("show");

    // Cerrar siblings
    const parentMenu = menu.parentElement?.parentElement;
    if (parentMenu) {
      parentMenu
        .querySelectorAll(":scope > li > .dropdown-menu.show")
        .forEach((ul) => {
          if (ul !== menu) ul.classList.remove("show");
        });

      parentMenu
        .querySelectorAll(
          ':scope > li > .dropdown-toggle[aria-expanded="true"]'
        )
        .forEach((b) => {
          if (b !== btn) b.setAttribute("aria-expanded", "false");
        });
    }

    menu.classList.toggle("show", !isOpen);
    btn.setAttribute("aria-expanded", (!isOpen).toString());
  }, []);

  // ------------------ DESKTOP hover-intent ------------------
  useEffect(() => {
    if (!isDesktop()) return;

    const root = collapseRef.current;
    if (!root) return;

    const HOVER_OPEN_DELAY = 70;
    const HOVER_CLOSE_DELAY = 220;

    const items = root.querySelectorAll(
      ".navbar-nav > .nav-item.dropdown, .dropdown-submenu.dropend"
    );

    const timers = hoverTimersRef.current;
    const handlers = [];

    const computeHasAnyOpen = () =>
      !!root.querySelector(
        ".nav-item.dropdown.open, .dropdown-submenu.dropend.open"
      );

    const openItem = (item) => {
      item.classList.add("open");
      setHasOpenDesktopMenu(true);
      setExpanded(true);
    };

    const closeItem = (item) => {
      item.classList.remove("open");

      // si ya no queda ninguno abierto, colapsamos header
      if (!computeHasAnyOpen()) {
        setHasOpenDesktopMenu(false);
        clearTimeout(collapseHdrTimeout.current);
        collapseHdrTimeout.current = setTimeout(() => setExpanded(false), 120);
      }
    };

    items.forEach((item) => {
      const onEnter = () => {
        const tm = timers.get(item);
        if (tm?.close) clearTimeout(tm.close);

        const openTm = setTimeout(() => openItem(item), HOVER_OPEN_DELAY);
        timers.set(item, { ...(tm || {}), open: openTm, close: null });
      };

      const onLeave = () => {
        const tm = timers.get(item);
        if (tm?.open) clearTimeout(tm.open);

        const closeTm = setTimeout(() => closeItem(item), HOVER_CLOSE_DELAY);
        timers.set(item, { ...(tm || {}), close: closeTm, open: null });
      };

      item.addEventListener("mouseenter", onEnter);
      item.addEventListener("mouseleave", onLeave);
      handlers.push({ item, onEnter, onLeave });
    });

    return () => {
      handlers.forEach(({ item, onEnter, onLeave }) => {
        item.removeEventListener("mouseenter", onEnter);
        item.removeEventListener("mouseleave", onLeave);
      });

      timers.forEach(({ open, close }) => {
        if (open) clearTimeout(open);
        if (close) clearTimeout(close);
      });
      timers.clear();
    };
  }, [location]);

  // Scroll (con init)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Resize: si cambia de desktop a móvil o al revés, resetea estados peligrosos
  useEffect(() => {
    const onResize = () => {
      resetHeaderState();
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [resetHeaderState]);

  // ✅ Click fuera (FIX): usar "click" y comprobar TODO el navbar, no solo el collapse
  useEffect(() => {
    const handleClickOutside = (e) => {
      const nav = navRef.current;
      const toggler = togglerRef.current;

      const clickedInsideNav = nav && nav.contains(e.target);
      const clickedOnToggler = toggler && toggler.contains(e.target);

      if (!clickedInsideNav && !clickedOnToggler) {
        closeAllSubmenus();
        setHasOpenDesktopMenu(false);
        setExpanded(false);
        closeMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [closeAllSubmenus, closeMenu]);

  // Cierra al navegar
  useEffect(() => {
    closeAllSubmenus();
    setHasOpenDesktopMenu(false);
    setExpanded(false);
    closeMenu();
  }, [location, closeAllSubmenus, closeMenu]);

  // Bloqueo de scroll body (solo si menú móvil o modal)
  useEffect(() => {
    document.body.style.overflow =
      menuOpen || modalEstilosVisible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, modalEstilosVisible]);

  // ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        resetHeaderState();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [resetHeaderState]);

  //efecto fly añadir al carrito
  useEffect(() => {
    const fly = (detail) => {
      const cartEl = cartIconRef.current;
      if (!cartEl) return;

      const { imgSrc, fromRect } = detail || {};
      if (!imgSrc || !fromRect) return;

      const toRect = cartEl.getBoundingClientRect();

      // elemento "volador"
      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.style.position = "fixed";
      img.style.left = `${fromRect.left}px`;
      img.style.top = `${fromRect.top}px`;
      img.style.width = `${fromRect.width}px`;
      img.style.height = `${fromRect.height}px`;
      img.style.objectFit = "cover";
      img.style.borderRadius = "12px";
      img.style.zIndex = "99999";
      img.style.pointerEvents = "none";
      img.style.boxShadow = "0 18px 45px rgba(0,0,0,.25)";
      img.style.transform = "translate3d(0,0,0) scale(1)";
      img.style.opacity = "1";
      img.style.transition =
        "transform 650ms cubic-bezier(.2,.8,.2,1), opacity 650ms ease";

      document.body.appendChild(img);

      // destino: centro del icono carrito
      const toX = toRect.left + toRect.width / 2;
      const toY = toRect.top + toRect.height / 2;

      // origen: centro de la imagen
      const fromX = fromRect.left + fromRect.width / 2;
      const fromY = fromRect.top + fromRect.height / 2;

      const dx = toX - fromX;
      const dy = toY - fromY;

      // forzar paint y animar
      requestAnimationFrame(() => {
        img.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(0.15)`;
        img.style.opacity = "0.15";
      });

      const cleanup = () => {
        img.removeEventListener("transitionend", cleanup);
        img.remove();
        window.dispatchEvent(new Event("cart:bump")); // tu bump actual
      };
      img.addEventListener("transitionend", cleanup);
    };

    const onFly = (e) => fly(e.detail);
    window.addEventListener("cart:fly", onFly);
    return () => window.removeEventListener("cart:fly", onFly);
  }, []);

  return (
    <header
      className={`main-header ${isHome ? "is-home" : "is-inner"}${
        expanded || hasOpenDesktopMenu ? " expanded" : ""
      }${scrolled ? " scrolled" : ""}`}
      onMouseEnter={() => {
        if (isDesktop()) setExpanded(true);
      }}
      onMouseLeave={() => {
        if (!isDesktop()) return;
        clearTimeout(collapseHdrTimeout.current);
        collapseHdrTimeout.current = setTimeout(() => {
          if (!hasOpenDesktopMenu) setExpanded(false);
        }, 160);
      }}
    >
      <nav ref={navRef} className="navbar navbar-expand-lg">
        <div className="container d-flex align-items-center justify-content-between position-relative">
          {/* Hamburguesa */}
          <button
            ref={togglerRef}
            className={`navbar-toggler ${menuOpen ? "open" : ""}`}
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
          <Link
            className="navbar-brand"
            to="/"
            onClick={() => resetHeaderState()}
          >
            <img src="/imagenes/logo.png" alt="Logo Beliccia" />
          </Link>

          {/* Menú */}
          <div
            ref={collapseRef}
            className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/"
                  onClick={resetHeaderState}
                  aria-label="Inicio"
                >
                  <i className="fas fa-home" aria-hidden="true" style={{ fontSize: "1.05rem" }} />
                </Link>
              </li>

              {/* Colecciones */}
              <li className="nav-item dropdown">
                <button
                  type="button"
                  className="nav-link dropdown-toggle btn-reset-link"
                  id="coleccionesDropdown"
                  aria-expanded="false"
                  onClick={toggleDropdown}
                >
                  Colecciones
                </button>

                <ul
                  className="dropdown-menu"
                  aria-labelledby="coleccionesDropdown"
                >
                  {/* Novias */}
                  <li className="dropdown-submenu dropend">
                    <button
                      type="button"
                      className="dropdown-item dropdown-toggle"
                      aria-expanded="false"
                      onClick={toggleDropdown}
                    >
                      Novias
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to="/novias"
                          onClick={resetHeaderState}
                        >
                          Ver todo
                        </NavLink>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setModalEstilosVisible(true);
                            setMenuOpen(false);
                            closeAllSubmenus();
                          }}
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
                          <li>
                            <NavLink
                              className="dropdown-item"
                              to="/madrinas"
                              onClick={resetHeaderState}
                            >
                              Ver todo
                            </NavLink>
                          </li>
                        </ul>
                      </li>

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
                          <li>
                            <NavLink
                              className="dropdown-item"
                              to="/invitadas"
                              onClick={resetHeaderState}
                            >
                              Ver todo
                            </NavLink>
                          </li>
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
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to="/tocados"
                          onClick={resetHeaderState}
                        >
                          Tocados
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to="/bolsos"
                          onClick={resetHeaderState}
                        >
                          Bolsos
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to="/otros"
                          onClick={resetHeaderState}
                        >
                          Otros
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/conocenos"
                  onClick={resetHeaderState}
                >
                  Conócenos
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/atelier"
                  onClick={resetHeaderState}
                >
                  Atelier
                </NavLink>
              </li>

              {/* Contacto */}
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/visitanos"
                  onClick={resetHeaderState}
                >
                  Contacto
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Iconos */}
          <div className="navbar-icons d-flex ms-auto">
            <Link
              to="/buscar"
              className="icon-link me-2"
              title="Buscar"
              onClick={resetHeaderState}
            >
              <i className="fas fa-search" />
            </Link>
            <Link
              to="/carrito"
              ref={cartIconRef}
              className={`icon-link me-2 ${cartBump ? "is-bumping" : ""}`}
              title="Carrito"
              onClick={resetHeaderState}
            >
              <i className="fas fa-shopping-cart" />
            </Link>

            <Link
              to="/login"
              className="icon-link"
              title="Iniciar sesión"
              onClick={resetHeaderState}
            >
              <i className="fas fa-user" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Backdrop móvil */}
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

      {/* Modal estilos */}
      {modalEstilosVisible && (
        <div
          className="custom-modal-backdrop"
          onClick={() => setModalEstilosVisible(false)}
        >
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="btn-close"
              onClick={() => setModalEstilosVisible(false)}
            >
              &times;
            </button>

            <h4 className="mb-3 text-center">Elige tu estilo</h4>

            <FiltrosEstiloNovia
              onSelect={(slug) => {
                navigate(`/novias?corte=${slug}`);
                setModalEstilosVisible(false);
                resetHeaderState();
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
}

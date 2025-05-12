// src/components/Layout.jsx
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  // Detecta si estamos en la página principal
  const isHomePage = location.pathname === '/';

  // Ajusta este valor a la altura real de tu header
  const headerHeight = '120px';

  return (
    <>
      <Header />
      <main
        className="page-container"
        style={{
          // Aplica padding-top en todas las rutas excepto la principal
          paddingTop: isHomePage ? undefined : headerHeight
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

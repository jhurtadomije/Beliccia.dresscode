import Header from './Header';
import Footer from './Footer'; // Elimina esta línea si no usas Footer
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <Header />

      <main style={{ paddingTop: '10rem' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

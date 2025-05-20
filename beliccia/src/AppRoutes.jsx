// src/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';         // asumiendo que App era tu home
import Novias from './pages/Novias';
import Invitadas from './pages/Invitadas';
import Accesorios from './pages/Accesorios';
import Visitanos from './pages/Visitanos';
import Carrito from './pages/Carrito';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="novias" element={<Novias />} />
        <Route path="invitadas" element={<Invitadas />} />
        {/* Accesorios subdivididos */}
        <Route path="tocados" element={<Accesorios categoria="tocados" />} />
        <Route path="bolsos" element={<Accesorios categoria="bolsos" />} />
        <Route path="pendientes" element={<Accesorios categoria="pendientes" />} />
        <Route path="visitanos" element={<Visitanos />} />
         <Route path="carrito" element={<Carrito />} />
      </Route>
    </Routes>
  );
}

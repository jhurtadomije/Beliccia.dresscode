// src/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Novias from './pages/Novias';
import Madrinas from './pages/Madrinas';
import Invitadas from './pages/Invitadas';
import Accesorios from './pages/Accesorios';
import Visitanos from './pages/Visitanos';
import Carrito from './pages/Carrito';
import ProductoDetalle from './pages/ProductoDetalle';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* Colecciones */}
        <Route path="novias" element={<Novias />} />
        <Route path="madrinas" element={<Madrinas />} />
        <Route path="invitadas" element={<Invitadas />} />

{/* Detalle producto (desde cards de Invitadas/Madrinas) */}
        <Route path="invitadas/:id" element={<ProductoDetalle />} />
        <Route path="madrinas/:id" element={<ProductoDetalle />} />
        {/* Ruta genérica por si quieres enlazar desde otro sitio */}
        <Route path="producto/:id" element={<ProductoDetalle />} />
        {/* Aliases (singular → plural) */}
        <Route path="madrina" element={<Navigate to="/madrinas" replace />} />
        <Route path="invitada" element={<Navigate to="/invitadas" replace />} />

        {/* Accesorios */}
        <Route path="tocados" element={<Accesorios categoria="tocados" />} />
        <Route path="bolsos" element={<Accesorios categoria="bolsos" />} />
        <Route path="pendientes" element={<Accesorios categoria="pendientes" />} />

        <Route path="visitanos" element={<Visitanos />} />
        <Route path="carrito" element={<Carrito />} />

        {/* (Opcional) Detalles: cuando los tengas, crea los componentes y habilita esto
        <Route path="madrinas/:id" element={<MadrinaDetalle />} />
        <Route path="invitadas/:id" element={<InvitadaDetalle />} />
        */}
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

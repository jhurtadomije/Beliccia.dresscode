// src/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Novias from "./pages/Novias";
import Madrinas from "./pages/Madrinas";
import Invitadas from "./pages/Invitadas";
import Accesorios from "./pages/Accesorios";
import Visitanos from "./pages/Visitanos";
import Carrito from "./pages/Carrito";
import ProductoDetalle from "./pages/ProductoDetalle";

// Área privada
import LoginAdmin from "./pages/admin/LoginAdmin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminProductoNuevo from "./pages/admin/AdminProductoNuevo";
import AdminProductoEditar from './pages/admin/AdminProductoEditar'; 

import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas con Layout */}
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
        <Route
          path="otros"
          element={<Accesorios categoria="otros" />}
        />

        <Route path="visitanos" element={<Visitanos />} />
        <Route path="carrito" element={<Carrito />} />
      </Route>

      {/* Área privada dependientas / admin (SIN Layout público) */}
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/productos"
        element={
          <ProtectedRoute requireAdmin>
            <AdminProductos />
          </ProtectedRoute>
        }
      />
      {/* Crear nuevo producto */}
        <Route
          path="admin/productos/nuevo"
          element={
            <ProtectedRoute requireAdmin>
              <AdminProductoNuevo />
            </ProtectedRoute>
          }
        />
        {/* Editar producto */}
        <Route
          path="admin/productos/:slug"
          element={
            <ProtectedRoute requireAdmin>
              <AdminProductoEditar />
            </ProtectedRoute>
          }
        />
      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

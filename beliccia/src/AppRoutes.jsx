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

import Login from "./pages/Login";
import PerfilPedidos from "./pages/perfil/PerfilPedidos";
import PerfilPedidoDetalle from "./pages/perfil/PerfilPedidoDetalle";

import Checkout from "./pages/Checkout";
import CheckoutAuth from "./pages/CheckoutAuth";
import CheckoutRegister from "./pages/CheckoutRegister";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";

import LoginAdmin from "./pages/admin/LoginAdmin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminProductoNuevo from "./pages/admin/AdminProductoNuevo";
import AdminProductoEditar from "./pages/admin/AdminProductoEditar";

import ProtectedRoute from "./components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ TODO lo público bajo Layout (con header/footer) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        {/* Colecciones */}
        <Route path="novias" element={<Novias />} />
        <Route path="madrinas" element={<Madrinas />} />
        <Route path="invitadas" element={<Invitadas />} />

        {/* Detalle producto */}
        <Route path="invitadas/:id" element={<ProductoDetalle />} />
        <Route path="madrinas/:id" element={<ProductoDetalle />} />
        <Route path="producto/:id" element={<ProductoDetalle />} />

        {/* Aliases */}
        <Route path="madrina" element={<Navigate to="/madrinas" replace />} />
        <Route path="invitada" element={<Navigate to="/invitadas" replace />} />

        {/* Accesorios */}
        <Route path="tocados" element={<Accesorios categoria="tocados" />} />
        <Route path="bolsos" element={<Accesorios categoria="bolsos" />} />
        <Route path="otros" element={<Accesorios categoria="otros" />} />

        <Route path="visitanos" element={<Visitanos />} />
        <Route path="carrito" element={<Carrito />} />

        {/* ✅ Login general con header/footer */}
        <Route path="login" element={<Login />} />

        {/* ✅ Perfil usuario */}
        <Route
          path="perfil/pedidos"
          element={
            <ProtectedRoute redirectTo="/login">
              <PerfilPedidos />
            </ProtectedRoute>
          }
        />
        <Route
          path="perfil/pedidos/:id"
          element={
            <ProtectedRoute redirectTo="/login">
              <PerfilPedidoDetalle />
            </ProtectedRoute>
          }
        />

        {/* ✅ Checkout con header/footer */}
        <Route path="checkout/auth" element={<CheckoutAuth />} />
        <Route path="checkout/registro" element={<CheckoutRegister />} />
        <Route path="checkout/success" element={<CheckoutSuccess />} />
        <Route path="checkout/cancel" element={<CheckoutCancel />} />

        <Route
          path="checkout"
          element={
            <ProtectedRoute redirectTo="/checkout/auth">
              <Checkout />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ✅ Admin fuera del Layout público */}
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos"
        element={
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminProductos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos/nuevo"
        element={
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminProductoNuevo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos/:slug"
        element={
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminProductoEditar />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

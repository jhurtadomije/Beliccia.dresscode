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

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PerfilPedidos from "./pages/perfil/PerfilPedidos";
import PerfilPedidoDetalle from "./pages/perfil/PerfilPedidoDetalle";

import Checkout from "./pages/checkout/Checkout";
import CheckoutAuth from "./pages/checkout/CheckoutAuth";
import CheckoutRegister from "./pages/checkout/CheckoutRegister";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess";
import CheckoutCancel from "./pages/checkout/CheckoutCancel";
import PerfilDashboard from "./pages/perfil/PerfilDashboard";
import PerfilCitas from "./pages/perfil/PerfilCitas";
import PerfilCitaDetalle from "./pages/perfil/PerfilCitaDetalle";

import LoginAdmin from "./pages/admin/LoginAdmin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminProductoNuevo from "./pages/admin/AdminProductoNuevo";
import AdminProductoEditar from "./pages/admin/AdminProductoEditar";
import AdminPedidos from "./pages/admin/pedidos/AdminPedidos";
import AdminPedidoDetalle from "./pages/admin/pedidos/AdminPedidoDetalle";
import AdminUsuarios from "./pages/admin/usuarios/AdminUsuarios";
import AdminCitas from "./pages/admin/citas/AdminCitas";
import AdminCitaDetalle from "./pages/admin/citas/AdminCitaDetalle";

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
        <Route path="register" element={<Register />} />

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
        <Route
          path="perfil"
          element={
            <ProtectedRoute redirectTo="/login">
              <PerfilDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="perfil/citas"
          element={
            <ProtectedRoute redirectTo="/login">
              <PerfilCitas />
            </ProtectedRoute>
          }
        />

        <Route
          path="perfil/citas/:id"
          element={
            <ProtectedRoute redirectTo="/login">
              <PerfilCitaDetalle />
            </ProtectedRoute>
          }
        />
        <Route
          path="perfil/citas"
          element={
            <ProtectedRoute redirectTo="/login">
              <PerfilCitas />
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
      <Route
        path="/admin/pedidos"
        element={
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminPedidos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pedidos/:id"
        element={
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminPedidoDetalle />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminUsuarios />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/citas"
        element={
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminCitas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/citas/:id"
        element={
          <ProtectedRoute requireAdmin redirectTo="/admin/login">
            <AdminCitaDetalle />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

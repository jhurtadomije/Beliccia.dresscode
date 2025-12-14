// src/AppRoutes.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Layout from "./components/Layout";
import PageTransition from "./components/PageTransition";

import Home from "./pages/Home";
import Novias from "./pages/Novias";
import Madrinas from "./pages/Madrinas";
import Invitadas from "./pages/Invitadas";
import Accesorios from "./pages/Accesorios";
import Visitanos from "./pages/Visitanos";
import Carrito from "./pages/Carrito";
import ProductoDetalle from "./pages/ProductoDetalle";
import Conocenos from "./pages/Conocenos";
import Atelier from "./pages/Atelier";
import {
  AvisoLegal,
  Privacidad,
  Cookies,
  CondicionesCompra,
  EnviosDevoluciones,
} from "./pages/legal";
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

const wrap = (el) => <PageTransition>{el}</PageTransition>;

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* ✅ TODO lo público bajo Layout (con header/footer) */}
        <Route path="/" element={<Layout />}>
          <Route index element={wrap(<Home />)} />

          {/* Colecciones */}
          <Route path="novias" element={wrap(<Novias />)} />
          <Route path="madrinas" element={wrap(<Madrinas />)} />
          <Route path="invitadas" element={wrap(<Invitadas />)} />

          {/* Detalle producto */}
          <Route path="invitadas/:id" element={wrap(<ProductoDetalle />)} />
          <Route path="madrinas/:id" element={wrap(<ProductoDetalle />)} />
          <Route path="producto/:id" element={wrap(<ProductoDetalle />)} />

          {/* Paginas legales */}
          <Route path="/legal/aviso-legal" element={<AvisoLegal />} />
          <Route path="/legal/privacidad" element={<Privacidad />} />
          <Route path="/legal/cookies" element={<Cookies />} />
          <Route
            path="/legal/condiciones-compra"
            element={<CondicionesCompra />}
          />
          <Route
            path="/legal/envios-devoluciones"
            element={<EnviosDevoluciones />}
          />

          {/* Aliases */}
          <Route path="madrina" element={<Navigate to="/madrinas" replace />} />
          <Route
            path="invitada"
            element={<Navigate to="/invitadas" replace />}
          />

          {/* Accesorios */}
          <Route path="accesorios" element={wrap(<Accesorios />)} />
          <Route
            path="tocados"
            element={wrap(<Accesorios categoria="tocados" />)}
          />
          <Route
            path="bolsos"
            element={wrap(<Accesorios categoria="bolsos" />)}
          />
          <Route
            path="otros"
            element={wrap(<Accesorios categoria="otros" />)}
          />
          {/* Alias */}
          <Route
            path="complementos"
            element={<Navigate to="/accesorios" replace />}
          />

          <Route path="conocenos" element={wrap(<Conocenos />)} />
          <Route path="atelier" element={wrap(<Atelier />)} />

          <Route path="visitanos" element={wrap(<Visitanos />)} />
          <Route path="carrito" element={wrap(<Carrito />)} />

          {/* ✅ Login general con header/footer */}
          <Route path="login" element={wrap(<Login />)} />
          <Route path="register" element={wrap(<Register />)} />

          {/* ✅ Perfil usuario */}
          <Route
            path="perfil/pedidos"
            element={wrap(
              <ProtectedRoute redirectTo="/login">
                <PerfilPedidos />
              </ProtectedRoute>
            )}
          />
          <Route
            path="perfil/pedidos/:id"
            element={wrap(
              <ProtectedRoute redirectTo="/login">
                <PerfilPedidoDetalle />
              </ProtectedRoute>
            )}
          />
          <Route
            path="perfil"
            element={wrap(
              <ProtectedRoute redirectTo="/login">
                <PerfilDashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="perfil/citas"
            element={wrap(
              <ProtectedRoute redirectTo="/login">
                <PerfilCitas />
              </ProtectedRoute>
            )}
          />
          <Route
            path="perfil/citas/:id"
            element={wrap(
              <ProtectedRoute redirectTo="/login">
                <PerfilCitaDetalle />
              </ProtectedRoute>
            )}
          />

          {/* ✅ Checkout con header/footer */}
          <Route path="checkout/auth" element={wrap(<CheckoutAuth />)} />
          <Route
            path="checkout/registro"
            element={wrap(<CheckoutRegister />)}
          />
          <Route path="checkout/success" element={wrap(<CheckoutSuccess />)} />
          <Route path="checkout/cancel" element={wrap(<CheckoutCancel />)} />

          <Route
            path="checkout"
            element={wrap(
              <ProtectedRoute redirectTo="/checkout/auth">
                <Checkout />
              </ProtectedRoute>
            )}
          />
        </Route>

        {/* ✅ Admin fuera del Layout público */}
        <Route path="/admin/login" element={wrap(<LoginAdmin />)} />
        <Route
          path="/admin"
          element={wrap(
            <ProtectedRoute requireAdmin redirectTo="/admin/login">
              <AdminDashboard />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/productos"
          element={wrap(
            <ProtectedRoute requireAdmin redirectTo="/admin/login">
              <AdminProductos />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/productos/nuevo"
          element={wrap(
            <ProtectedRoute requireAdmin redirectTo="/admin/login">
              <AdminProductoNuevo />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/productos/:slug"
          element={wrap(
            <ProtectedRoute requireAdmin redirectTo="/admin/login">
              <AdminProductoEditar />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/pedidos"
          element={wrap(
            <ProtectedRoute requireAdmin redirectTo="/admin/login">
              <AdminPedidos />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/pedidos/:id"
          element={wrap(
            <ProtectedRoute requireAdmin redirectTo="/admin/login">
              <AdminPedidoDetalle />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/usuarios"
          element={wrap(
            <ProtectedRoute requireAdmin redirectTo="/admin/login">
              <AdminUsuarios />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/citas"
          element={wrap(
            <ProtectedRoute requireAdmin redirectTo="/admin/login">
              <AdminCitas />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin/citas/:id"
          element={wrap(
            <ProtectedRoute requireAdmin redirectTo="/admin/login">
              <AdminCitaDetalle />
            </ProtectedRoute>
          )}
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

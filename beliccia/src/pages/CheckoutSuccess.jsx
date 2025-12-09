import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const navigate = useNavigate();

  const { fetchCart, clearCart } = useCart();
  const { logout } = useAuth();

  // Refs para evitar dependencias en el effect principal
  const fetchRef = useRef(fetchCart);
  const clearRef = useRef(clearCart);
  const logoutRef = useRef(logout);

  // Mantener refs actualizadas
  useEffect(() => {
    fetchRef.current = fetchCart;
    clearRef.current = clearCart;
    logoutRef.current = logout;
  }, [fetchCart, clearCart, logout]);

  const [loading, setLoading] = useState(true);
  const [pedido, setPedido] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [err, setErr] = useState(null);

  const loadPedidoById = useCallback(async (pedidoId) => {
    if (!pedidoId) return null;
    try {
      const res = await api.get(`/pedidos/${pedidoId}`);
      return res.data || null;
    } catch {
      // 403/401 no deben romper success page
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const safe = (fn) => !cancelled && fn();

    const run = async () => {
      if (!sessionId) {
        safe(() => {
          setErr("Falta session_id.");
          setLoading(false);
        });
        return;
      }

      safe(() => {
        setLoading(true);
        setErr(null);
      });

      let sessionData = null;
      let pedidoData = null;

      try {
        // ✅ ruta real
        const { data } = await api.get("/pagos/verificar", {
          params: { session_id: sessionId },
        });

        sessionData = data || null;

        const pid =
          Number(data?.metadata?.pedido_id) ||
          Number(data?.pago?.pedido_id) ||
          null;

        if (pid) {
          pedidoData = await loadPedidoById(pid);
        }
      } catch (e) {
        safe(() => {
          setErr(
            e?.response?.data?.message ||
              e?.message ||
              "No se pudo verificar la sesión de pago."
          );
        });
      }

      safe(() => {
        setSessionInfo(sessionData);
        setPedido(pedidoData);
      });

      // ✅ sincronizar UI del carrito sin bloquear success
      try {
        await fetchRef.current?.();
        clearRef.current?.();
      } catch {
        // silencioso
      }

      safe(() => setLoading(false));
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [sessionId, loadPedidoById]);

  const handleLogout = useCallback(async () => {
    try {
      // 1) cerrar sesión auth
      logoutRef.current?.();

      // 2) limpiar sesión de carrito invitado para evitar "arrastres"
      try {
        localStorage.removeItem("beliccia_cart_session_id");
      } catch {}

      // 3) refrescar UI
      try {
        await fetchRef.current?.();
      } catch {}

      // 4) redirigir
      navigate("/", { replace: true });
    } catch {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="container py-5">
        <h2>Confirmando tu pedido...</h2>
        <p className="text-muted mb-0">
          Estamos validando el pago con la pasarela.
        </p>
      </div>
    );
  }

  const pedidoIdFromSession =
    Number(sessionInfo?.metadata?.pedido_id) || null;

  // Si falló todo lo “rico”
  if (err && !sessionInfo && !pedido) {
    return (
      <div className="container py-5">
        <h2>Pago completado</h2>
        <p className="text-muted">
          Hemos recibido la confirmación del pago, pero no hemos podido cargar
          la información completa en este momento.
        </p>
        <p className="text-danger">{err}</p>

        <div className="d-flex gap-2">
          <Link to="/perfil/pedidos" className="btn btn-dark">
            Ver mis pedidos
          </Link>
          <Link to="/" className="btn btn-outline-dark">
            Volver a inicio
          </Link>
          <button onClick={handleLogout} className="btn btn-outline-secondary">
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-3">¡Pago realizado con éxito!</h2>

      <p className="text-muted">
        Tu pedido ha sido registrado correctamente. Si el estado tarda unos
        segundos en actualizarse, no te preocupes: la confirmación final se
        completa mediante webhook.
      </p>

      {err && (
        <div className="alert alert-warning">
          <div className="fw-semibold">Información parcial</div>
          <div className="small">{err}</div>
        </div>
      )}

      {(pedido || pedidoIdFromSession) && (
        <div className="card p-3 mb-4">
          <div>
            <strong>Nº Pedido:</strong>{" "}
            {pedido?.numero_pedido || pedido?.id || pedidoIdFromSession}
          </div>

          {pedido && (
            <>
              <div>
                <strong>Estado:</strong> {pedido.estado}
              </div>
              <div>
                <strong>Pago:</strong> {pedido.estado_pago}
              </div>
              <div>
                <strong>Total:</strong> {pedido.total} €
              </div>
            </>
          )}

          {!pedido && pedidoIdFromSession && (
            <div className="text-muted small mt-1">
              El detalle del pedido puede tardar en asociarse a tu cuenta.
            </div>
          )}
        </div>
      )}

      <div className="d-flex gap-2">
        <Link to="/perfil/pedidos" className="btn btn-dark">
          Ver mis pedidos
        </Link>
        <Link to="/" className="btn btn-outline-dark">
          Volver a inicio
        </Link>
        <button onClick={handleLogout} className="btn btn-outline-secondary">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

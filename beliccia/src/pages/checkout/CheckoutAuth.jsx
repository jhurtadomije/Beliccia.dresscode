import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import GoogleButton from "../../components/GoogleButton";

export default function CheckoutAuth() {
  const { login, loginWithGoogle, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Ruta destino segura
  const from = location.state?.from || "/checkout";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [merging, setMerging] = useState(false);

  const doMerge = async () => {
    try {
      setMerging(true);
      await api.post("/carrito/merge");
    } catch (error) {
      // no bloqueamos el flujo
      console.warn("Merge carrito falló:", error?.response?.data || error);
    } finally {
      setMerging(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    let res;
    try {
      res = await login(email, password);
    } catch (error) {
      setErr(
        error?.response?.data?.message ||
          error?.message ||
          "No se pudo iniciar sesión."
      );
      return;
    }

    if (!res?.ok) {
      setErr(res?.message || "No se pudo iniciar sesión.");
      return;
    }

    // ✅ Asegurar token en axios ANTES del merge
    // Intentamos obtenerlo del resultado del login o del storage
    const token =
      res?.token ||
      res?.data?.token || // por si tu login devuelve otra forma
      localStorage.getItem("token");

    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    // ✅ merge invitado -> usuario (no bloqueante)
    try {
      setMerging(true);

      // Si hay token, lo mandamos explícito para evitar carreras
      await api.post(
        "/carrito/merge",
        null,
        token
          ? {
              headers: { Authorization: `Bearer ${token}` },
            }
          : undefined
      );
    } catch (error) {
      // No bloqueamos el flujo por un merge fallido,
      // pero dejamos rastro útil para debug
      console.warn(
        "Merge carrito falló:",
        error?.response?.data || error?.message || error
      );
    } finally {
      setMerging(false);
    }

    navigate(from, { replace: true });
  };

  const handleGoogle = async (credential) => {
    setErr("");

    const res = await loginWithGoogle(credential);
    if (!res?.ok) {
      setErr(res?.message || "No se pudo iniciar sesión con Google.");
      return;
    }

    await doMerge();
    navigate(from, { replace: true });
  };

  const disabled = authLoading || merging;

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 520 }}>
        <h2 className="mb-3 text-center">Inicia sesión para finalizar</h2>

        {err && <div className="alert alert-danger">{err}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button className="btn btn-dark w-100" disabled={disabled}>
            {disabled ? "Accediendo..." : "Entrar y continuar"}
          </button>

          <div className="text-center my-3 text-muted small">o</div>

          <div className="d-flex justify-content-center">
            <GoogleButton onCredential={handleGoogle} />
          </div>
        </form>

        {/* ✅ CTA registro */}
        <div className="text-center mt-3">
          <small className="text-muted">
            ¿No tienes cuenta?{" "}
            <Link to="/checkout/registro" state={{ from }}>
              Crear cuenta
            </Link>
          </small>
        </div>

        {/* ✅ mini salida elegante */}
        <div className="text-center mt-2">
          <small>
            <Link to="/carrito">Volver al carrito</Link>
          </small>
        </div>
      </div>
    </section>
  );
}

// src/pages/auth/Login.jsx  (ajusta ruta real)
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import GoogleButton from "../../components/GoogleButton";

export default function Login() {
  const { login, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/perfil/pedidos";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login(email, password);
    if (!res?.ok) {
      setError(res?.message || "No se pudo iniciar sesión.");
      return;
    }

    navigate(from, { replace: true });
  };

  const handleGoogle = async (credential) => {
    setError("");
    const res = await loginWithGoogle(credential);
    if (!res?.ok) {
      setError(res?.message || "Error con Google.");
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 520 }}>
        <h2 className="mb-3 text-center">Iniciar sesión</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
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

          <button className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Accediendo..." : "Entrar"}
          </button>

          <div className="text-center my-3 text-muted small">
            o
          </div>

          <div className="d-flex justify-content-center">
            <GoogleButton onCredential={handleGoogle} />
          </div>
        </form>

        <div className="text-center mt-3">
          <small>
            ¿No tienes cuenta?{" "}
            <Link to="/register" state={{ from }}>
              Crear cuenta
            </Link>
          </small>
        </div>
      </div>
    </section>
  );
}

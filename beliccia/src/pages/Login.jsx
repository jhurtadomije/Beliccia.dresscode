// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // destino seguro
  const from = location.state?.from || "/perfil/pedidos";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const res = await login(email, password);

    if (!res?.ok) {
      setErr(res?.message || "No se pudo iniciar sesión.");
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 520 }}>
        <h2 className="mb-3 text-center">Iniciar sesión</h2>

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

          <button className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Accediendo..." : "Entrar"}
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" state={{ from }}>
              Crear cuenta
            </Link>
          </small>
        </div>
      </div>
    </section>
  );
}

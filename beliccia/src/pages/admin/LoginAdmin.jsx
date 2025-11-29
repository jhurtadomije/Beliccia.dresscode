// src/pages/admin/LoginAdmin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginAdmin() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const { ok, message } = await login(email, password);

    if (!ok) {
      setError(message || "Error al iniciar sesión");
      return;
    }

    // Si todo OK, nos vamos al panel
    navigate("/admin");
  }

  return (
    <section className="py-5" style={{ minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: 480 }}>
        <h2 className="mb-4 text-center">Área privada</h2>
        <p className="text-muted text-center mb-4">
          Acceso exclusivo para el equipo de Beliccia.
        </p>

        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          {error && (
            <div className="alert alert-danger py-2 text-center">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@beliccia.es"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={loading}
          >
            {loading ? "Accediendo…" : "Entrar"}
          </button>
        </form>
      </div>
    </section>
  );
}

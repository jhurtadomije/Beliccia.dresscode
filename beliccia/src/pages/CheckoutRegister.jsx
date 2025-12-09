// src/pages/CheckoutRegister.jsx
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function CheckoutRegister() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/checkout";

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    password: "",
  });

  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await register(form);

    if (!res?.ok) {
      setError(res?.message || "No se pudo completar el registro.");
      return;
    }

    // ✅ merge carrito invitado -> usuario recién creado
    try {
      await api.post("/carrito/merge");
    } catch {
      console.warn("Merge carrito falló");
    }

    navigate(from, { replace: true });
  };

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 560 }}>
        <h2 className="text-center mb-4">Crear cuenta</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={onSubmit}>
          <input
            className="form-control mb-2"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={onChange}
            required
          />
          <input
            className="form-control mb-2"
            name="apellidos"
            placeholder="Apellidos"
            value={form.apellidos}
            onChange={onChange}
          />
          <input
            className="form-control mb-2"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
          />
          <input
            className="form-control mb-2"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={onChange}
          />
          <input
            className="form-control mb-3"
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={onChange}
            required
            minLength={6}
          />

          <button className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrarme y continuar"}
          </button>
        </form>

        <div className="mt-3 text-center">
          <small>
            ¿Ya tienes cuenta?{" "}
            <Link to="/checkout/auth" state={{ from }}>
              Inicia sesión
            </Link>
          </small>
        </div>
      </div>
    </section>
  );
}

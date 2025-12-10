// src/pages/checkout/CheckoutRegister.jsx
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import GoogleButton from "../../components/GoogleButton";

export default function CheckoutRegister() {
  const { register, loginWithGoogle, loading } = useAuth();
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
  const [merging, setMerging] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const doMerge = async () => {
    try {
      setMerging(true);
      await api.post("/carrito/merge");
    } catch (e) {
      console.warn("Merge carrito falló:", e?.response?.data || e);
    } finally {
      setMerging(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await register(form);

    if (!res?.ok) {
      setError(res?.message || "No se pudo completar el registro.");
      return;
    }

    await doMerge();
    navigate(from, { replace: true });
  };

  const handleGoogle = async (credential) => {
    setError("");

    const res = await loginWithGoogle(credential);
    if (!res?.ok) {
      setError(res?.message || "No se pudo registrar con Google.");
      return;
    }
    (await res?.ok) && (await new Promise((r) => setTimeout(r, 50)));
    await doMerge();
    navigate(from, { replace: true });
  };

  const disabled = loading || merging;

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 560 }}>
        <h2 className="text-center mb-4">Crear cuenta</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={onSubmit} className="card p-4 shadow-sm">
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
            autoComplete="email"
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
            autoComplete="new-password"
          />

          <button className="btn btn-dark w-100" disabled={disabled}>
            {disabled ? "Creando cuenta..." : "Registrarme y continuar"}
          </button>

          <div className="text-center my-3 text-muted small">o</div>

          <div className="d-flex justify-content-center">
            <GoogleButton onCredential={handleGoogle} text="signup_with" />
          </div>
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

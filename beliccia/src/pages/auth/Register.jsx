// src/pages/auth/Register.jsx
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // si vienes de ProtectedRoute guardando from:
  const from = location.state?.from || "/perfil/pedidos";

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

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

    // ✅ en lugar de navegar directo, abrimos modal
    setSuccessOpen(true);
  };

  const goPanel = () => {
    setSuccessOpen(false);
    navigate(from, { replace: true });
  };

  const goHome = () => {
    setSuccessOpen(false);
    navigate("/", { replace: true });
  };

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
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Creando cuenta...
              </>
            ) : (
              "Registrarme"
            )}
          </button>
        </form>

        <div className="mt-3 text-center">
          <small>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </small>
        </div>
      </div>

      {/* ✅ Modal simple sin depender del JS de Bootstrap */}
      {successOpen && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,.5)" }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¡Cuenta creada!</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSuccessOpen(false)}
                />
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Tu usuario ha sido creado correctamente. Ya puedes acceder a tu
                  panel para ver tus pedidos y su estado.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-dark" onClick={goHome}>
                  Volver a inicio
                </button>
                <button className="btn btn-dark" onClick={goPanel}>
                  Ir a mis pedidos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

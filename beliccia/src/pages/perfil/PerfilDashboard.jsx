// src/pages/perfil/PerfilDashboard.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PerfilDashboard() {
  const { user, logout } = useAuth();

  return (
    <section className="py-5" style={{ minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Mi cuenta</h2>
            <p className="text-muted mb-0">
              Hola, <strong>{user?.nombre || user?.name || user?.email}</strong>
            </p>
          </div>

          <button className="btn btn-outline-dark" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">Mis pedidos</h5>
                <p className="card-text flex-grow-1">
                  Consulta tu historial de compra y el estado de tus pedidos.
                </p>
                <Link to="/perfil/pedidos" className="btn btn-dark mt-2">
                  Ver mis pedidos
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">Mis citas</h5>
                <p className="card-text flex-grow-1">
                  Revisa tus solicitudes y la fecha asignada cuando sea confirmada.
                </p>
                <Link to="/perfil/citas" className="btn btn-outline-dark mt-2">
                  Ver mis citas
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-2">Resumen</h5>
            <p className="text-muted mb-0">
              Desde aquí puedes ver tus pedidos y el estado de tus citas.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Link to="/" className="btn btn-outline-dark">
            Volver a inicio
          </Link>
        </div>
      </div>
    </section>
  );
}

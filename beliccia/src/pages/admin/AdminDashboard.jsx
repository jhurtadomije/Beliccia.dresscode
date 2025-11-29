// src/pages/AdminDashboard.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <section className="py-5" style={{ minHeight: "80vh" }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Panel de administración</h2>
            <p className="text-muted mb-0">
              Bienvenida,{" "}
              <strong>{user?.nombre || user?.name || user?.email}</strong>
            </p>
          </div>
          <button className="btn btn-outline-dark" onClick={logout}>
            Cerrar sesión
          </button>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">Catálogo</h5>
                <p className="card-text flex-grow-1">
                  Gestiona los productos, fotos, descripción, precios y
                  disponibilidad online.
                </p>
                <Link to="/admin/productos" className="btn btn-dark mt-2">
                  Gestionar catálogo
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">Pedidos</h5>
                <p className="card-text flex-grow-1">
                  Revisa pedidos de clientes, estados y seguimiento.
                </p>
                <button className="btn btn-outline-secondary mt-2" disabled>
                  Próximamente
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">Clientes</h5>
                <p className="card-text flex-grow-1">
                  Listado de clientas registradas y sus datos básicos.
                </p>
                <button className="btn btn-outline-secondary mt-2" disabled>
                  Próximamente
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Aquí más adelante podemos poner métricas/resumen rápido */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">Resumen rápido</h5>
            <p className="text-muted mb-0">
              Desde aquí podrás gestionar el catálogo, los pedidos y la
              información de tus clientas. De momento, empieza por{" "}
              <strong>“Gestionar catálogo”</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

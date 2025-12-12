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
                <Link to="/admin/pedidos" className="btn btn-dark me-2">
                  Gestionar pedidos
                </Link>
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
                <Link to="/admin/usuarios" className="btn btn-outline-dark">
                  Gestionar usuarios
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Citas</h5>
              <p className="card-text flex-grow-1">
                Gestiona solicitudes de cita e información, confirmaciones y
                notas internas.
              </p>
              <Link to="/admin/citas" className="btn btn-dark mt-2">
                Gestionar citas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// AdminCitas.jsx (ajuste de listado: fecha_confirmada en vez de fecha_solicitada)
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../../services/api";

export default function AdminCitas() {
  const [params, setParams] = useSearchParams();
  const estado = params.get("estado") || "";
  const tipo = params.get("tipo") || "";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [citas, setCitas] = useState([]);

  const query = useMemo(
    () => ({
      estado: estado || undefined,
      tipo: tipo || undefined,
    }),
    [estado, tipo]
  );

  useEffect(() => {
    let cancel = false;

    const run = async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await api.get("/citas", { params: query }); // admin -> todas
        if (cancel) return;
        setCitas(data?.data || []);
      } catch (e) {
        if (cancel) return;
        setErr(e?.response?.data?.error || "No se pudieron cargar las citas.");
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    run();
    return () => (cancel = true);
  }, [query]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  return (
    <section className="py-4">
      <div className="container" style={{ maxWidth: 1200 }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h2 className="mb-1">Citas</h2>
            <div className="text-muted small">
              Gestión de solicitudes (cita / info)
            </div>
          </div>

          <div className="d-flex gap-2">
            <select
              className="form-select"
              style={{ minWidth: 170 }}
              value={tipo}
              onChange={(e) => setFilter("tipo", e.target.value)}
            >
              <option value="">Todos los tipos</option>
              <option value="cita">Cita</option>
              <option value="info">Info</option>
            </select>

            <select
              className="form-select"
              style={{ minWidth: 190 }}
              value={estado}
              onChange={(e) => setFilter("estado", e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="rechazada">Rechazada</option>
              <option value="completada">Completada</option>
            </select>

            <Link to="/admin" className="btn btn-outline-dark">
              Volver al dashboard
            </Link>
          </div>
        </div>

        {loading && (
          <div className="alert alert-light border">Cargando citas...</div>
        )}
        {!loading && err && <div className="alert alert-danger">{err}</div>}

        {!loading && !err && !citas.length && (
          <div className="alert alert-light border">
            No hay citas con esos filtros.
          </div>
        )}

        {!loading && !err && citas.length > 0 && (
          <div className="card">
            <div className="table-responsive">
              <table className="table mb-0 align-middle">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Cliente</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Fecha asignada</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <strong>{c.id}</strong>
                      </td>
                      <td>{c.tipo}</td>
                      <td>{c.estado}</td>
                      <td>{c.nombre}</td>
                      <td className="text-muted small">{c.email}</td>
                      <td className="text-muted small">{c.telefono || "-"}</td>

                      {/* ✅ fecha_confirmada en listado */}
                      <td className="text-muted small">
                        {c.fecha_confirmada ? (
                          new Date(c.fecha_confirmada).toLocaleString("es-ES")
                        ) : (
                          <span className="badge text-bg-light border">
                            Sin asignar
                          </span>
                        )}
                      </td>

                      <td className="text-end">
                        <Link
                          to={`/admin/citas/${c.id}`}
                          className="btn btn-sm btn-dark"
                        >
                          Ver / Gestionar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

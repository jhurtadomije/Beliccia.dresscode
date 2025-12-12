import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const badgeClassByEstado = (estado) => {
  switch (String(estado || "").toLowerCase()) {
    case "confirmada":
      return "badge text-bg-success";
    case "rechazada":
      return "badge text-bg-danger";
    case "completada":
      return "badge text-bg-secondary";
    case "pendiente":
    default:
      return "badge text-bg-warning";
  }
};

const labelTipo = (tipo) =>
  String(tipo || "").toLowerCase() === "cita" ? "Cita" : "Info";

export default function PerfilCitas() {
  const { user, logout } = useAuth();

  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page") || 1));
  const estado = params.get("estado") || "";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [citas, setCitas] = useState([]);
  const [meta, setMeta] = useState(null);

  const query = useMemo(
    () => ({
      page,
      limit: 10,
      estado: estado || undefined,
    }),
    [page, estado]
  );

  useEffect(() => {
    let cancel = false;

    const run = async () => {
      try {
        setLoading(true);
        setErr("");

        const { data } = await api.get("/citas", { params: query });

        if (cancel) return;

        setCitas(data?.data || []);
        setMeta(data?.meta || null);
      } catch (e) {
        if (cancel) return;
        setErr(
          e?.response?.data?.message || "No se pudieron cargar tus citas."
        );
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    run();
    return () => {
      cancel = true;
    };
  }, [query]);

  const setEstado = (nextEstado) => {
    const next = new URLSearchParams(params);
    next.set("page", "1");
    if (nextEstado) next.set("estado", nextEstado);
    else next.delete("estado");
    setParams(next);
  };

  const goPage = (p) => {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    if (estado) next.set("estado", estado);
    setParams(next);
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <div>
            <h2 className="mb-1">Mis citas</h2>
            <div className="text-muted small">
              {user?.nombre ? `Hola, ${user.nombre}` : "Tu historial de citas"}
            </div>
          </div>

          <div className="d-flex gap-2">
            <select
              className="form-select"
              style={{ minWidth: 180 }}
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="rechazada">Rechazada</option>
              <option value="completada">Completada</option>
            </select>

            <button
              className="btn btn-outline-dark"
              onClick={logout}
              title="Cerrar sesión"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {loading && (
          <div className="alert alert-light border">Cargando citas...</div>
        )}

        {!loading && err && <div className="alert alert-danger">{err}</div>}

        {!loading && !err && !citas.length && (
          <div className="alert alert-light border">
            Aún no tienes citas registradas.
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
                    <th>Fecha asignada</th>
                    <th>Creada</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <strong>{c.id}</strong>
                      </td>

                      <td>{labelTipo(c.tipo)}</td>

                      <td>
                        <span className={badgeClassByEstado(c.estado)}>
                          {c.estado || "pendiente"}
                        </span>
                      </td>

                      <td className="text-muted small">
                        {c.fecha_confirmada
                          ? new Date(c.fecha_confirmada).toLocaleString("es-ES")
                          : "Pendiente de asignar"}
                      </td>

                      <td className="text-muted small">
                        {c.created_at
                          ? new Date(c.created_at).toLocaleDateString("es-ES")
                          : "-"}
                      </td>

                      <td className="text-end">
                        <Link
                          to={`/perfil/citas/${c.id}`}
                          className="btn btn-sm btn-dark"
                        >
                          Ver detalle
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Paginación simple */}
        {meta?.lastPage > 1 && (
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button
              className="btn btn-outline-dark"
              disabled={page <= 1}
              onClick={() => goPage(page - 1)}
            >
              Anterior
            </button>

            <span className="align-self-center small text-muted">
              Página {meta.page} de {meta.lastPage}
            </span>

            <button
              className="btn btn-outline-dark"
              disabled={page >= meta.lastPage}
              onClick={() => goPage(page + 1)}
            >
              Siguiente
            </button>
          </div>
        )}

        <div className="mt-4">
          <Link to="/" className="btn btn-outline-dark">
            Volver a inicio
          </Link>
        </div>
      </div>
    </section>
  );
}

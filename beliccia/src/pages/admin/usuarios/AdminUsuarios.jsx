// src/pages/admin/AdminUsuarios.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";

const ROLES = ["cliente", "dependienta", "admin"];

export default function AdminUsuarios() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page: 1, perPage: 12, lastPage: 1, total: 0 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const params = useMemo(() => {
    const p = { page, limit };
    if (q?.trim()) p.q = q.trim();
    return p;
  }, [page, q]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/usuarios", { params });

      // Esperado: { ok:true, data:[...], meta:{...} }
      const usuarios = res.data?.data || res.data?.usuarios || [];
      const m = res.data?.meta || {};

      setData(usuarios);
      setMeta({
        page: Number(m.page || page),
        perPage: Number(m.perPage || limit),
        lastPage: Number(m.lastPage || 1),
        total: Number(m.total || usuarios.length),
      });
    } catch (e) {
      setError(e?.response?.data?.message || "No se pudieron cargar usuarios.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const toggleActivo = async (user) => {
    const next = !user.activo;

    // Optimista
    setData((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, activo: next } : u))
    );

    try {
      await api.put(`/usuarios/${user.id}`, { activo: next });
    } catch (e) {
      console.warn("No se pudo cambiar activo", e);
      await load();
    }
  };

  const changeRol = async (userId, rol) => {
    setData((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, rol } : u))
    );

    try {
      await api.put(`/usuarios/${userId}`, { rol });
    } catch (e) {
      console.warn("No se pudo cambiar rol", e);
      await load();
    }
  };

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(meta.lastPage || 1, p + 1));

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="mb-1">Usuarios</h2>
          <div className="text-muted small">
            Gestión de cuentas registradas
          </div>
        </div>

        <div className="d-flex gap-2">
          <Link to="/admin" className="btn btn-outline-dark">
            Volver al dashboard
          </Link>
        </div>
      </div>

      <form onSubmit={onSearch} className="card p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-8">
            <label className="form-label">Buscar</label>
            <input
              className="form-control"
              placeholder="Email, nombre..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4 d-flex gap-2">
            <button className="btn btn-dark flex-grow-1" disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </button>
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => { setQ(""); setPage(1); }}
              disabled={loading}
            >
              Limpiar
            </button>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 80 }}>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Activo</th>
                <th style={{ width: 160 }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading && !data.length && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-muted">
                    Cargando usuarios...
                  </td>
                </tr>
              )}

              {!loading && !data.length && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-muted">
                    No hay usuarios.
                  </td>
                </tr>
              )}

              {data.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>
                    <div className="fw-semibold">
                      {u.nombre} {u.apellidos || ""}
                    </div>
                    {u.provider === "google" && (
                      <div className="small text-muted">Google</div>
                    )}
                  </td>
                  <td>{u.email}</td>
                  <td>{u.telefono || "-"}</td>
                  <td style={{ minWidth: 160 }}>
                    <select
                      className="form-select form-select-sm"
                      value={u.rol || "cliente"}
                      onChange={(e) => changeRol(u.id, e.target.value)}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`badge bg-${u.activo ? "success" : "secondary"}`}>
                      {u.activo ? "Sí" : "No"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-dark"
                        onClick={() => toggleActivo(u)}
                      >
                        {u.activo ? "Desactivar" : "Activar"}
                      </button>

                      {/* Extra opcional: acceso directo a pedidos filtrados */}
                      <Link
                        to={`/admin/pedidos?usuario_id=${u.id}`}
                        className="btn btn-sm btn-outline-dark"
                      >
                        Pedidos
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-footer d-flex justify-content-between align-items-center">
          <div className="small text-muted">
            Total: {meta.total}
          </div>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-sm btn-outline-dark" onClick={goPrev} disabled={page <= 1 || loading}>
              Anterior
            </button>
            <span className="small">
              Página <strong>{meta.page}</strong> de <strong>{meta.lastPage}</strong>
            </span>
            <button className="btn btn-sm btn-outline-dark" onClick={goNext} disabled={page >= meta.lastPage || loading}>
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

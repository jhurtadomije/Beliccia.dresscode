// src/pages/admin/pedidos/AdminPedidos.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";

const ESTADOS_PEDIDO = [
  { value: "", label: "Todos" },
  { value: "pendiente", label: "Pendiente" },
  { value: "preparando", label: "En preparación" },
  { value: "enviado", label: "Enviado" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
];

const ESTADOS_PAGO = [
  { value: "pendiente", label: "Pendiente" },
  { value: "pagado", label: "Pagado" },
  { value: "fallido", label: "Fallido" },
  { value: "reembolsado", label: "Reembolsado" },
];

function Badge({ kind = "secondary", children }) {
  return <span className={`badge bg-${kind}`}>{children}</span>;
}

function estadoBadge(estado) {
  const e = String(estado || "").toLowerCase();
  if (e === "pendiente") return "secondary";
  if (e === "preparando") return "warning";
  if (e === "enviado") return "info";
  if (e === "entregado") return "success";
  if (e === "cancelado") return "danger";
  return "dark";
}

function pagoBadge(estado) {
  const e = String(estado || "").toLowerCase();
  if (e === "pagado") return "success";
  if (e === "pendiente") return "warning";
  if (e === "fallido") return "danger";
  if (e === "reembolsado") return "info";
  return "secondary";
}

export default function AdminPedidos() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ page: 1, perPage: 12, lastPage: 1, total: 0 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filtros
  const [estado, setEstado] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const params = useMemo(() => {
    const p = { page, limit };
    if (estado) p.estado = estado;
    if (usuarioId) p.usuario_id = usuarioId;
    return p;
  }, [page, estado, usuarioId]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/pedidos", { params });

      // Esperado: { ok:true, data:[...], meta:{...} }
      const pedidos = res.data?.data || res.data?.pedidos || [];
      const m = res.data?.meta || {};

      setData(pedidos);
      setMeta({
        page: Number(m.page || page),
        perPage: Number(m.perPage || limit),
        lastPage: Number(m.lastPage || 1),
        total: Number(m.total || pedidos.length),
      });
    } catch (e) {
      setError(e?.response?.data?.message || "No se pudieron cargar los pedidos.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const quickUpdateEstado = async (pedidoId, nextEstado) => {
    try {
      // Optimista
      setData((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: nextEstado } : p))
      );

      await api.put(`/pedidos/${pedidoId}`, { estado: nextEstado });

      // Si quieres ultra seguro:
      // await load();
    } catch (e) {
      console.warn("No se pudo actualizar estado", e);
      await load();
    }
  };

  const quickUpdatePago = async (pedidoId, nextEstadoPago) => {
    try {
      setData((prev) =>
        prev.map((p) =>
          p.id === pedidoId ? { ...p, estado_pago: nextEstadoPago } : p
        )
      );

      await api.put(`/pedidos/${pedidoId}`, { estado_pago: nextEstadoPago });
    } catch (e) {
      console.warn("No se pudo actualizar estado de pago", e);
      await load();
    }
  };

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(meta.lastPage || 1, p + 1));

  const onApplyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const onClearFilters = () => {
    setEstado("");
    setUsuarioId("");
    setPage(1);
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="mb-1">Pedidos</h2>
          <div className="text-muted small">
            Gestión de pedidos y estados
          </div>
        </div>

        <div className="d-flex gap-2">
          <Link to="/admin" className="btn btn-outline-dark">
            Volver al dashboard
          </Link>
        </div>
      </div>

      <form onSubmit={onApplyFilters} className="card p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label">Estado pedido</label>
            <select
              className="form-select"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              {ESTADOS_PEDIDO.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label className="form-label">Usuario ID (opcional)</label>
            <input
              className="form-control"
              placeholder="Ej: 4"
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-4 d-flex gap-2">
            <button className="btn btn-dark flex-grow-1" disabled={loading}>
              {loading ? "Filtrando..." : "Aplicar filtros"}
            </button>
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={onClearFilters}
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
                <th>Nº Pedido</th>
                <th>Usuario</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Pago</th>
                <th style={{ width: 160 }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {loading && !data.length && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-muted">
                    Cargando pedidos...
                  </td>
                </tr>
              )}

              {!loading && !data.length && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-muted">
                    No hay pedidos con estos filtros.
                  </td>
                </tr>
              )}

              {data.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <div className="fw-semibold">
                      {p.numero_pedido || `BEL-${p.id}`}
                    </div>
                    <div className="text-muted small">
                      {p.created_at || p.fecha_creacion || ""}
                    </div>
                  </td>
                  <td>{p.usuario_id ?? "-"}</td>
                  <td>{Number(p.total || 0).toFixed(2)} €</td>

                  <td>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <Badge kind={estadoBadge(p.estado)}>{p.estado}</Badge>

                      <select
                        className="form-select form-select-sm"
                        style={{ width: 160 }}
                        value={p.estado || "pendiente"}
                        onChange={(e) => quickUpdateEstado(p.id, e.target.value)}
                      >
                        {ESTADOS_PEDIDO.filter((x) => x.value).map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  <td>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <Badge kind={pagoBadge(p.estado_pago)}>{p.estado_pago}</Badge>
                      <select
                        className="form-select form-select-sm"
                        style={{ width: 150 }}
                        value={p.estado_pago || "pendiente"}
                        onChange={(e) => quickUpdatePago(p.id, e.target.value)}
                      >
                        {ESTADOS_PAGO.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/admin/pedidos/${p.id}`}
                        className="btn btn-sm btn-outline-dark"
                      >
                        Ver
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

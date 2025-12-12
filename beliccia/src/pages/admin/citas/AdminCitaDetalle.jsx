import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";

const toInputDateTime = (mysqlDt) => {
  if (!mysqlDt) return "";
  const d = new Date(mysqlDt);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

export default function AdminCitaDetalle() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const [cita, setCita] = useState(null);

  // form
  const [estado, setEstado] = useState("pendiente");
  const [fechaConfirmada, setFechaConfirmada] = useState("");
  const [notaInterna, setNotaInterna] = useState("");

  useEffect(() => {
    let cancel = false;

    const run = async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await api.get(`/citas/${id}`);
        if (cancel) return;

        const c = data?.data || null;
        setCita(c);

        setEstado(c?.estado || "pendiente");
        setFechaConfirmada(toInputDateTime(c?.fecha_confirmada));
        setNotaInterna(c?.nota_interna || "");
      } catch (e) {
        if (cancel) return;
        setErr(e?.response?.data?.error || "No se pudo cargar la cita.");
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    run();
    return () => (cancel = true);
  }, [id]);

  const guardar = async () => {
    try {
      setSaving(true);
      setErr("");

      const payload = {
        estado,
        fecha_confirmada: fechaConfirmada || null, // "YYYY-MM-DDTHH:mm"
        nota_interna: notaInterna || null,
      };

      const { data } = await api.put(`/citas/${id}`, payload);
      const updated = data?.data || null;

      setCita(updated);
      // refrescar valores por si el backend normaliza
      setEstado(updated?.estado || estado);
      setFechaConfirmada(toInputDateTime(updated?.fecha_confirmada));
      setNotaInterna(updated?.nota_interna || "");
    } catch (e) {
      setErr(e?.response?.data?.error || "No se pudo guardar la cita.");
    } finally {
      setSaving(false);
    }
  };

  const borrar = async () => {
    if (!confirm("¿Seguro que quieres borrar esta cita?")) return;
    try {
      setSaving(true);
      setErr("");
      await api.delete(`/citas/${id}`);
      nav("/admin/citas");
    } catch (e) {
      setErr(e?.response?.data?.error || "No se pudo borrar la cita.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <h2>Cargando cita...</h2>
      </div>
    );
  }

  if (err || !cita) {
    return (
      <div className="container py-5">
        <h2>No se pudo mostrar la cita</h2>
        {err && <div className="alert alert-danger">{err}</div>}
        <Link to="/admin/citas" className="btn btn-dark">
          Volver a citas
        </Link>
      </div>
    );
  }

  return (
    <section className="py-4">
      <div className="container" style={{ maxWidth: 980 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1">Cita #{cita.id}</h2>
            <div className="text-muted small">
              Creada:{" "}
              {cita.created_at
                ? new Date(cita.created_at).toLocaleString("es-ES")
                : "-"}
            </div>
          </div>

          <div className="d-flex gap-2">
            <Link to="/admin/citas" className="btn btn-outline-dark">
              Volver
            </Link>
            <button
              className="btn btn-outline-danger"
              disabled={saving}
              onClick={borrar}
            >
              Borrar
            </button>
          </div>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        <div className="card p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="fw-semibold">Cliente</div>
              <div className="text-muted">
                {cita.nombre}{" "}
                {cita.usuario_id ? (
                  <span>(usuario #{cita.usuario_id})</span>
                ) : null}
                <br />
                {cita.email}
                <br />
                {cita.telefono || "-"}
              </div>
            </div>

            <div className="col-md-6">
              <div className="fw-semibold">Solicitud</div>
              <div className="text-muted">
                Tipo: {cita.tipo}
                <br />
                Producto ID: {cita.producto_id || "-"}
                <br />
                Categoría ID: {cita.categoria_id || "-"}
              </div>
            </div>

            {cita.mensaje && (
              <div className="col-12">
                <div className="fw-semibold">Mensaje</div>
                <div className="text-muted">{cita.mensaje}</div>
              </div>
            )}

            <div className="col-12">
              <hr />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Estado</label>
              <select
                className="form-select"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="rechazada">Rechazada</option>
                <option value="completada">Completada</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Fecha asignada</label>
              <input
                type="datetime-local"
                className="form-control"
                value={fechaConfirmada}
                onChange={(e) => setFechaConfirmada(e.target.value)}
              />
              <div className="form-text text-muted">
                Si no asignas fecha, quedará como “Sin asignar”.
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">
                Solicitud recibida
              </label>
              <div className="form-control-plaintext text-muted">
                {cita.created_at
                  ? new Date(cita.created_at).toLocaleString("es-ES")
                  : "-"}
              </div>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Nota interna</label>
              <textarea
                className="form-control"
                rows={4}
                value={notaInterna}
                onChange={(e) => setNotaInterna(e.target.value)}
                placeholder="Notas internas para el equipo..."
              />
            </div>

            <div className="col-12 d-flex justify-content-end gap-2">
              <button
                className="btn btn-dark"
                disabled={saving}
                onClick={guardar}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

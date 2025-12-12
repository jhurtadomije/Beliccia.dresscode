import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

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

const fmtDateTime = (v) => (v ? new Date(v).toLocaleString("es-ES") : "-");

export default function PerfilCitaDetalle() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [cita, setCita] = useState(null);

  useEffect(() => {
    let cancel = false;

    const run = async () => {
      try {
        setLoading(true);
        setErr("");

        const { data } = await api.get(`/citas/${id}`);

        if (cancel) return;

        // acepta varias formas: {cita: {...}} o {...}
        setCita(data?.cita || data?.data || data || null);
      } catch (e) {
        if (cancel) return;
        setErr(e?.response?.data?.message || "No se pudo cargar la cita.");
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    run();
    return () => {
      cancel = true;
    };
  }, [id]);

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
        <Link to="/perfil/citas" className="btn btn-dark">
          Volver a mis citas
        </Link>
      </div>
    );
  }

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1">Cita #{cita.id}</h2>
            <div className="text-muted small">
              {cita.created_at ? fmtDateTime(cita.created_at) : ""}
            </div>
          </div>

          <Link to="/perfil/citas" className="btn btn-outline-dark">
            Volver
          </Link>
        </div>

        <div className="card p-4">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="fw-semibold">Estado</div>
              <div>
                <span className={badgeClassByEstado(cita.estado)}>
                  {cita.estado || "pendiente"}
                </span>
              </div>
            </div>

            <div className="col-md-4">
              <div className="fw-semibold">Tipo</div>
              <div>{labelTipo(cita.tipo)}</div>
            </div>

            <div className="col-md-4">
              <div className="fw-semibold">Contacto</div>
              <div className="text-muted">
                {cita.nombre || "-"}
                <br />
                {cita.email || "-"}
                {cita.telefono ? (
                  <>
                    <br />
                    Tel: {cita.telefono}
                  </>
                ) : null}
              </div>
            </div>

            <div className="col-12">
              <hr />
            </div>

            <div className="col-md-6">
              <div className="fw-semibold">Fecha solicitada</div>
              <div className="text-muted">{fmtDateTime(cita.fecha_solicitada)}</div>
            </div>

            <div className="col-md-6">
              <div className="fw-semibold">Fecha confirmada</div>
              <div className="text-muted">{fmtDateTime(cita.fecha_confirmada)}</div>
            </div>

            {(cita.producto_id || cita.categoria_id) && (
              <div className="col-12">
                <div className="fw-semibold">Relacionado con</div>
                <div className="text-muted">
                  {cita.producto_id ? <>Producto ID: {cita.producto_id}</> : null}
                  {cita.producto_id && cita.categoria_id ? " · " : null}
                  {cita.categoria_id ? <>Categoría ID: {cita.categoria_id}</> : null}
                </div>
              </div>
            )}

            {cita.mensaje && (
              <div className="col-12">
                <div className="fw-semibold">Mensaje</div>
                <div className="text-muted">{cita.mensaje}</div>
              </div>
            )}
          </div>
        </div>

        <div className="alert alert-light border mt-3">
          Si quieres, el siguiente paso es que el admin pueda confirmar/rechazar
          la cita y que aquí se vea el cambio al instante (endpoint tipo{" "}
          <code>PUT /citas/:id</code> con permiso admin).
        </div>
      </div>
    </section>
  );
}

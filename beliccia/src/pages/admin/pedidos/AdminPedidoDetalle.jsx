// src/pages/admin/AdminPedidoDetalle.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../services/api";

const ESTADOS_PEDIDO = ["pendiente", "preparacion", "enviado", "entregado", "cancelado"];
const ESTADOS_PAGO = ["pendiente", "pagado", "fallido", "reembolsado"];

export default function AdminPedidoDetalle() {
  const { id } = useParams();

  const [pedido, setPedido] = useState(null);
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [estado, setEstado] = useState("");
  const [estadoPago, setEstadoPago] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/pedidos/${id}`);

      const p = data?.pedido || data?.data || data || null;

      setPedido(p);
      setItems(p?.items || data?.items || []);

      setEstado(p?.estado || "pendiente");
      setEstadoPago(p?.estado_pago || "pendiente");
    } catch (e) {
      setError(e?.response?.data?.message || "No se pudo cargar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const totals = useMemo(() => {
    const subtotal = Number(pedido?.subtotal || 0);
    const iva = Number(pedido?.total_iva || 0);
    const envio = Number(pedido?.gastos_envio || 0);
    const desc = Number(pedido?.descuento_total || 0);
    const total = Number(pedido?.total || 0);
    return { subtotal, iva, envio, desc, total };
  }, [pedido]);

  const save = async () => {
    if (!pedido?.id) return;
    setSaving(true);
    setError("");
    try {
      await api.put(`/pedidos/${pedido.id}`, {
        estado,
        estado_pago: estadoPago,
      });
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <h2>Cargando pedido...</h2>
      </div>
    );
  }

  if (error && !pedido) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/admin/pedidos" className="btn btn-outline-dark">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="mb-1">Pedido #{pedido.id}</h2>
          <div className="text-muted small">
            {pedido.numero_pedido || ""}
          </div>
        </div>

        <div className="d-flex gap-2">
          <Link to="/admin/pedidos" className="btn btn-outline-dark">
            Volver a pedidos
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <div className="card p-3">
            <h5 className="mb-3">Productos</h5>

            {!items.length && (
              <div className="text-muted">No hay items asociados.</div>
            )}

            {items.length > 0 && (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-end">Precio</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, idx) => (
                      <tr key={it.id || idx}>
                        <td>
                          <div className="fw-semibold">
                            {it.nombre_producto || it.nombre || "Producto"}
                          </div>
                          <div className="text-muted small">
                            {it.descripcion_variante || it.sku || ""}
                          </div>
                        </td>
                        <td className="text-center">{it.cantidad}</td>
                        <td className="text-end">
                          {Number(it.precio_unitario || 0).toFixed(2)} €
                        </td>
                        <td className="text-end">
                          {Number(it.total || 0).toFixed(2)} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <hr />

            <div className="row">
              <div className="col-6 text-muted">Subtotal</div>
              <div className="col-6 text-end">{totals.subtotal.toFixed(2)} €</div>

              <div className="col-6 text-muted">IVA</div>
              <div className="col-6 text-end">{totals.iva.toFixed(2)} €</div>

              <div className="col-6 text-muted">Envío</div>
              <div className="col-6 text-end">{totals.envio.toFixed(2)} €</div>

              <div className="col-6 text-muted">Descuento</div>
              <div className="col-6 text-end">- {totals.desc.toFixed(2)} €</div>

              <div className="col-6 fw-semibold mt-2">Total</div>
              <div className="col-6 text-end fw-semibold mt-2">
                {totals.total.toFixed(2)} €
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card p-3 mb-3">
            <h5 className="mb-3">Cliente / Envío</h5>

            <div className="small">
              <div><strong>Usuario ID:</strong> {pedido.usuario_id}</div>
              <div><strong>Nombre:</strong> {pedido.envio_nombre}</div>
              <div><strong>Dirección:</strong> {pedido.envio_direccion}</div>
              <div><strong>Ciudad:</strong> {pedido.envio_ciudad}</div>
              <div><strong>Provincia:</strong> {pedido.envio_provincia}</div>
              <div><strong>CP:</strong> {pedido.envio_cp}</div>
              <div><strong>País:</strong> {pedido.envio_pais}</div>
              <div><strong>Teléfono:</strong> {pedido.envio_telefono || "-"}</div>
            </div>
          </div>

          <div className="card p-3">
            <h5 className="mb-3">Estados</h5>

            <label className="form-label">Estado del pedido</label>
            <select
              className="form-select mb-3"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              {ESTADOS_PEDIDO.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <label className="form-label">Estado del pago</label>
            <select
              className="form-select mb-3"
              value={estadoPago}
              onChange={(e) => setEstadoPago(e.target.value)}
            >
              {ESTADOS_PAGO.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button
              className="btn btn-dark w-100"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

const money = (n) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(
    Number(n || 0)
  );

export default function PerfilPedidoDetalle() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    let cancel = false;

    const run = async () => {
      try {
        setLoading(true);
        setErr("");

        const { data } = await api.get(`/pedidos/${id}`);

        if (cancel) return;

        setPedido(data?.pedido || data || null);
      } catch (e) {
        if (cancel) return;
        setErr(
          e?.response?.data?.message ||
            "No se pudo cargar el pedido."
        );
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
        <h2>Cargando pedido...</h2>
      </div>
    );
  }

  if (err || !pedido) {
    return (
      <div className="container py-5">
        <h2>No se pudo mostrar el pedido</h2>
        {err && <div className="alert alert-danger">{err}</div>}
        <Link to="/perfil/pedidos" className="btn btn-dark">
          Volver a mis pedidos
        </Link>
      </div>
    );
  }

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1">
              Pedido {pedido.numero_pedido || `#${pedido.id}`}
            </h2>
            <div className="text-muted small">
              {pedido.created_at
                ? new Date(pedido.created_at).toLocaleString("es-ES")
                : ""}
            </div>
          </div>
          <Link to="/perfil/pedidos" className="btn btn-outline-dark">
            Volver
          </Link>
        </div>

        <div className="card p-4">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="fw-semibold">Estado</div>
              <div>{pedido.estado}</div>
            </div>

            <div className="col-md-4">
              <div className="fw-semibold">Estado del pago</div>
              <div>{pedido.estado_pago}</div>
            </div>

            <div className="col-md-4">
              <div className="fw-semibold">Total</div>
              <div>{money(pedido.total)}</div>
            </div>

            <div className="col-12">
              <hr />
            </div>

            <div className="col-md-6">
              <div className="fw-semibold">Envío</div>
              <div className="text-muted">
                {pedido.envio_nombre}
                <br />
                {pedido.envio_direccion}
                <br />
                {pedido.envio_cp} {pedido.envio_ciudad}
                <br />
                {pedido.envio_provincia} ({pedido.envio_pais})
                <br />
                {pedido.envio_telefono && (
                  <>
                    <span>Tel: {pedido.envio_telefono}</span>
                  </>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="fw-semibold">Resumen</div>
              <div className="text-muted">
                <div>Items: {pedido.total_items}</div>
                <div>Subtotal: {money(pedido.subtotal)}</div>
                <div>IVA: {money(pedido.total_iva)}</div>
                <div>Envío: {money(pedido.gastos_envio)}</div>
                <div>Descuento: {money(pedido.descuento_total)}</div>
              </div>
            </div>

            {pedido.notas_cliente && (
              <div className="col-12">
                <div className="fw-semibold">Notas</div>
                <div className="text-muted">{pedido.notas_cliente}</div>
              </div>
            )}
          </div>
        </div>

        {/* Si más adelante añades endpoint de items */}
        <div className="alert alert-light border mt-3">
          Si quieres, el siguiente paso es mostrar aquí los artículos del pedido
          con un endpoint tipo <code>GET /pedidos/:id/items</code>.
        </div>
      </div>
    </section>
  );
}

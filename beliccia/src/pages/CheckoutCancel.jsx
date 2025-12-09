import { Link } from "react-router-dom";

export default function CheckoutCancel() {
  return (
    <div className="container py-5">
      <h2 className="mb-3">Pago cancelado</h2>
      <p className="text-muted">
        No se ha realizado ningún cargo. Puedes intentarlo de nuevo.
      </p>

      <div className="d-flex gap-2">
        <Link to="/checkout" className="btn btn-dark">
          Volver al checkout
        </Link>
        <Link to="/carrito" className="btn btn-outline-dark">
          Ir al carrito
        </Link>
      </div>
    </div>
  );
}

import { usePageMeta } from "../../hooks/usePageMeta";

export default function EnviosDevoluciones() {
  usePageMeta({
    title: "Envíos y Devoluciones | Beliccia Dress Code",
    description: "Información sobre envíos, cambios, devoluciones y desistimiento.",
  });

  return (
    <main className="py-5">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="h2 mb-4">Envíos y devoluciones</h1>

        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          En esta página se detallan las condiciones de envío, cambios y devoluciones.
          Antes de finalizar la compra se informará del coste total, incluidos (en su caso)
          los gastos de envío.
        </p>

        <h2 className="h5 mt-4">Envíos</h2>
        <ul className="text-muted" style={{ lineHeight: 1.8 }}>
          <li><strong>Ámbito:</strong> [España peninsular / islas / internacional]</li>
          <li><strong>Plazos estimados:</strong> 6-10 días laborables (según destino y disponibilidad)</li>
          <li><strong>Costes:</strong> se muestran antes de finalizar la compra</li>
          <li><strong>Seguimiento:</strong> si aplica, se facilitará información de seguimiento del envío</li>
        </ul>

        <h2 className="h5 mt-4">Devoluciones y derecho de desistimiento</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          El usuario podrá ejercer el derecho de desistimiento conforme a la normativa aplicable,
          dentro del plazo legal, salvo excepciones legalmente previstas (por ejemplo, productos
          personalizados o confeccionados a medida).
        </p>

        <h3 className="h6 mt-3">Condiciones para aceptar una devolución</h3>
        <ul className="text-muted" style={{ lineHeight: 1.8 }}>
          <li>El producto debe devolverse en perfecto estado, sin uso y con su embalaje original (si procede).</li>
          <li>Debe incluirse el justificante o número de pedido.</li>
          <li>En caso de productos delicados, recomendamos conservar el embalaje protector.</li>
        </ul>

        <h3 className="h6 mt-3">Cómo solicitar una devolución</h3>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Para iniciar una devolución, contacta con nosotros en <strong>info@beliccia.es</strong> indicando:
          número de pedido, producto/s a devolver y motivo (opcional). Te indicaremos los pasos a seguir y
          la dirección de devolución.
        </p>

        <h3 className="h6 mt-3">Reembolso</h3>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Una vez recibida y revisada la devolución, se tramitará el reembolso por el mismo método de pago,
          en el plazo de <strong>5</strong> días laborables, salvo incidencias. {/* pon un número real cuando lo decidáis */}
        </p>

        <h3 className="h6 mt-3">Gastos de devolución</h3>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Los gastos de devolución serán asumidos por <strong>[CLIENTE / BELICCIA / SEGÚN CASO]</strong>,
          salvo que se trate de un error en el pedido o producto defectuoso, en cuyo caso se indicará el
          procedimiento correspondiente.
        </p>

        <h2 className="h5 mt-4">Productos personalizados / a medida</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          En los productos personalizados o confeccionados a medida pueden aplicarse condiciones especiales
          y, conforme a la normativa de consumidores, puede no resultar aplicable el derecho de desistimiento.
          Si un producto se fabrica bajo encargo o se adapta específicamente, se informará de ello antes de la compra.
        </p>

        <h2 className="h5 mt-4">Cambios</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Los cambios estarán sujetos a disponibilidad y condiciones del producto. Para gestionarlo, contacta en{" "}
          <strong>info@beliccia.es</strong> indicando el número de pedido y el cambio solicitado.
        </p>

        <p className="text-muted mt-4">
          <small>Última actualización: {new Date().toLocaleDateString("es-ES")}</small>
        </p>
      </div>
    </main>
  );
}

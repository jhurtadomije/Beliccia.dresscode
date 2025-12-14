import { usePageMeta } from "../../hooks/usePageMeta";

export default function CondicionesCompra() {
  usePageMeta({
    title: "Condiciones de Compra | Beliccia Dress Code",
    description: "Condiciones de contratación para compras online en Beliccia.",
  });

  return (
    <main className="py-5">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="h2 mb-4">Condiciones de compra</h1>

        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Estas condiciones regulan la compra de productos a través de la tienda online
          de Beliccia Dress Code. Antes de finalizar el pedido, el usuario podrá revisar
          el resumen de compra, el precio final y, en su caso, los gastos de envío.
        </p>

        <h2 className="h5 mt-4">Proceso de compra</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          El usuario selecciona productos, revisa el carrito, completa los datos de envío
          y realiza el pago mediante el método disponible. Una vez confirmado, se mostrará
          un resumen del pedido y se enviará una confirmación al email indicado.
        </p>

        <h2 className="h5 mt-4">Disponibilidad y características</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Los productos mostrados están sujetos a disponibilidad. Las imágenes y descripciones
          se publican con la mayor precisión posible; no obstante, pueden existir ligeras variaciones
          derivadas de la configuración de pantalla o de procesos de fabricación.
        </p>

        <h2 className="h5 mt-4">Precios, impuestos y gastos</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Los precios se muestran en euros (€). Los impuestos aplicables y, en su caso, los gastos
          de envío u otros costes asociados se indicarán de forma clara antes de finalizar la compra.
        </p>

        <h2 className="h5 mt-4">Formas de pago</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Los métodos de pago disponibles se mostrarán durante el proceso de compra.
          {/* Si quieres, sustituimos esto por el método real cuando lo tengas cerrado */}
          Métodos habituales: tarjeta (pasarela segura), Bizum y/o transferencia, según disponibilidad.
        </p>

        <h2 className="h5 mt-4">Envíos</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Las condiciones, plazos y costes de envío se informarán antes de finalizar el pedido.
          El plazo de entrega puede variar en función del destino y de la disponibilidad del producto.
        </p>

        <h2 className="h5 mt-4">Devoluciones y derecho de desistimiento</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          El usuario podrá ejercer el derecho de desistimiento conforme a la normativa vigente,
          salvo en aquellos supuestos legalmente excluidos (por ejemplo, productos personalizados
          o confeccionados a medida). Para iniciar una devolución, deberá contactar con atención al
          cliente indicando el número de pedido.
        </p>

        <h2 className="h5 mt-4">Productos personalizados / a medida</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          En el caso de productos personalizados o confeccionados a medida, pueden aplicarse
          condiciones especiales y, en su caso, quedar excluido el derecho de desistimiento,
          conforme a la normativa de consumidores.
        </p>

        <h2 className="h5 mt-4">Cancelaciones</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Si desea cancelar un pedido, contacte con nosotros lo antes posible. Si el pedido ya
          ha sido preparado o enviado, la cancelación podrá tramitarse como devolución, conforme
          a las condiciones aplicables.
        </p>

        <h2 className="h5 mt-4">Atención al cliente</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Para incidencias, consultas o devoluciones: <strong>info@beliccia.es</strong>.
          {/* Opcional recomendado:
          <br />
          Teléfono: <strong>[PONER AQUÍ TELÉFONO]</strong>
          */}
        </p>

        <p className="text-muted mt-4">
          <small>Última actualización: {new Date().toLocaleDateString("es-ES")}</small>
        </p>
      </div>
    </main>
  );
}

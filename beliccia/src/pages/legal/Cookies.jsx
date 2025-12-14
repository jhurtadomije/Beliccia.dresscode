import { usePageMeta } from "../../hooks/usePageMeta";

export default function Cookies() {
  usePageMeta({
    title: "Política de Cookies | Beliccia Dress Code",
    description: "Información sobre el uso de cookies en el sitio web.",
  });

  return (
    <main className="py-5">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="h2 mb-4">Política de Cookies</h1>

        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Este sitio web utiliza cookies y tecnologías similares para su correcto
          funcionamiento y, en su caso, para analítica y/o marketing únicamente si
          el usuario lo acepta expresamente mediante el panel de cookies.
        </p>

        <h2 className="h5 mt-4">¿Qué son las cookies?</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Son pequeños archivos que se almacenan en tu dispositivo para permitir
          funcionalidades, recordar preferencias o medir el uso del sitio. Algunas
          cookies pueden implicar el tratamiento de datos personales.
        </p>

        <h2 className="h5 mt-4">Tipos de cookies</h2>
        <ul className="text-muted" style={{ lineHeight: 1.8 }}>
          <li>
            <strong>Técnicas (necesarias):</strong> imprescindibles para la navegación,
            seguridad, carrito y funciones básicas del sitio.
          </li>
          <li>
            <strong>Preferencias:</strong> recuerdan opciones (por ejemplo, idioma o
            configuración del usuario).
          </li>
          <li>
            <strong>Analítica (opcional):</strong> ayudan a entender el uso del sitio
            para mejorarlo. Solo se activan si se aceptan.
          </li>
          <li>
            <strong>Marketing (opcional):</strong> orientadas a personalización publicitaria.
            Solo se activan si se aceptan.
          </li>
        </ul>

        <h2 className="h5 mt-4">Cookies utilizadas en este sitio</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          A continuación se indican las cookies que pueden utilizarse en el sitio. Las
          cookies no necesarias (analítica/marketing) no se instalarán hasta que el
          usuario las acepte.
        </p>

        {/* Tabla sencilla (sin meternos en nombres técnicos si aún no los tienes cerrados) */}
        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Finalidad</th>
                <th>Duración</th>
                <th>Proveedor</th>
              </tr>
            </thead>
            <tbody className="text-muted">
              <tr>
                <td>Técnicas</td>
                <td>Permiten el funcionamiento del sitio, seguridad y carrito</td>
                <td>Sesión / Persistente</td>
                <td>Beliccia (propias)</td>
              </tr>
              <tr>
                <td>Preferencias</td>
                <td>Recordar configuración del usuario (si aplica)</td>
                <td>Persistente</td>
                <td>Beliccia (propias)</td>
              </tr>
              <tr>
                <td>Analítica (opcional)</td>
                <td>Medición del uso para mejorar la web (solo si se acepta)</td>
                <td>Según configuración</td>
                <td>Terceros (si se activa)</td>
              </tr>
              <tr>
                <td>Marketing (opcional)</td>
                <td>Personalización publicitaria (solo si se acepta)</td>
                <td>Según configuración</td>
                <td>Terceros (si se activa)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="h5 mt-4">Gestión y configuración de cookies</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Puedes aceptar, rechazar o configurar tus preferencias desde el aviso/botón
          de cookies. También puedes retirar o modificar tu consentimiento en cualquier
          momento desde el panel de configuración.
        </p>

        <h2 className="h5 mt-4">Cómo deshabilitar cookies desde el navegador</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Además, puedes bloquear o eliminar cookies desde la configuración de tu
          navegador. Ten en cuenta que, si deshabilitas cookies técnicas, algunas
          funcionalidades del sitio podrían no funcionar correctamente.
        </p>

        <p className="text-muted mt-4">
          <small>Última actualización: {new Date().toLocaleDateString("es-ES")}</small>
        </p>
      </div>
    </main>
  );
}

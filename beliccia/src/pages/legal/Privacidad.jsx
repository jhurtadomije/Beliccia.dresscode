import { usePageMeta } from "../../hooks/usePageMeta";

export default function Privacidad() {
  usePageMeta({
    title: "Política de Privacidad | Beliccia Dress Code",
    description: "Información sobre tratamiento de datos personales (RGPD).",
  });

  return (
    <main className="py-5">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="h2 mb-4">Política de Privacidad</h1>

        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Esta política describe cómo se tratan los datos personales conforme al
          Reglamento (UE) 2016/679 (RGPD) y la normativa española aplicable.
        </p>

        <h2 className="h5 mt-4">Responsable del tratamiento</h2>
        <ul className="text-muted" style={{ lineHeight: 1.8 }}>
          <li><strong>Beliccia Dress Code</strong></li>
          <li><strong>Razón social:</strong> Beliccia Dress Code, S.L.</li>
          <li><strong>NIF/CIF:</strong> B22435754</li>
          <li><strong>Domicilio:</strong> Avda. Los Claveles, Maracena, Granada (España)</li>
          <li><strong>Email:</strong> info@beliccia.es</li>
          {/* Opcional recomendado:
          <li><strong>Correo de protección de datos:</strong> [EMAIL PROTECCIÓN DATOS]</li>
          */}
        </ul>

        <h2 className="h5 mt-4">Datos que podemos tratar</h2>
        <ul className="text-muted" style={{ lineHeight: 1.8 }}>
          <li>Datos de contacto (nombre, email, teléfono) si rellenas formularios o solicitas cita.</li>
          <li>Datos de compra/envío y facturación si realizas un pedido.</li>
          <li>Datos de cuenta (si creas usuario): email y datos necesarios para tu perfil.</li>
          <li>Datos técnicos básicos (por ejemplo IP, navegador) por seguridad y funcionamiento.</li>
        </ul>

        <h2 className="h5 mt-4">Finalidades</h2>
        <ul className="text-muted" style={{ lineHeight: 1.8 }}>
          <li>Gestionar consultas, solicitudes de cita y comunicaciones con el usuario.</li>
          <li>Procesar pedidos, pagos, envíos, devoluciones y atención al cliente.</li>
          <li>Cumplimiento de obligaciones legales y fiscales (facturación, contabilidad, etc.).</li>
        </ul>

        <h2 className="h5 mt-4">Base legal</h2>
        <ul className="text-muted" style={{ lineHeight: 1.8 }}>
          <li><strong>Ejecución de un contrato</strong> (compra/servicio solicitado o medidas precontractuales).</li>
          <li><strong>Consentimiento</strong> (formularios, solicitudes o comunicaciones opcionales, si aplica).</li>
          <li><strong>Obligación legal</strong> (facturación, fiscalidad y demás normativa aplicable).</li>
        </ul>

        <h2 className="h5 mt-4">Conservación</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Los datos se conservarán el tiempo necesario para la finalidad para la que fueron recabados
          y, en su caso, durante los plazos legales exigibles. Por ejemplo, los datos de facturación
          se conservarán durante los periodos requeridos por la normativa fiscal y contable.
        </p>

        <h2 className="h5 mt-4">Destinatarios / cesiones</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          No se comunicarán datos personales a terceros, salvo obligación legal. Para prestar el servicio,
          pueden acceder a los datos proveedores necesarios (encargados del tratamiento), por ejemplo:
          pasarela de pago, empresas de transporte y proveedores tecnológicos/hosting, únicamente para
          la finalidad del servicio.
        </p>

        <h2 className="h5 mt-4">Seguridad</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Beliccia Dress Code trata los datos de forma segura y confidencial, aplicando medidas técnicas y
          organizativas adecuadas para evitar el acceso no autorizado, la pérdida o alteración de la información.
        </p>

        <h2 className="h5 mt-4">Derechos</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y
          portabilidad enviando un email a <strong>info@beliccia.es</strong>.
          Asimismo, puedes presentar una reclamación ante la Agencia Española de Protección de Datos
          (www.aepd.es).
        </p>

        <p className="text-muted mt-4">
          <small>Última actualización: {new Date().toLocaleDateString("es-ES")}</small>
        </p>
      </div>
    </main>
  );
}

import { usePageMeta } from "../../hooks/usePageMeta";

export default function AvisoLegal() {
  usePageMeta({
    title: "Aviso Legal | Beliccia Dress Code",
    description: "Información legal del sitio web de Beliccia Dress Code.",
  });

  return (
    <main className="py-5">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="h2 mb-4">Aviso Legal</h1>

        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la
          Información y de Comercio Electrónico (LSSI-CE), se informa a los usuarios
          de los siguientes datos:
        </p>

        <h2 className="h5 mt-4">Titular del sitio web</h2>
        <ul className="text-muted" style={{ lineHeight: 1.8 }}>
          <li>
            <strong>Nombre comercial:</strong> Beliccia Dress Code
          </li>
          <li>
            <strong>Razón social:</strong> Beliccia Dress Code, S.L.
          </li>
          <li>
            <strong>NIF/CIF:</strong> B22435754
          </li>
          <li>
            <strong>Domicilio:</strong> Avda. Los Claveles, Maracena, Granada (España)
          </li>
          <li>
            <strong>Email de contacto:</strong> info@beliccia.es
          </li>
          <li>
            <strong>Teléfono de contacto:</strong> 641 36 33 81 {/* recomendado */}
          </li>
          {/* Si procede (sociedad inscrita), añadir:
          <li><strong>Datos registrales:</strong> [Registro Mercantil / tomo / folio / hoja]</li>
          */}
        </ul>

        <h2 className="h5 mt-4">Objeto</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Este sitio web tiene como finalidad la información, promoción y, en su caso,
          la comercialización online de productos de moda, así como la gestión de
          solicitudes de cita y consultas de los usuarios.
        </p>

        <h2 className="h5 mt-4">Condiciones de uso</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          El acceso y uso de este sitio web atribuye la condición de usuario e implica la
          aceptación de las presentes condiciones. El usuario se compromete a hacer un uso
          adecuado de los contenidos y servicios y a no emplearlos para realizar actividades
          ilícitas o contrarias a la buena fe y al orden público.
        </p>

        <h2 className="h5 mt-4">Información sobre precios</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Los precios se muestran en euros (€). Los impuestos aplicables y, en su caso, los
          gastos de envío u otros costes asociados se informarán de forma clara antes de
          finalizar el proceso de compra.
        </p>

        <h2 className="h5 mt-4">Propiedad intelectual e industrial</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          Todos los contenidos (textos, imágenes, logotipos, diseño, vídeos, código, etc.)
          son titularidad del titular del sitio o cuentan con licencia, quedando prohibida su
          reproducción, distribución o transformación sin autorización expresa.
        </p>

        <h2 className="h5 mt-4">Responsabilidad</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          El titular no se responsabiliza del mal uso del contenido ni de daños derivados de
          interferencias, virus o desconexiones ajenas al control del sitio. Tampoco se hace
          responsable del contenido de enlaces externos, en caso de existir.
        </p>

        <h2 className="h5 mt-4">Legislación aplicable</h2>
        <p className="text-muted" style={{ lineHeight: 1.8 }}>
          La relación entre el usuario y el titular se regirá por la legislación española. En caso
          de controversia, serán competentes los juzgados y tribunales que correspondan conforme a
          la normativa de consumidores y usuarios.
        </p>

        <p className="text-muted mt-4">
          <small>
            Última actualización: {new Date().toLocaleDateString("es-ES")}
          </small>
        </p>
      </div>
    </main>
  );
}

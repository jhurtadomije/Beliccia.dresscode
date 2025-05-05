import Contact from '../components/Contact'; // si ya lo tienes separado

export default function Visitanos() {
  return (
    <section id="visitanos" className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Visítanos</h2>

        {/* Mapa de Google */}
        <div className="mb-5">
          <iframe
            title="Mapa Beliccia"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.749246985758!2d-3.640123684694276!3d37.2106838798709!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd71fcb6aa0cf5c5%3A0x1234567890abcdef!2sAv.%20Los%20Claveles%2C%2016%2C%2018200%20Maracena%2C%20Granada!5e0!3m2!1ses!2ses!4v0000000000000"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Datos de contacto */}
        <div className="text-center mb-5">
          <p><strong>Dirección:</strong> Av. Los Claveles 16, Maracena, Granada</p>
          <p><strong>Horario:</strong> Lunes a Viernes de 10:00 a 14:00 y de 17:00 a 20:00</p>
          <p><strong>Teléfono:</strong> 958 000 000</p>
        </div>

        {/* Formulario de contacto (puedes importar el componente si ya lo tienes) */}
        <Contact />
      </div>
    </section>
  );
}

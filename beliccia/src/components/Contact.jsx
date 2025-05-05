export default function Contact() {
    return (
      <section id="contact" className="py-5 section fadeIn">
        <div className="container">
          <h2 className="mb-4 text-center">Contacto</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label d-flex justify-content-center">
                Nombre
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Ingresa tu nombre"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label d-flex justify-content-center">
                Correo Electrónico
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Ingresa tu correo"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label d-flex justify-content-center">
                Mensaje
              </label>
              <textarea
                className="form-control"
                id="message"
                rows="4"
                placeholder="Escribe tu mensaje"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary d-block mx-auto">
              Enviar
            </button>
          </form>
        </div>
      </section>
    );
  }
  
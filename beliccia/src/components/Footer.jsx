// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { openCookieSettings } from "../utils/cookiesConsent";

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="text-decoration-none text-secondary">
      {children}
    </Link>
  );
}

function FooterActionButton({ onClick, children }) {
  return (
    <button
      type="button"
      className="text-decoration-none text-secondary p-0 border-0 bg-transparent"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {children}
    </button>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  const SOCIAL = {
    facebook: "https://www.facebook.com/p/Beliccia-Dress-Code-61577844696625/",
    instagram: "https://www.instagram.com/beliccia.dresscode",
    tiktok: "https://www.tiktok.com/@beliccia",
    whatsappPhone: "34641363381",
  };

  const WHATSAPP_TEXT = encodeURIComponent(
    "Hola, me gustaría solicitar información / cita. 😊"
  );
  const whatsappUrl = `https://wa.me/${SOCIAL.whatsappPhone}?text=${WHATSAPP_TEXT}`;

  return (
    <footer
      className="text-secondary pt-5"
      style={{
        background: "var(--background-color, #fff)",
        boxShadow: "0 -12px 24px rgba(0,0,0,.04)",
      }}
    >
      <div className="container">
        <div className="text-center mb-4">
          <img
            src="/imagenes/isotipo.png"
            alt="Beliccia Dress Code"
            loading="lazy"
            style={{
              width: "clamp(80px, 18vw, 220px)",
              height: "clamp(80px, 18vw, 220px)",
              objectFit: "contain",
              display: "inline-block",
            }}
          />
        </div>

        <div className="row text-center text-md-start">
          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase fw-bold">Categorías</h6>
            <ul className="list-unstyled">
              <li>
                <FooterLink to="/novias">Vestidos de novia</FooterLink>
              </li>
              <li>
                <FooterLink to="/madrinas">Madrinas</FooterLink>
              </li>
              <li>
                <FooterLink to="/invitadas">Invitadas</FooterLink>
              </li>
              <li>
                {/* ✅ mejor ir directo a la ruta real */}
                <FooterLink to="/accesorios">Complementos</FooterLink>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase fw-bold">¿Necesitas ayuda?</h6>
            <ul className="list-unstyled">
              <li>
                <FooterLink to="/visitanos">Contacto</FooterLink>
              </li>
              <li className="mt-2 text-muted small">
                Atención al cliente
                <div>
                  Email: <span className="text-secondary">info@beliccia.es</span>
                </div>
                <div>
                  Teléfono:{" "}
                  <span className="text-secondary">+{SOCIAL.whatsappPhone}</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase fw-bold">Empresa</h6>
            <ul className="list-unstyled">
              <li>
                <FooterLink to="/visitanos">Visítanos</FooterLink>
              </li>
              <li>
                <FooterLink to="/atelier">Atelier</FooterLink>
              </li>
              <li>
                <FooterLink to="/conocenos">Conócenos</FooterLink>
              </li>
              <li>
              <FooterLink to="/admin/login" className="footer-link">Área privada</FooterLink>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h6 className="text-uppercase fw-bold">Información legal</h6>
            <ul className="list-unstyled">
              <li>
                <FooterLink to="/legal/aviso-legal">Aviso legal</FooterLink>
              </li>
              <li>
                <FooterLink to="/legal/privacidad">
                  Política de privacidad
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/legal/cookies">Política de cookies</FooterLink>
              </li>
              <li>
                <FooterLink to="/legal/condiciones-compra">
                  Condiciones de compra
                </FooterLink>
              </li>
              <li>
                <FooterLink to="/legal/envios-devoluciones">
                  Envíos y devoluciones
                </FooterLink>
              </li>
              <li>
                {/* ✅ sin href="#" para evitar saltos/hash */}
                <FooterActionButton onClick={openCookieSettings}>
                  Configurar cookies
                </FooterActionButton>
              </li>
            </ul>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="text-center my-4">
          <a
            className="text-secondary me-3"
            href={SOCIAL.facebook}
            aria-label="Facebook"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-facebook fa-lg" />
          </a>

          <a
            className="text-secondary me-3"
            href={SOCIAL.instagram}
            aria-label="Instagram"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-instagram fa-lg" />
          </a>

          <a
            className="text-secondary me-3"
            href={SOCIAL.tiktok}
            aria-label="TikTok"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-tiktok fa-lg" />
          </a>

          <a
            className="text-secondary"
            href={whatsappUrl}
            aria-label="WhatsApp"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-whatsapp fa-lg" />
          </a>
        </div>

        <div className="text-center my-3">
          <div className="text-muted small mb-2">Pago seguro</div>

          <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
            <img
              src="/pagos/visablue.png"
              alt="Visa"
              style={{ height: 18, width: "auto", opacity: 0.85 }}
            />
            <img
              src="/pagos/mastercard.svg"
              alt="Mastercard"
              style={{ height: 18, width: "auto", opacity: 0.85 }}
            />
            <img
              src="/pagos/amex.svg"
              alt="American Express"
              style={{ height: 35, width: "auto", opacity: 0.85 }}
            />
            <img
              src="/pagos/Stripe.svg"
              alt="Stripe"
              style={{ height: 18, width: "auto", opacity: 0.85 }}
            />
          </div>
        </div>

        <div className="text-center border-top pt-3">
          <p className="mb-1">
            &copy; {year} Beliccia Dress Code | Todos los derechos reservados.
          </p>
          <p className="mb-0 text-muted small">
            Desarrollado por:{" "}
            <a
              className="text-decoration-none text-secondary"
              href="https://www.linkedin.com/in/jose-ramon-hurtado-mije-888629342/"
              target="_blank"
              rel="noreferrer"
            >
              José Ramón Hurtado
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

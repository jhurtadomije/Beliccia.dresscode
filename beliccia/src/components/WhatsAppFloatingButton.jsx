// src/components/WhatsAppFloatingButton.jsx
import "../assets/css/whatsappFloatingButton.css";

export default function WhatsAppFloatingButton() {
  const whatsappUrl = "https://wa.me/34600000000"; 

  return (
    <a
      href={whatsappUrl}
      className="fab-whatsapp"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Habla con nosotros por WhatsApp"
      title="¡Contacta con Nosotros!"
    >
      <span className="fab-inner">
        <i className="fab fa-whatsapp" />
      </span>
      <span className="fab-whatsapp-text">
        ¡Contacta con Nosotros!
      </span>
    </a>
  );
}

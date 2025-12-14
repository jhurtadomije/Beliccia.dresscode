/* components/About.jsx */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRandomAnimation } from "../utils/animations";
import CitaModal from "./CitaModal";

const CTA_PRODUCTO = {
  id: "cta-about",
  categoria_id: null,
  nombre: "Cita Beliccia",
  imagen_portada: "/placeholder.png",
};

export default function About() {
  const [animationClass, setAnimationClass] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setAnimationClass(getRandomAnimation());
  }, []);

  const openCita = () => setOpen(true);
  const closeCita = () => setOpen(false);

  const VIDEO_MAX_WIDTH = 2000;

  return (
    <section id="about" className={`section py-5 ${animationClass}`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 text-center">
            <h2 className="mb-4">Sobre Nosotros</h2>
          </div>
        </div>
      </div>

      <div className="px-3 px-md-4">
        <div className="mx-auto" style={{ maxWidth: VIDEO_MAX_WIDTH }}>
          <div className="about-video-wrap mx-auto">
            <video
              className="about-video"
              src="/videos/conocenos.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 text-center">
            <p className="mb-4" style={{ lineHeight: 1.8 }}>
              En Beliccia, diseñamos y ofrecemos vestidos únicos para novias,
              fiesta y ocasiones especiales, cuidando cada detalle para que te
              sientas tú.
            </p>

            {/* ✅ Botones SIEMPRE visibles aquí */}
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <button type="button" className="btn btn-dark" onClick={openCita}>
                Solicita tu cita
              </button>

              <Link to="/conocenos" className="btn btn-outline-dark">
                Conócenos
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CitaModal open={open} onClose={closeCita} producto={CTA_PRODUCTO} />
    </section>
  );
}

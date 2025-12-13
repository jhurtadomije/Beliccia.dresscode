/* components/About.jsx */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRandomAnimation } from "../utils/animations";

export default function About() {
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    const randomClass = getRandomAnimation();
    setAnimationClass(`section ${randomClass}`);
  }, []);


  const VIDEO_MAX_WIDTH = 2000; 


  return (
    <section id="about" className={`py-5 ${animationClass}`}>
      {/* ✅ CONTENEDOR 1: título + texto (centrados) */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 text-center">
            <h2 className="mb-4">Sobre Nosotros</h2>
            <p className="mb-4" style={{ lineHeight: 1.8 }}>
              En Beliccia, diseñamos y ofrecemos vestidos únicos para novias,
              fiesta y ocasiones especiales, cuidando cada detalle para que te
              sientas tú.
            </p>
          </div>
        </div>
      </div>

      {/* ✅ BLOQUE 2: vídeo “casi full width” (sin que se pegue a los bordes) */}
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

      {/* ✅ CONTENEDOR 3: botones (centrados y con aire) */}
      <div className="container">
        <div className="d-flex justify-content-center gap-2 flex-wrap mt-4">
          <a href="#contact" className="btn btn-dark">
            Pedir cita
          </a>
          <Link to="/conocenos" className="btn btn-outline-dark">
            Conócenos
          </Link>
        </div>
      </div>
    </section>
  );
}

// src/components/Hero.jsx (o donde lo tengas)
import { useEffect, useState } from "react";
import { getRandomAnimation } from "../utils/animations"; 


export default function Hero() {
  const [animation, setAnimation] = useState("");

  useEffect(() => {
    setAnimation(getRandomAnimation());
  }, []);

  return (
    <section id="hero" className="hero">
      <video
        autoPlay
        muted
        loop
        playsInline
        draggable={false}
        className="hero-video"
      >
        <source src="/videos/114.mp4" type="video/mp4" />
        Tu navegador no soporta la reproducción de videos.
      </video>

      <div className={`hero-content section ${animation}`}>
        <h1 className="hero-title">BELICCIA</h1>
        <p className="hero-desc">Elegancia para tus momentos más especiales</p>
        <a href="#collections" className="btn btn-light btn-lg">
          Ver Colecciones
        </a>
      </div>
    </section>
  );
}

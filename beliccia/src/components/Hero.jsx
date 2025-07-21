import { useEffect, useState } from 'react';
import { getRandomAnimation } from '../utils/animations';

export default function Hero() {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    const randomClass = getRandomAnimation();
    setAnimationClass(`section ${randomClass}`);
  }, []);

  return (
    <div id="hero" className="hero">
      <video
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline=""
        draggable={false}
        className="hero-video"
      >
        <source src="/videos/114.mp4" type="video/mp4" />
        Tu navegador no soporta la reproducción de videos.
      </video>

      <div className={animationClass + " hero-content"}>
        <h1 className="hero-title">BELICCIA</h1>
        <p className="hero-desc">Elegancia para tus momentos más especiales</p>
        <a href="#collections" className="btn btn-light btn-lg">
          Ver Colecciones
        </a>
      </div>
    </div>
  );
}

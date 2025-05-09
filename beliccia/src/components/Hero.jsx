import { useEffect, useState } from 'react';
import { getRandomAnimation } from '../utils/animations';

export default function Hero() {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    const randomClass = getRandomAnimation();
    setAnimationClass(`section ${randomClass}`);
  }, []);

  return (
    <div
      id="hero"
      style={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        position: 'relative',
        objectPosition: 'center',
        overflow: 'hidden',
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src="/videos/114.mp4" type="video/mp4" />
        Tu navegador no soporta la reproducción de videos.
      </video>

      <div
        className={animationClass}
        style={{
          position: 'relative',
          zIndex: 1,
          color: 'white',
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: '4rem',
        }}
      >
        <h1 style={{ fontSize: '2.5rem' }}>BELICCIA</h1>
        <p style={{ fontSize: '1.2rem' }}>Elegancia para tus momentos más especiales</p>
        <a href="#collections" className="btn btn-light btn-lg">
          Ver Colecciones
        </a>
      </div>
    </div>
  );
}

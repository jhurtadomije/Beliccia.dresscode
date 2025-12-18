
import { useEffect, useRef, useState } from "react";
import { getRandomAnimation } from "../utils/animations";

const VIDEO_SRC = "/videos/114.mp4";

export default function Hero() {
  const [animation, setAnimation] = useState("");
  //const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    setAnimation(getRandomAnimation());
  }, []);

  /*useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        // ahora dejamos que React pinte el source
        setShouldLoadVideo(true);

        // Intentar reproducir
        setTimeout(() => {
          video.load();
          video.play?.().catch(() => {});
        }, 0);

        obs.disconnect();
      },
      { threshold: 0.25 }
    );

    obs.observe(video);
    return () => obs.disconnect();
  }, []);*/

  return (
    <section id="hero" className="hero">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/hero-poster.webp"
        className="hero-video"       
        draggable={false}     
        onLoadedData={(e) =>{
          e.currentTarget.play?.().catch(() =>{});
        }}
        onCanPlay={(e) => {
          e.currentTarget.play?.().catch(() => {});
        }} 
      >
        {/*  NO renderizar source hasta que toque */}
        <source src={VIDEO_SRC} type="video/mp4" />
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

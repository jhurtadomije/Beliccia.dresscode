// src/components/InstagramCarousel.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import Carousel from "bootstrap/js/dist/carousel";
import InstagramEmbed from "./InstagramEmbed";

const instagramPermalinks = [
  "https://www.instagram.com/p/DR11E6rAsvt/",
  "https://www.instagram.com/p/DR4YjLdDCDy/",
  "https://www.instagram.com/p/DRmXD5Cgl8u/",
  "https://www.instagram.com/p/DRRw60rAo0w/",
  "https://www.instagram.com/p/DRep9qogk63/",
  "https://www.instagram.com/p/DRCVJADAiAN/",
];

function chunkArray(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}

function normalizeIndex(i, len) {
  if (len <= 0) return 0;
  return (i + len) % len;
}

export default function InstagramCarousel() {
  const carouselRef = useRef(null);
  const instanceRef = useRef(null);

  const getChunkSize = () => (window.innerWidth < 768 ? 1 : 3);
  const [chunkSize, setChunkSize] = useState(getChunkSize());

  //  slide activa (para cargar solo lo necesario)
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const onResize = () => setChunkSize(getChunkSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pages = useMemo(
    () => chunkArray(instagramPermalinks, chunkSize),
    [chunkSize]
  );

  //  si cambia el número de páginas (por resize), resetea activeIndex para evitar indices inválidos
  useEffect(() => {
    setActiveIndex(0);
  }, [pages.length]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    if (pages.length <= 1) return;

    const instance = Carousel.getOrCreateInstance(el, {
      interval: 5000,
      ride: false,
      pause: false,
      touch: true,
      wrap: true,
    });

    instanceRef.current = instance;
    instance.cycle();

    const onSlid = (e) => {
      // e.to = índice de la slide destino en Bootstrap
      if (typeof e?.to === "number") setActiveIndex(e.to);
    };

    el.addEventListener("slid.bs.carousel", onSlid);

    return () => {
      el.removeEventListener("slid.bs.carousel", onSlid);
      instance.dispose();
      instanceRef.current = null;
    };
  }, [pages.length]);

  if (!instagramPermalinks.length) {
    return <p className="text-center text-muted">No hay publicaciones aún.</p>;
  }

  // ✅ Render window: activa + next (+ prev opcional)
  const len = pages.length;
  const prevIndex = normalizeIndex(activeIndex - 1, len);
  const nextIndex = normalizeIndex(activeIndex + 1, len);

  const shouldLoadSlide = (idx) => idx === activeIndex || idx === nextIndex || idx === prevIndex;

  return (
    <div id="instaCarousel" ref={carouselRef} className="carousel slide">
      <div className="carousel-inner">
        {pages.map((page, pageIndex) => {
          const canLoad = shouldLoadSlide(pageIndex);

          return (
            <div
              key={pageIndex}
              className={`carousel-item ${pageIndex === 0 ? "active" : ""}`}
            >
              <div className="row g-2 justify-content-center">
                {page.map((url, i) => (
                  <div
                    key={i}
                    className={chunkSize === 1 ? "col-12" : "col-12 col-md-4"}
                  >
                    <div className="insta-card">
                      <div className="insta-card-inner">
                        <InstagramEmbed
                          permalink={url}
                          title={`Instagram Beliccia - publicación ${pageIndex * chunkSize + i + 1}`}
                          // ✅ SOLO carga iframe en slides cercanas
                          canLoad={canLoad}
                          // opcional: ajusta si quieres más/menos altura reservada
                          minHeight={520}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {pages.length > 1 && (
        <>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#instaCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Anterior</span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#instaCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Siguiente</span>
          </button>
        </>
      )}
    </div>
  );
}

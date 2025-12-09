// src/components/InstagramCarousel.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Carousel } from "bootstrap";
import InstagramEmbed from "./InstagramEmbed";

const instagramPermalinks = [
  "https://www.instagram.com/p/DR11E6rAsvt/",
  "https://www.instagram.com/p/DR4YjLdDCDy/",
  "https://www.instagram.com/p/DRmXD5Cgl8u/",
  "https://www.instagram.com/p/DRRw60rAo0w/",
  "https://www.instagram.com/p/DRep9qogk63/",
  "https://www.instagram.com/p/DRCVJADAiAN/",
];

// Utilidad para trocear en grupos de n elementos
function chunkArray(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

export default function InstagramCarousel() {
  const carouselRef = useRef(null);
  const instanceRef = useRef(null);

  const getChunkSize = () => (window.innerWidth < 768 ? 1 : 3);
  const [chunkSize, setChunkSize] = useState(getChunkSize());

  useEffect(() => {
    const onResize = () => setChunkSize(getChunkSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const pages = useMemo(
    () => chunkArray(instagramPermalinks, chunkSize),
    [chunkSize]
  );

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    // ✅ destruir instancia anterior
    if (instanceRef.current) {
      instanceRef.current.dispose();
      instanceRef.current = null;
    }

    // ✅ si solo hay 1 página, no tiene sentido animar
    if (pages.length <= 1) return;

    // ✅ crear nueva instancia controlada por React
    instanceRef.current = new Carousel(el, {
      interval: 3500,
      ride: false,  // importante: evitamos auto-ride
      pause: false,
      touch: true,
      wrap: true,
    });

    return () => {
      if (instanceRef.current) {
        instanceRef.current.dispose();
        instanceRef.current = null;
      }
    };
  }, [pages.length]); // no hace falta chunkSize explícito

  if (!instagramPermalinks.length) {
    return <p className="text-center text-muted">No hay publicaciones aún.</p>;
  }

  return (
    <div
      id="instaCarousel"
      ref={carouselRef}
      className="carousel slide"
      // ❌ NO data-bs-ride aquí
    >
      <div className="carousel-inner">
        {pages.map((page, pageIndex) => (
          <div
            key={pageIndex}
            className={`carousel-item ${pageIndex === 0 ? "active" : ""}`}
          >
            <div className="row g-4 justify-content-center">
              {page.map((url, i) => (
                <div
                  key={i}
                  className={chunkSize === 1 ? "col-12" : "col-12 col-md-4"}
                >
                  <div className="insta-card">
                    <div className="insta-card-inner">
                      <InstagramEmbed
                        html={`
                          <blockquote class="instagram-media"
                            data-instgrm-permalink="${url}"
                            data-instgrm-version="14"
                            style="background:#FFF; border:0; margin:0; padding:0; width:100%;">
                          </blockquote>
                        `}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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

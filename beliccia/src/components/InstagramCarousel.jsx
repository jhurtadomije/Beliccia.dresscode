// src/components/InstagramCarousel.jsx
import React, { useEffect, useState } from 'react';
import InstagramEmbed from './InstagramEmbed';

const instagramPermalinks = [
  'https://www.instagram.com/p/DJOk35ACGEv/',
  'https://www.instagram.com/p/DJFIcQ-CvCY/',
  'https://www.instagram.com/p/DI8nTcKCldc/',
  'https://www.instagram.com/p/DI5h33UiHEx/',
  'https://www.instagram.com/p/DItRd2KCx1h/?img_index=1',
  // añade más si quieres...
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
  // Estado para cambiar el número de publicaciones por slide
  const getChunkSize = () => (window.innerWidth < 768 ? 1 : 3);
  const [chunkSize, setChunkSize] = useState(getChunkSize());

  useEffect(() => {
    // Handler para resize
    const onResize = () => setChunkSize(getChunkSize());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const pages = chunkArray(instagramPermalinks, chunkSize);

  useEffect(() => {
    const carouselEl = document.getElementById('instaCarousel');
    if (carouselEl && window.bootstrap) {
      new window.bootstrap.Carousel(carouselEl, {
        interval: 3000,
        ride: 'carousel',
      });
    }
  }, [chunkSize]);

  return (
    <div id="instaCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {pages.map((page, pageIndex) => (
          <div
            key={pageIndex}
            className={`carousel-item${pageIndex === 0 ? ' active' : ''}`}
          >
            <div className="row g-4 justify-content-center">
              {page.map((url, i) => (
                <div key={i} className={chunkSize === 1 ? "col-12" : "col-12 col-md-4"}>
                  <InstagramEmbed html={`
                    <blockquote class="instagram-media"
                      data-instgrm-permalink="${url}"
                      data-instgrm-version="14"
                      style=" background:#FFF; border:0; margin:1px; max-width:540px; padding:0; width:100%;">
                    </blockquote>
                  `}/>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
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
    </div>
  );
}

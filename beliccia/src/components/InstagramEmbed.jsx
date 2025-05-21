// src/components/InstagramEmbed.jsx
import React, { useEffect, useRef } from 'react';

export default function InstagramEmbed({ html }) {
  const ref = useRef();

  useEffect(() => {
    // Inserta el bloque
    ref.current.innerHTML = html;
    // Llama al script de Instagram si existe
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else {
      // carga el SDK si no está
      const script = document.createElement('script');
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => window.instgrm.Embeds.process();
    }
  }, [html]);

  return <div ref={ref} />;
}

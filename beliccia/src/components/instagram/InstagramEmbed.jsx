// src/components/InstagramEmbed.jsx 
import React, { useEffect, useRef } from 'react'; 
export default function InstagramEmbed({ html }) { 
  const ref = useRef(); useEffect(() => { 
    if (ref.current) { 
      ref.current.innerHTML = html;
      const processInstagram = () => { 
        if (window.instgrm && window.instgrm.Embeds) { 
          window.instgrm.Embeds.process(); 
        } 
      }; 
      if (window.instgrm && window.instgrm.Embeds) {
         processInstagram(); 
        } 
        else {
           // Solo añade el script si no existe 
           if (!document.querySelector('script[src="https://www.instagram.com/embed.js"]')) {
             const script = document.createElement('script'); 
             script.src = "https://www.instagram.com/embed.js"; 
             script.async = true; script.onload = processInstagram; 
             document.body.appendChild(script); 
            } 
          } 
        } 
        // No hace falta limpiar nada al desmontar 
      }, [html]);
       return <div ref={ref} className="instagram-embed" />; }

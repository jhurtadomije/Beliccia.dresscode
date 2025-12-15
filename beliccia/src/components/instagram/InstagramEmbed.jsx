import { useEffect, useMemo, useRef, useState } from "react";

function toEmbedUrl(permalink) {
  const clean = String(permalink || "").trim();
  if (!clean) return null;
  return clean.endsWith("/") ? `${clean}embed` : `${clean}/embed`;
}

export default function InstagramEmbed({
  permalink,
  title = "Publicación de Instagram",
  minHeight = 360, 
  canLoad = true,  
}) {
  const hostRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const src = useMemo(() => toEmbedUrl(permalink), [permalink]);

  // si cambia la URL, vuelve a lazy-load
  useEffect(() => {
    setVisible(false);
  }, [src]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const shouldRenderIframe = Boolean(canLoad && visible && src);

  return (
    <div
      ref={hostRef}
      className="instagram-embed"
      style={{
        width: "100%",
        minHeight,
        aspectRatio: "1 / 1", 
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {visible && src && canLoad ? ( 
        <iframe
          title={title}
          src={src}
          loading="lazy"
          scrolling="no"
          allow="encrypted-media; picture-in-picture; clipboard-write"
          style={{ border: 0, width: "100%", height: "100%" }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%" }} />
      )}
    </div>
  );
}
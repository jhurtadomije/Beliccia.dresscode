// src/components/ZigZagBlock.jsx
export default function ZigZagBlock({ eyebrow, title, text, img, side, cta }) {
  const cardSide = side === "left" ? "left" : "right";

  return (
    <section className="py-4">
      <div className="container">
        <div className="mx-auto" style={{ maxWidth: 1100 }}>
          <div className="jr-zz rounded-4 overflow-hidden shadow-sm">
            {/* Imagen */}
            <div className="jr-zz-media">
              <img
                src={img}
                alt={title}
                className="w-100 h-100"
                style={{ objectFit: "cover" }}
                loading="lazy"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
              <div className="jr-zz-overlay" aria-hidden="true" />
            </div>

            {/* Card (desktop flotante, mobile normal) */}
            <div className={`jr-zz-cardWrap ${cardSide === "left" ? "is-left" : "is-right"}`}>
              <div className="jr-glass-card jr-zz-card rounded-4 p-4">
                {eyebrow && (
                  <p className="text-uppercase small text-muted mb-2">{eyebrow}</p>
                )}
                <h3 className="h4 mb-2">{title}</h3>
                <p className="text-muted mb-3" style={{ lineHeight: 1.7 }}>
                  {text}
                </p>
                {cta ? <div className="d-flex flex-wrap gap-2">{cta}</div> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

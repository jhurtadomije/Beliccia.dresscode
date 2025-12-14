import { useEffect, useState } from "react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      aria-label="Subir arriba"
      title="Subir arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="shadow-none"
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        zIndex: 2200,

        width: 46,
        height: 46,
        borderRadius: 999,

        border: "1px solid rgba(0,0,0,.10)",
        background: "rgba(206, 206, 206, 0.56)",
        backdropFilter: "blur(10px)",

        display: "grid",
        placeItems: "center",

        cursor: "pointer",
        transition: "transform .15s ease, opacity .15s ease, box-shadow .15s ease",
        boxShadow: "0 10px 30px rgba(0,0,0,.12)",
        opacity: 0.95,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 14px 36px rgba(0,0,0,.16)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,.12)";
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={{ opacity: 0.85 }}
      >
        <path
          d="M12 5l-7 7m7-7l7 7M12 5v14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

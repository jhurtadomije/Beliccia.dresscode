// src/pages/Atelier.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { usePageMeta } from "../hooks/usePageMeta";
import CitaModal from "../components/CitaModal";
import ZigZagBlock from "../components/ZigZagBlock";

const CTA_PRODUCTO = {
  id: null,
  categoria_id: null,
  nombre: "Cita Atelier Beliccia",
  imagen_portada: "/placeholder.png",
};

// ✅ Imágenes reales (según tu carpeta /src/assets/img/atelier)
const IMAGES_ATELIER = [
  "/src/assets/img/atelier/patronando.jpg", // 0 HERO (patrones / precisión)
  "/src/assets/img/atelier/diseñando.jpg",  // 1 idea/diseño
  "/src/assets/img/atelier/cosiendo.png",   // 2 confección
  "/src/assets/img/atelier/brindis.jpg",    // 3 entrega / emoción
];

export default function Atelier() {
  usePageMeta({
    title: "Atelier | Beliccia Dress Code",
    description:
      "Atelier Beliccia: diseño a medida, ajustes y personalización en nuestro propio taller para que el vestido encaje perfecto.",
  });

  const [open, setOpen] = useState(false);
  const openCita = () => setOpen(true);
  const closeCita = () => setOpen(false);

  return (
    <main className="py-5">
      <div className="container">
        {/* CARDS 3 EN 3 */}
        <section className="py-4">
          <div className="text-center mb-4">
            <h2 className="h1 mb-4">Qué hacemos en Atelier</h2>
            <p className="text-muted mb-0">
              Un servicio completo para que el vestido quede perfecto.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 text-center">
                <div className="mb-3" style={{ fontSize: 28 }}>🧷</div>
                <h3 className="h5">Ajustes y entalles</h3>
                <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>
                  Largo, cintura, pecho, mangas y escotes: comodidad real y
                  un acabado limpio.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 text-center">
                <div className="mb-3" style={{ fontSize: 28 }}>🧵</div>
                <h3 className="h5">Personalización</h3>
                <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>
                  Espaldas, tirantes, cinturillas, forros y detalles especiales
                  (siempre que sea viable).
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 text-center">
                <div className="mb-3" style={{ fontSize: 28 }}>🎨</div>
                <h3 className="h5">Diseño a medida</h3>
                <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>
                  Creamos tu vestido desde cero, adaptándolo a tu estilo, tu
                  cuerpo y tu historia.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HERO */}
        <section className="p-4 p-md-5 rounded-4 shadow-sm mb-4 bg-light">
          <div className="row align-items-center g-4">
            

            <div className="col-12 col-lg-6">
              <div
                className="rounded-4 overflow-hidden shadow-sm"
                style={{ aspectRatio: "4 / 3" }}
              >
                <img
                  src={IMAGES_ATELIER[0]}
                  alt="Patronaje y precisión en el atelier"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <p className="text-uppercase small text-muted mb-2">
                Atelier Beliccia
              </p>
              <h2 className="display-6 mb-3">
                Donde cada detalle cobra sentido
              </h2>
              <p className="lead mb-4" style={{ lineHeight: 1.7 }}>
                Aquí damos forma al vestido soñado: cuidamos proporciones, caída,
                confort y acabados para que todo encaje contigo.
              </p>

              <div className="d-flex flex-wrap gap-2">
                <button type="button" className="btn btn-dark" onClick={openCita}>
                  Pide tu cita
                </button>
                <Link className="btn btn-outline-dark" to="/conocenos">
                  Conócenos
                </Link>
                <Link className="btn btn-outline-secondary" to="/visitanos">
                  Visítanos
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ZIG-ZAG: ya lo controlas con side/left-right */}
        <section className="mt-4">
          <ZigZagBlock
            eyebrow="Diseño"
            title="De la idea a una propuesta real"
            text="Escuchamos lo que buscas y te guiamos con criterio. Definimos estilo, líneas y detalles para que el diseño tenga sentido en ti."
            img={IMAGES_ATELIER[1]}
            side="riht"
          />

          <div className="my-4" />

          <ZigZagBlock
            eyebrow="Confección"
            title="Manos, oficio y cuidado"
            text="Cosemos con precisión y revisamos cada parte: estructura, forros y terminaciones. Lo importante: que se vea bonito y se sienta cómodo."
            img={IMAGES_ATELIER[2]}
            side="right"
          />

          <div className="my-4" />

          <ZigZagBlock
            eyebrow="Final"
            title="Último repaso y entrega con ilusión"
            text="Ajuste final, planchado y recomendaciones. Queremos que llegues al gran día tranquila, segura y disfrutando."
            img={IMAGES_ATELIER[3]}
            side="right"
          />
        </section>

        {/* CTA FINAL */}
        <section className="mt-4">
          <div className="p-4 p-md-5 rounded-4 shadow-sm bg-light d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <h2 className="h3 mb-2">¿Quieres una cita en el atelier?</h2>
              <p className="text-muted mb-0">
                Te asesoramos y te guiamos para conseguir el resultado ideal.
              </p>
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-dark" onClick={openCita}>
                Solicita tu cita
              </button>
              <Link className="btn btn-outline-dark" to="/visitanos">
                Visitanos
              </Link>
            </div>
          </div>
        </section>
      </div>

      <CitaModal open={open} onClose={closeCita} producto={CTA_PRODUCTO} />
    </main>
  );
}

// src/pages/Conocenos.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { usePageMeta } from "../hooks/usePageMeta";
import CitaModal from "../components/CitaModal";
import ZigZagBlock from "../components/ZigZagBlock";

const CTA_PRODUCTO = {
  id: null,
  categoria_id: null,
  nombre: "Cita en Beliccia Dress Code",
  imagen_portada: "/placeholder.png",
};

const IMAGES_CONOCENOS = [
  "imagenes/img/conocenos/logoLuz.png",
  "imagenes/img/conocenos/entrada.jpg",
  "imagenes/img/conocenos/pasilloNovias.jpg",
  "imagenes/img/conocenos/pasilloMadrinas.jpg",
  "imagenes/img/conocenos/zonaInvitadas.jpg",
  "imagenes/img/conocenos/zonaComplementos.jpg",
];

export default function Conocenos() {
  usePageMeta({
    title: "Conócenos | Beliccia Dress Code",
    description:
      "Beliccia Dress Code nace de la fusión de nuestros nombres. Tres emprendedoras apasionadas por el mundo nupcial, con asesoramiento personalizado y atelier propio.",
  });

  const [open, setOpen] = useState(false);

  const openCita = () => setOpen(true);
  const closeCita = () => setOpen(false);

  return (
    <main className="py-5">
      <div className="container">
        {/* CARDS 3 EN 3 (aireadas) */}
        <section className="py-4">
          <div className="text-center mb-4">
            <h2 className="h1 mb-3">Nuestra filosofía</h2>
            <p className="text-muted mb-1">
              Atención al detalle, honestidad y una experiencia cuidada.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 text-center">
                <div className="mb-3" style={{ fontSize: 28 }}>
                  ✨
                </div>
                <h3 className="h5">Personalización real</h3>
                <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>
                  Ajustamos y adaptamos para que el vestido hable de ti y encaje
                  contigo.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 text-center">
                <div className="mb-3" style={{ fontSize: 28 }}>
                  🤍
                </div>
                <h3 className="h5">Asesoramiento cercano</h3>
                <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>
                  Te guiamos con calma y criterio para acertar con estilo,
                  proporción y caída.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-white rounded-4 shadow-sm h-100 text-center">
                <div className="mb-3" style={{ fontSize: 28 }}>
                  🧵
                </div>
                <h3 className="h5">Selección exclusiva</h3>
                <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>
                  Diseños para novia, madrina e invitada, con una selección
                  cuidada y especial.
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
                className="rounded-4 overflow-hidden shadow-sm position-relative"
                style={{ aspectRatio: "4 / 3" }}
              >
                {/* Fondo “recortado” usando la propia imagen */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${IMAGES_CONOCENOS[0]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(14px)",
                    transform: "scale(1.15)",
                    opacity: 0.9,
                  }}
                />

                {/* Capa para bajar contraste y que quede más pro */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(520px 380px at 55% 52%, rgba(255,245,220,.18), transparent 60%)," +
                      "linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.25))",
                  }}
                />

                {/* PNG limpio encima */}
                <img
                  src={IMAGES_CONOCENOS[0]}
                  alt="Beliccia Dress Code"
                  style={{
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                    display: "block",
                    transform: "scale(1.30)",
                  }}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <p className="text-uppercase small text-muted mb-2">
                Sobre nosotras
              </p>

              {/* ✅ H1 del contenido */}
              <h1 className="display-6 mb-3">Beliccia Dress Code</h1>

              <p className="lead mb-4" style={{ lineHeight: 1.7 }}>
                Nace de la fusión de nuestros nombres: una mezcla que refleja
                quiénes somos, lo que nos inspira y la pasión que compartimos.
              </p>

              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={openCita}
                >
                  Pedir cita
                </button>
                <Link className="btn btn-outline-dark" to="/atelier">
                  Atelier
                </Link>
                <Link className="btn btn-outline-secondary" to="/visitanos">
                  Visítanos
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TEXTO */}
        <section className="mb-4">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <p className="mb-2" style={{ lineHeight: 1.8 }}>
                Somos <strong>tres jóvenes emprendedoras</strong>, apasionadas
                por el mundo nupcial y con experiencia acompañando a novias en
                uno de los momentos más importantes de su vida.
              </p>
              <p className="mb-0 text-muted" style={{ lineHeight: 1.8 }}>
                Nuestra misión es{" "}
                <strong>
                  transformar cada sueño en una experiencia única, auténtica y
                  llena de emoción
                </strong>
                .
              </p>
            </div>
          </div>
        </section>

        {/* ZIG-ZAG — textos alineados a tus imágenes reales */}
        <section className="mt-4">
          <ZigZagBlock
            side="left"
            eyebrow="Bienvenida"
            title="Un espacio pensado para disfrutarse"
            text="Desde que entras, queremos que te sientas en calma. Aquí todo está preparado para vivir una experiencia bonita, cuidada y sin prisas."
            img={IMAGES_CONOCENOS[1]} // entrada
          />

          <div className="my-4" />

          <ZigZagBlock
            side="left"
            eyebrow="Novias"
            title="Encontrar “el vestido” empieza aquí"
            text="Probamos con criterio: silueta, caída y sensación. Te guiamos para que el vestido encaje contigo y con lo que quieres transmitir."
            img={IMAGES_CONOCENOS[2]} // pasilloNovias
          />

          <div className="my-4" />

          <ZigZagBlock
          side="left"
            eyebrow="Madrinas"
            title="Elegancia con asesoramiento real"
            text="Buscamos un look favorecedor y elegante, cuidando proporciones, tejidos y estilo. Te ayudamos a acertar con seguridad."
            img={IMAGES_CONOCENOS[3]} // pasilloMadrinas
          />

          <div className="my-4" />

          <ZigZagBlock
            side="right"
            eyebrow="Invitadas"
            title="Estilo, tendencia y comodidad"
            text="Seleccionamos diseños que sientan bien y te hacen sentir tú. Te asesoramos para que vayas ideal y cómoda en tu evento."
            img={IMAGES_CONOCENOS[4]} // zonaInvitadas
          />

          <div className="my-4" />

          <ZigZagBlock
            eyebrow="Complementos"
            title="El toque final perfecto"
            text="Bolsos, tocados y detalles que elevan el conjunto. Aquí encontramos ese complemento que remata el look y lo hace redondo."
            img={IMAGES_CONOCENOS[5]} // zonaComplementos
          />
        </section>

        {/* CTA FINAL */}
        <section className="mt-4">
          <div className="p-4 p-md-5 rounded-4 shadow-sm bg-light d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <h2 className="h4 mb-1">¿Te ayudamos a encontrar tu vestido?</h2>
              <p className="text-muted mb-0">
                Pide cita y ven a conocernos. Te asesoramos personalmente.
              </p>
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-dark" onClick={openCita}>
                Pedir cita
              </button>
              <Link className="btn btn-outline-dark" to="/visitanos">
                Visítanos
              </Link>
            </div>
          </div>
        </section>

        {/* Firma */}
        <section className="text-center mt-5">
          <p className="mb-1 text-muted">Atentamente,</p>
          <p className="fw-semibold mb-0">Equipo Beliccia Dress Code</p>
        </section>
      </div>

      <CitaModal open={open} onClose={closeCita} producto={CTA_PRODUCTO} />
    </main>
  );
}

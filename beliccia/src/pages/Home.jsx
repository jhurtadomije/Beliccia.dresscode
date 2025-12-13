// src/pages/Home.jsx
import Hero from "../components/Hero";
import Collections from "../components/Collections";
import InstagramCarousel from "../components/instagram/InstagramCarousel";
import About from "../components/About";
import Services from "../components/Services";
import Contact from "../components/Contact";
import InstagramStoriesCTA from "../components/instagram/InstagramFloatingStories";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Home() {
  usePageMeta({
    title: "Beliccia Dress Code | Novias, Madrinas e Invitadas",
    description:
      "Vestidos de novia, madrina e invitada con asesoramiento personalizado y atelier propio. Descubre nuestras colecciones y solicita información.",
  });

  return (
    <>
      <Hero />

      <Collections />

      <About />
      <Services />

      <section id="instagram" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Últimas en Instagram</h2>
          <InstagramCarousel />
        </div>
      </section>

      <Contact />
    </>
  );
}

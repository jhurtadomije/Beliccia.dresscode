// src/pages/Home.jsx
import Hero from '../components/Hero';
import Collections from '../components/Collections';
import InstagramCarousel from '../components/InstagramCarousel';
import About from '../components/About';
import Services from '../components/Services';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <Collections />
      <section id="instagram" className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Últimas en Instagram</h2>
          <InstagramCarousel />
        </div>
      </section>
      <About />
      <Services />
      <Contact />
    </>
  );
}

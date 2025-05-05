import { useState } from 'react'
import Header from './components/Header';
import Hero from './components/Hero'; 
import Collections from './components/Collections';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';

  function App() {
    return (
      <>
        <Header />
        <Hero />
        <Collections />
        <About />
        <Services />
        <Contact />
        <Footer />
       
      </>
    );
  }
  

export default App;

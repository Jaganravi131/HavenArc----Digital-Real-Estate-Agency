import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PropertyGrid from './components/PropertyGrid';
import Benefits from './components/Benefits';
import Process from './components/Process';
import RegistrationForm from './components/RegistrationForm';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PropertyGrid />
        <Benefits />
        <Process />
        <RegistrationForm />
      </main>
      <Footer />
    </>
  );
}

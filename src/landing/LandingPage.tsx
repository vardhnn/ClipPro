import { LazyMotion, domAnimation } from 'motion/react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { OverlayDemo } from './components/OverlayDemo';
import { Workflow } from './components/Workflow';
import { Features } from './components/Features';
import { Faq } from './components/Faq';
import { Cta, Footer } from './components/Cta';

export function LandingPage() {
  return (
    // `domAnimation` covers reveals, variants, enter/exit, hover and tap. Layout
    // animations are deliberately left out so the animation runtime ships only
    // the code this page actually uses.
    <LazyMotion features={domAnimation} strict>
      <div className="flex min-h-screen flex-col bg-[#0a0a0c] font-sans text-gray-200 antialiased">
        <Nav />
        <main className="flex-1">
          <Hero />
          <OverlayDemo />
          <Workflow />
          <Features />
          <Faq />
          <Cta />
        </main>
        <Footer />
      </div>
    </LazyMotion>
  );
}
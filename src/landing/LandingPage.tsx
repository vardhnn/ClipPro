import { LazyMotion, domAnimation } from 'motion/react';
import { Nav } from './components/Nav';
import { Backdrop } from './components/Backdrop';
import { Hero } from './components/Hero';
import { OverlayDemo } from './components/OverlayDemo';
import { Workflow } from './components/Workflow';
import { Features } from './components/Features';
import { Faq } from './components/Faq';
import { Cta, Footer } from './components/Cta';
import { surface } from '../theme';

export function LandingPage() {
  return (
    // `domAnimation` covers reveals, variants, enter/exit, hover and tap. Layout
    // animations are deliberately left out so the animation runtime ships only
    // the code this page actually uses.
    <LazyMotion features={domAnimation} strict>
      {/* `overflow-x-clip` keeps the blurred backdrop from ever producing a
          horizontal scrollbar on narrow screens. */}
      <div className={`relative flex min-h-screen flex-col overflow-x-clip ${surface.page}`}>
        <Backdrop />
        <Nav />
        <main className="relative z-10 flex-1">
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
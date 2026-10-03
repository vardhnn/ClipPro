import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { OverlayDemo } from './components/OverlayDemo';
import { Workflow } from './components/Workflow';
import { Features } from './components/Features';
import { Faq } from './components/Faq';
import { Cta, Footer } from './components/Cta';

export function LandingPage() {
  return (
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
  );
}
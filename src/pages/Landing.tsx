import { useEffect } from "react";
import { ExamplePitches } from "@/components/ExamplePitches";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { ForYou } from "@/components/ForYou";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { LaunchVideo } from "@/components/LaunchVideo";
import { Navbar } from "@/components/Navbar";
import { Pricing } from "@/components/Pricing";
import { Problem } from "@/components/Problem";
import { Trust } from "@/components/Trust";
import { Why } from "@/components/Why";
import { content } from "@/content";
import { useReveal } from "@/hooks/useReveal";

export default function Landing() {
  useReveal();
  useEffect(() => { document.title = content.seo.title; }, []);
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-brand focus:px-5 focus:py-3 focus:font-semibold focus:text-ink">
        {content.a11y.skipToContent}
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <LaunchVideo />
        <Problem />
        <HowItWorks />
        <ForYou />
        <ExamplePitches />
        <Why />
        <Trust />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}

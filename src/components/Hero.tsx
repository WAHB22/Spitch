import { MapPinIcon } from "@phosphor-icons/react";
import { content } from "@/content";
import { PhoneMockup } from "./PhoneMockup";

const hero = content.hero;

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="on-dark relative overflow-hidden bg-ink text-white">
      <div className="container-x grid items-center gap-14 pt-12 pb-20 md:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pt-20 lg:pb-28">
        <div className="max-w-[640px]">
          <p className="hero-rise tag min-h-9 gap-2 border border-white/15 bg-white/5 px-4 text-sm text-white" style={{ ["--i" as string]: 0 }}>
            <MapPinIcon size={16} weight="fill" className="text-brand" aria-hidden="true" />
            {hero.badge}
          </p>
          <h1 id="hero-title" className="hero-rise mt-6 text-[clamp(3rem,9vw,6.25rem)] font-bold leading-[0.95] tracking-[-0.045em]" style={{ ["--i" as string]: 1 }}>
            {hero.headline}
          </h1>
          <p className="hero-rise mt-6 max-w-[34ch] text-lg leading-relaxed text-muted-dark md:text-xl" style={{ ["--i" as string]: 2 }}>
            {hero.subline}
          </p>
          <div className="hero-rise mt-9 flex flex-wrap gap-3" style={{ ["--i" as string]: 3 }}>
            <a href="#waitlist" className="btn btn-primary min-h-13 px-7 text-[17px]">{hero.primaryCta}</a>
            <a href="#how-it-works" className="btn btn-ghost-dark min-h-13 px-7 text-[17px]">{hero.secondaryCta}</a>
          </div>
        </div>

        <div className="relative">
          {/* The brand dot, grown large, sitting behind the phone. */}
          <span aria-hidden="true" className="absolute top-1/2 left-1/2 size-[min(88vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand" />
          <span aria-hidden="true" className="absolute top-[12%] left-[6%] size-16 rounded-full border-2 border-white/15" />
          <div className="relative">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

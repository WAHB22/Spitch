import { content } from "@/content";
import { WaitlistForm } from "./WaitlistForm";

export function FinalCta() {
  const c = content.finalCta;
  return (
    <section id="waitlist" aria-labelledby="waitlist-title" className="on-dark relative overflow-hidden bg-ink py-20 text-white md:py-28">
      <span aria-hidden="true" className="absolute -bottom-40 -left-40 size-[420px] rounded-full bg-brand md:size-[560px]" />
      <div className="container-x relative grid items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="lg:pt-6">
          <h2 id="waitlist-title" className="text-[clamp(3rem,9vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.045em]">{c.title}</h2>
          <p className="mt-6 max-w-[32ch] text-lg leading-relaxed text-muted-dark md:text-xl">{c.subline}</p>
        </div>
        <WaitlistForm />
      </div>
    </section>
  );
}

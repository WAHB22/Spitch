import { content } from "@/content";
import { Section } from "./Section";

export function Why() {
  const w = content.why;
  return (
    <Section tone="dark" labelledBy="why-title" className="md:py-36">
      <div className="max-w-[1000px]">
        <span aria-hidden="true" className="mb-8 block size-5 rounded-full bg-brand md:size-6" />
        <h2 id="why-title" data-reveal className="text-[clamp(2.25rem,6.4vw,5.25rem)] font-bold leading-[1]">
          {w.lead}
        </h2>
        <p data-reveal style={{ ["--i" as string]: 1 }} className="mt-8 max-w-[40ch] text-xl leading-relaxed text-muted-dark md:text-2xl">
          {w.rest}
        </p>
      </div>
    </Section>
  );
}

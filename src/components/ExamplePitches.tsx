import { content } from "@/content";
import { cn } from "@/lib/utils";
import { PitchCard } from "./PitchCard";
import { Section } from "./Section";

/** Tilts, so the cards sit like a hand of pitches rather than a row of tiles. */
const TILT = ["md:-rotate-2 md:translate-y-4", "md:rotate-1 md:-translate-y-2", "md:-rotate-1 md:translate-y-6"];

export function ExamplePitches() {
  const e = content.examples;
  return (
    <Section tone="light" labelledBy="examples-title" className="overflow-hidden">
      <h2 id="examples-title" data-reveal className="text-[clamp(2.25rem,6vw,4rem)] font-bold">
        {e.title}, <span className="text-muted">{e.label}</span>
      </h2>
      {/* Swipe through them on a phone; side by side on wider screens. */}
      <ul
        className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-2 pb-10 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-6"
        tabIndex={0}
        aria-label={`${e.title}, ${e.label}`}
      >
        {e.pitches.map((p, i) => (
          <li key={p.title} data-reveal style={{ ["--i" as string]: i }} className={cn("w-[82%] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none", TILT[i])}>
            <PitchCard pitch={p} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

import { CheckIcon, UsersThreeIcon } from "@phosphor-icons/react";
import { content, type Role } from "@/content";
import { chooseRole } from "@/lib/events";
import { cn } from "@/lib/utils";
import { Section } from "./Section";

type Audience = { label: string; title: string; benefits: readonly string[]; cta: string };

export function ForYou() {
  const f = content.forYou;
  return (
    <Section id="for-you" tone="dark" labelledBy="for-you-title">
      <h2 id="for-you-title" className="sr-only">{f.title}</h2>
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        <Card audience={f.pitchers} role="pitcher" light index={0} />
        <Card audience={f.builders} role="builder" index={1} />
      </div>
      <p data-reveal className="mt-10 flex items-center justify-center gap-3 text-center font-display text-xl font-semibold tracking-tight md:text-2xl">
        <UsersThreeIcon size={28} weight="bold" className="shrink-0 text-brand" aria-hidden="true" />
        {f.teamUp}
      </p>
    </Section>
  );
}

function Card({ audience, role, light = false, index }: { audience: Audience; role: Role; light?: boolean; index: number }) {
  return (
    <article
      data-reveal
      style={{ ["--i" as string]: index }}
      className={cn(
        "flex flex-col rounded-[28px] p-7 md:p-10",
        light ? "on-light bg-card text-ink" : "border border-line-dark bg-ink-2 text-white",
      )}
    >
      <span className={cn("tag self-start", light ? "bg-paper text-ink" : "bg-white/10 text-white")}>{audience.label}</span>
      <h3 className="mt-6 max-w-[16ch] text-[clamp(1.9rem,3.6vw,2.9rem)] font-bold">{audience.title}</h3>
      <ul className="mt-7 flex flex-col gap-3.5">
        {audience.benefits.map((b) => (
          <li key={b} className="flex gap-3">
            <span className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-full", light ? "bg-ink text-white" : "bg-brand text-ink")} aria-hidden="true">
              <CheckIcon size={14} weight="bold" />
            </span>
            <span className={light ? "text-ink/80" : "text-muted-dark"}>{b}</span>
          </li>
        ))}
      </ul>
      <a href="#waitlist" onClick={() => chooseRole(role)} className="btn btn-primary mt-9 self-start">
        {audience.cta}
      </a>
    </article>
  );
}

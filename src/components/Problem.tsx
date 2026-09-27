import { BriefcaseIcon, LightbulbFilamentIcon, WrenchIcon } from "@phosphor-icons/react";
import { content } from "@/content";
import { cn } from "@/lib/utils";
import { Section } from "./Section";

const ICONS = [LightbulbFilamentIcon, WrenchIcon, BriefcaseIcon];

export function Problem() {
  const p = content.problem;
  return (
    <Section tone="dark" labelledBy="problem-title">
      <h2 id="problem-title" data-reveal className="max-w-[14ch] text-[clamp(2.5rem,7vw,5rem)] font-bold">
        {p.title}
      </h2>
      {/* One tall card and two stacked ones, so the three problems do not read as a template row. */}
      <ul className="mt-12 grid gap-4 md:grid-cols-2 md:grid-rows-2">
        {p.cards.map((c, i) => {
          const Icon = ICONS[i];
          const lead = i === 0;
          return (
            <li
              key={c.title}
              data-reveal
              style={{ ["--i" as string]: i }}
              className={cn(
                "flex flex-col gap-4 rounded-[24px] border border-line-dark bg-ink-2 p-7 md:p-9",
                lead && "md:row-span-2 md:justify-between",
              )}
            >
              <span className={cn("grid place-items-center rounded-full bg-brand text-ink", lead ? "size-16" : "size-12")} aria-hidden="true">
                <Icon size={lead ? 32 : 24} weight="bold" />
              </span>
              <div>
                <h3 className={cn("font-bold", lead ? "text-[clamp(1.75rem,3.4vw,2.75rem)]" : "text-2xl")}>{c.title}</h3>
                <p className={cn("mt-3 text-muted-dark", lead ? "max-w-[30ch] text-lg" : "text-base")}>{c.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

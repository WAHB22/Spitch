import { ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { content } from "@/content";
import { cn } from "@/lib/utils";
import { Section } from "./Section";

export function Pricing() {
  const p = content.pricing;
  return (
    <Section id="pricing" tone="dark" labelledBy="pricing-title">
      <h2 id="pricing-title" data-reveal className="text-[clamp(2.5rem,7vw,5rem)] font-bold">{p.title}</h2>
      <ul className="mt-12 grid gap-4 md:grid-cols-2 md:gap-5">
        {p.plans.map((plan, i) => {
          const now = i === 0;
          return (
            <li
              key={plan.name}
              data-reveal
              style={{ ["--i" as string]: i }}
              className={cn("flex flex-col rounded-[28px] bg-ink-2 p-7 md:p-10", now ? "border-2 border-brand" : "border border-line-dark")}
            >
              <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
              <p className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-[clamp(3.5rem,9vw,6rem)] font-bold leading-none tracking-[-0.05em]">{plan.price}</span>
                {"unit" in plan && <span className="text-lg text-muted-dark">{plan.unit}</span>}
              </p>
              <p className="mt-5 text-lg text-muted-dark">{plan.body}</p>
            </li>
          );
        })}
      </ul>
      <div data-reveal className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="flex items-start gap-3 font-display text-xl font-semibold tracking-tight md:items-center md:text-2xl">
          <ArrowCounterClockwiseIcon size={26} weight="bold" className="mt-1 shrink-0 text-brand md:mt-0" aria-hidden="true" />
          {p.guarantee}
        </p>
        <p className="text-sm text-muted-dark md:text-right">{p.note}</p>
      </div>
    </Section>
  );
}

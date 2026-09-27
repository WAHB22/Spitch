import { ChatsCircleIcon, HandshakeIcon, SparkleIcon, VideoCameraIcon } from "@phosphor-icons/react";
import { content } from "@/content";
import { Section } from "./Section";

const ICONS = [VideoCameraIcon, SparkleIcon, ChatsCircleIcon, HandshakeIcon];

export function HowItWorks() {
  const h = content.howItWorks;
  return (
    <Section id="how-it-works" tone="light" labelledBy="how-title">
      <h2 id="how-title" data-reveal className="text-[clamp(2.5rem,7vw,5rem)] font-bold">{h.title}</h2>
      {/* A real sequence, so the steps are numbered. Vertical rail on phones, a row on wide screens. */}
      <ol className="mt-12 grid gap-0 lg:grid-cols-4 lg:gap-6">
        {h.steps.map((s, i) => {
          const Icon = ICONS[i];
          return (
            <li key={s.title} data-reveal style={{ ["--i" as string]: i }} className="relative grid grid-cols-[auto_1fr] gap-x-5 pb-10 last:pb-0 lg:block lg:pb-0">
              {i < h.steps.length - 1 && (
                <span aria-hidden="true" className="absolute top-14 bottom-0 left-7 w-px bg-line lg:top-7 lg:right-0 lg:bottom-auto lg:left-16 lg:h-px lg:w-auto" />
              )}
              <span className="relative grid size-14 place-items-center rounded-full bg-ink font-display text-xl font-bold text-white">
                {i + 1}
              </span>
              <div className="lg:mt-7">
                <h3 className="flex items-center gap-2 text-2xl font-bold">
                  {s.title}
                  <Icon size={22} weight="bold" className="text-brand-ink" aria-hidden="true" />
                </h3>
                <p className="mt-2 max-w-[34ch] text-ink/75">{s.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

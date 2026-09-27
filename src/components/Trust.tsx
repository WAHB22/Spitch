import { CheckCircleIcon, LockKeyIcon, MapPinIcon, UserCircleDashedIcon } from "@phosphor-icons/react";
import { content } from "@/content";
import { Section } from "./Section";

const ICONS = [MapPinIcon, UserCircleDashedIcon, LockKeyIcon, CheckCircleIcon];

export function Trust() {
  const t = content.trust;
  return (
    <Section tone="light" labelledBy="trust-title">
      <h2 id="trust-title" data-reveal className="max-w-[18ch] text-[clamp(2.25rem,6vw,4rem)] font-bold">{t.title}</h2>
      <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {t.items.map((item, i) => {
          const Icon = ICONS[i];
          return (
            <li key={item.title} data-reveal style={{ ["--i" as string]: i }} className="border-t-2 border-ink pt-6">
              <Icon size={30} weight="bold" className="text-brand-ink" aria-hidden="true" />
              <h3 className="mt-5 text-2xl font-bold">{item.title}</h3>
              <p className="mt-2 text-ink/75">{item.body}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

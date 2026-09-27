import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { content } from "@/content";
import { Section } from "./Section";

export function Faq() {
  const f = content.faq;
  const date = content.placeholders.launchDate;
  return (
    <Section id="faq" tone="light" labelledBy="faq-title">
      <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <h2 id="faq-title" data-reveal className="text-[clamp(2.5rem,7vw,5rem)] font-bold lg:sticky lg:top-28 lg:self-start">{f.title}</h2>
        <Accordion type="single" collapsible className="border-t border-ink/15">
          {f.items.map((item, i) => (
            <AccordionItem key={item.q} value={`q${i}`} className="border-b border-ink/15">
              <AccordionTrigger className="gap-4 rounded-none py-6 font-display text-lg font-semibold tracking-tight hover:no-underline md:text-xl [&_[data-slot=accordion-trigger-icon]]:size-5 [&_[data-slot=accordion-trigger-icon]]:text-ink">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="max-w-[62ch] pb-6 text-base leading-relaxed text-ink/75">
                {"withDate" in item && date ? item.withDate(date) : item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}

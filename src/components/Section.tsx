import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A page band. Bands alternate between ink (dark) and paper (light). */
export function Section({ id, tone, className, children, labelledBy }: {
  id?: string; tone: "dark" | "light"; className?: string; children: ReactNode; labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(tone === "dark" ? "on-dark bg-ink text-white" : "bg-paper text-ink", "py-20 md:py-28", className)}
    >
      <div className="container-x">{children}</div>
    </section>
  );
}

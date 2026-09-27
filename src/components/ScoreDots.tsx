import { content } from "@/content";
import { cn } from "@/lib/utils";

/** A compatibility score out of 5: five dots, the earned ones in orange, and the number. */
export function ScoreDots({ score, className }: { score: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)} role="img" aria-label={content.a11y.score(score)}>
      <span className="flex gap-1" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={cn("size-2.5 rounded-full", i < score ? "bg-brand" : "bg-line")} />
        ))}
      </span>
      <span aria-hidden="true" className="font-display text-sm font-bold tabular-nums">
        {score}/5
      </span>
    </span>
  );
}

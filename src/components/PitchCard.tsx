import { HeartIcon, PlayIcon, SparkleIcon, XIcon } from "@phosphor-icons/react";
import { content, type Pitch } from "@/content";
import { cn } from "@/lib/utils";
import { ScoreDots } from "./ScoreDots";

const ui = content.mockUi;

/**
 * A pitch as it appears in the app: the video pitch, the AI summary, what it needs, and how
 * compatible it is. Used in the hero phone and in the example pitches, so both show the same UI.
 */
export function PitchCard({ pitch, compact = false, actions = true, className }: {
  pitch: Pitch; compact?: boolean; actions?: boolean; className?: string;
}) {
  const Title = compact ? "p" : "h3";
  return (
    <article className={cn("flex flex-col rounded-[20px] border border-line bg-card text-ink shadow-[0_18px_40px_-24px_rgb(14_15_18/0.35)]", compact ? "gap-3 p-3" : "gap-4 p-4", className)}>
      {/* The video pitch. Faces are optional, so the poster is abstract. */}
      <div className={cn("relative overflow-hidden rounded-[14px] bg-ink", compact ? "aspect-[16/9]" : "aspect-[16/10]")} aria-hidden="true">
        <span className="absolute -right-6 -bottom-10 size-32 rounded-full bg-brand" />
        <span className="absolute top-4 -left-8 size-20 rounded-full border-[10px] border-ink-2 bg-line-dark" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-11 place-items-center rounded-full bg-white/95 text-ink">
            <PlayIcon size={18} weight="fill" />
          </span>
        </span>
        <span className="tag absolute top-2.5 left-2.5 min-h-6 bg-ink/80 px-2.5 text-[11px] text-white">{ui.videoPitch}</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
          <SparkleIcon size={13} weight="fill" className="text-brand" aria-hidden="true" />
          {ui.aiSummary}
        </span>
        <Title className={cn("font-display font-bold tracking-[-0.02em]", compact ? "text-lg leading-tight" : "text-xl leading-tight")}>{pitch.title}</Title>
        <p className={cn("line-clamp-2 min-h-[2lh] text-ink/75", compact ? "text-[13px] leading-snug" : "text-sm leading-normal")}>{pitch.summary}</p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted">{ui.needs}</span>
        <ul className="flex flex-wrap gap-1.5">
          {pitch.needs.map((n) => (
            <li key={n} className={cn("tag bg-paper text-ink", compact && "min-h-6 px-2.5 text-xs")}>{n}</li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between border-t border-line pt-3">
        <span className="text-xs font-medium text-muted">{ui.compatibility}</span>
        <ScoreDots score={pitch.score} />
      </div>

      {actions && (
        <div className="flex items-center justify-center gap-4 pt-1" aria-hidden="true">
          <span className="grid size-11 place-items-center rounded-full border border-line text-ink" title={ui.pass}><XIcon size={18} weight="bold" /></span>
          <span className="grid size-11 place-items-center rounded-full bg-brand text-ink" title={ui.interested}><HeartIcon size={18} weight="fill" /></span>
        </div>
      )}
    </article>
  );
}

import { WORDMARK } from "@/config";
import { cn } from "@/lib/utils";

/** "spitch" in lowercase bold, with a small orange dot after it. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline font-display font-bold tracking-[-0.04em]", className)}>
      {WORDMARK}
      <span aria-hidden="true" className="ml-[0.06em] inline-block size-[0.26em] rounded-full bg-brand" />
    </span>
  );
}

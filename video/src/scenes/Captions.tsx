import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FPS, SEGMENTS, SERIF } from "../config";

/** Words to colour, per segment. The AI chat box gets the chat assistant green; the rest the site's orange. */
const HL: Record<string, string[]> = {
  l1: ["idea"], l2: ["financial", "freedom"], l3: ["died"], l4: ["means", "live"],
  l5a: ["projects"], l5r: ["resume"], l5b: ["rough"], l6a: ["tired"], l6b: ["thanks", "for", "your", "application"],
  l7a: ["introducing"], l7b: ["spitch"], l8: ["broadcast", "visibility", "partnerships", "collaborations"],
  l9: ["less", "than", "a", "minute", "swipe", "right", "or", "left", "connect"],
  l10a: ["pitchers", "builders", "means", "skills"], l10b: ["price", "of", "a", "coffee"],
  l11: ["market", "uottawa"], l12: ["fourth-year", "engineering", "live", "this", "problem"],
  l13: ["linkedin", "let's", "chat"], l14: ["swipe", "right"],
};
const GREEN: Record<string, string[]> = { l3: ["ai", "chat", "box"] };
const norm = (w: string) => w.toLowerCase().replace(/[^a-z'-]/g, "").replace(/^'|'$/g, "");

type Chunk = { words: { w: string; color?: string }[]; start: number; end: number };

/** Splits each spoken line into short caption chunks (max 7 words, breaking after punctuation). */
function chunks(): Chunk[] {
  const out: Chunk[] = [];
  const groups: { id: string; end: number; words: (typeof SEGMENTS)[number]["words"] }[] = [];
  for (const s of SEGMENTS) {
    const g = groups[groups.length - 1];
    const tagged = s.words.map((w) => ({ ...w, seg: s.id }));
    if (g && ["l5r", "l5c"].includes(s.id)) { g.words.push(...tagged); g.end = s.end; }
    else groups.push({ id: s.id, end: s.end, words: tagged });
  }
  for (const s of groups) {
    const words = (s.words as ((typeof SEGMENTS)[number]["words"][number] & { seg: string })[]).filter((w) => /[A-Za-z]/.test(w.w));
    let cur: typeof words = [];
    const flush = () => {
      if (!cur.length) return;
      out.push({
        start: cur[0].start,
        end: 0,
        words: cur.map((w) => {
          const n = norm(w.w);
          const sid = (w as { seg?: string }).seg ?? s.id;
          const color = GREEN[sid]?.includes(n) ? C.ai : HL[sid]?.includes(n) ? C.accent : undefined;
          return { w: w.w, color };
        }),
      });
      cur = [];
    };
    words.forEach((w, i) => {
      cur.push(w);
      const last = i === words.length - 1;
      const left = words.length - 1 - i; // never leave one or two words alone on the next caption
      if (last || (left > 2 && (cur.length >= 7 || (cur.length >= 3 && /[,.?]$/.test(w.w))))) flush();
    });
    out[out.length - 1].end = s.end + 0.35;
  }
  for (let i = 0; i < out.length; i++) if (!out[i].end) out[i].end = out[i + 1].start;
  return out;
}
const CHUNKS = chunks();

export const Captions = () => {
  const t = useCurrentFrame() / FPS;
  const c = CHUNKS.find((x) => t >= x.start - 0.05 && t < x.end);
  if (!c) return null;
  const inT = Math.min(1, (t - c.start + 0.05) / 0.12);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 92 }}>
      <div style={{ maxWidth: 1560, textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 64, lineHeight: 1.15, color: "#fff", padding: "14px 34px 18px", borderRadius: 18, background: "rgba(14,15,18,0.72)", opacity: inT, transform: `translateY(${(1 - inT) * 10}px)`, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
        {c.words.map((w, i) => (
          <span key={i} style={{ color: w.color ?? "#fff" }}>{w.w.replace(/^'/, "‘").replace(/'$/, "’").replace(/^resume$/, "résumé")}{i < c.words.length - 1 ? " " : ""}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

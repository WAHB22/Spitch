import timeline from "./timeline.json";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TOTAL_FRAMES = 60 * FPS; // hard cap: 60 seconds

/**
 * Assets. When you have them, drop the files in public/ and flip these:
 *  - public/facecam.mp4 (your face-cam for 0:00-0:25 and 0:48-0:57)
 *  - your own voice replaces audio/voice.wav, but it must be re-timed (timeline.json), so send it to be re-cut.
 */
export const HAS_FACECAM = false;

export const C = {
  ink: "#0E0F12",
  ink2: "#17181D",
  paper: "#F6F4EF",
  accent: "#FF5A1F", // the website's orange
  ai: "#10A37F", // "chat assistant" green, for the AI chat box
  muted: "#A3A3AB",
  line: "#2A2B31",
};

export const SERIF = '"Times New Roman", "Liberation Serif", Tinos, Times, serif';

type Word = { w: string; start: number; end: number };
type Segment = { id: string; text: string; start: number; end: number; words: Word[] };
export const SEGMENTS = (timeline as { segments: Segment[] }).segments;
export const VO_END = (timeline as { voEnd: number }).voEnd;

export const seg = (id: string) => {
  const s = SEGMENTS.find((x) => x.id === id);
  if (!s) throw new Error(`No segment ${id}`);
  return s;
};
/** Start time (s) of word i in segment id. */
export const at = (id: string, i: number) => seg(id).words[i].start;
export const f = (sec: number) => Math.round(sec * FPS);

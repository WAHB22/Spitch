import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { at, C, f, SERIF } from "../config";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0:00-0:01: the title card over the presenter, held a full second. */
export const IntroCard = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 4, f(1.05), f(1.35)], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: `rgba(14,15,18,${o})`, alignItems: "center", justifyContent: "center", opacity: o }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 230, color: "#fff", letterSpacing: 6, lineHeight: 1 }}>
        SPITCH<span style={{ color: C.accent }}>.</span>
      </div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: "#fff", marginTop: 28 }}>Mohamed Wahb Berguia</div>
    </AbsoluteFill>
  );
};

/** "The path to financial freedom": a rising line graph flashes, then fades. */
export const Graph = () => {
  const frame = useCurrentFrame();
  const s = f(at("l2", 0)), e = f(at("l3", 0)) + 4;
  const draw = interpolate(frame, [s, s + 30], [0, 1], clamp);
  const o = interpolate(frame, [s, s + 4, e - 8, e], [0, 1, 1, 0], clamp);
  const pts = "0,300 120,250 220,270 340,180 460,200 580,90 700,20";
  return (
    <AbsoluteFill style={{ opacity: o, alignItems: "flex-end", justifyContent: "center", paddingRight: 150 }}>
      <svg width="760" height="360" viewBox="-20 -20 740 340" style={{ filter: `drop-shadow(0 0 18px ${C.accent})` }}>
        <polyline points={pts} fill="none" stroke={C.accent} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
        <circle cx="700" cy="20" r={18 * draw} fill={C.accent} />
      </svg>
    </AbsoluteFill>
  );
};

/** "then it died in an AI chat box": a chat window, typing dots, then it greys out and fades. */
export const ChatBox = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = f(at("l3", 0)) - 4, died = f(at("l3", 2)), end = f(at("l4", 0)) - 2;
  const enter = spring({ frame: frame - s, fps, config: { damping: 200 } });
  const grey = interpolate(frame, [died, died + 12], [0, 1], clamp);
  const o = interpolate(frame, [s, s + 6, end - 14, end], [0, 1, 1, 0], clamp);
  const dot = (i: number) => 0.35 + 0.65 * Math.max(0, Math.sin((frame - s) / 4 - i * 0.9)) * (1 - grey);
  return (
    <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center", paddingRight: 150, opacity: o }}>
      <div style={{ width: 760, borderRadius: 26, background: "#212121", border: "1px solid #3a3a3a", padding: 30, filter: `grayscale(${grey}) brightness(${1 - grey * 0.35})`, transform: `translateY(${(1 - enter) * 40}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#ececec", fontFamily: "sans-serif", fontSize: 26, fontWeight: 600 }}>
          <span style={{ width: 16, height: 16, borderRadius: 8, background: C.ai }} /> AI chat
        </div>
        <div style={{ marginTop: 26, marginLeft: "auto", width: "fit-content", maxWidth: 560, background: "#303030", color: "#ececec", borderRadius: 22, padding: "16px 22px", fontFamily: "sans-serif", fontSize: 26 }}>
          I have an app idea that could change everything...
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 26, paddingLeft: 6 }}>
          {[0, 1, 2].map((i) => <span key={i} style={{ width: 16, height: 16, borderRadius: 8, background: C.ai, opacity: dot(i) }} />)}
        </div>
        <div style={{ marginTop: 26, borderRadius: 999, border: "1px solid #444", padding: "16px 24px", color: "#8e8e8e", fontFamily: "sans-serif", fontSize: 24 }}>Message</div>
      </div>
    </AbsoluteFill>
  );
};

/** "projects section ... rough?": a resume slides in, Projects is empty, ROUGH stamps on. */
export const Resume = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = f(at("l5a", 0)), rough = f(at("l5b", 0)), end = f(at("l6a", 0));
  const enter = spring({ frame: frame - s, fps, config: { damping: 20, stiffness: 120 } });
  const stamp = spring({ frame: frame - rough, fps, config: { damping: 9, stiffness: 180 } });
  const o = interpolate(frame, [s, s + 5, end - 8, end], [0, 1, 1, 0], clamp);
  const lines = (n: number, w = 1) => Array.from({ length: n }, (_, i) => <div key={i} style={{ height: 14, borderRadius: 7, background: "#d9d6cf", width: `${(92 - i * 13) * w}%`, marginTop: 12 }} />);
  const H = ({ t }: { t: string }) => <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: C.ink, marginTop: 26, borderBottom: "2px solid #0e0f12", paddingBottom: 4 }}>{t}</div>;
  return (
    <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center", paddingRight: 170, opacity: o }}>
      <div style={{ position: "relative", width: 560, height: 700, background: C.paper, borderRadius: 10, padding: "40px 46px", boxShadow: "0 30px 80px rgba(0,0,0,0.55)", transform: `translateX(${(1 - enter) * 700}px) rotate(${(1 - enter) * 6 + 1.5}deg)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 38, color: C.ink, lineHeight: 1.1 }}>Mohamed Wahb Berguia</div>
        <div style={{ fontFamily: SERIF, fontSize: 22, color: "#6b6b72", marginTop: 6, letterSpacing: 3 }}>RÉSUMÉ</div>
        <H t="Education" />{lines(2)}
        <H t="Experience" />{lines(3)}
        <H t="Projects" />
        <div style={{ marginTop: 14, height: 110, borderRadius: 10, border: "3px dashed #c9c5bc" }} />
        <div style={{ position: "absolute", left: "50%", top: "72%", transform: `translate(-50%,-50%) rotate(-12deg) scale(${0.4 + stamp * 0.6})`, opacity: Math.min(1, stamp * 1.5), fontFamily: SERIF, fontWeight: 700, fontSize: 150, color: C.accent, border: `8px solid ${C.accent}`, borderRadius: 16, padding: "0 30px", lineHeight: 1.1, background: "rgba(246,244,239,0.85)" }}>ROUGH</div>
      </div>
    </AbsoluteFill>
  );
};

const SENDERS = ["Talent Team", "Careers", "Recruiting", "HR Department", "No-reply", "Hiring Team", "Careers Portal"];
/** Inbox notifications stacking up, every one titled the same. */
export const INBOX_TIMES = SENDERS.map((_, i) => at("l6a", 0) + 0.35 + i * 0.5);
export const Inbox = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = f(at("l7a", 0)) - 2;
  const o = interpolate(frame, [end - 10, end], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "flex-end", paddingRight: 130, paddingTop: 70, opacity: o }}>
      {SENDERS.map((sender, i) => {
        const t = f(INBOX_TIMES[i]);
        const p = spring({ frame: frame - t, fps, config: { damping: 16, stiffness: 200 } });
        if (frame < t) return null;
        const glitch = frame - t < 3 ? (i % 2 ? 8 : -8) : 0;
        return (
          <div key={sender} style={{ width: 640, marginTop: 10, borderRadius: 18, background: "rgba(40,41,48,0.96)", border: "1px solid #3a3b42", padding: "10px 20px", transform: `translateX(${(1 - p) * 300 + glitch}px)`, opacity: p, fontFamily: "sans-serif", display: "flex", gap: 18, alignItems: "center" }}>
            <span style={{ width: 40, height: 40, borderRadius: 11, background: C.ink, border: `2px solid ${C.muted}`, display: "grid", placeItems: "center", color: C.muted, fontSize: 24 }}>✉</span>
            <div>
              <div style={{ color: C.muted, fontSize: 18 }}>{sender}</div>
              <div style={{ color: "#fff", fontSize: 25, fontWeight: 600 }}>Thank you for your application</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** On "Spitch": the name, huge. */
export const BigSpitch = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = f(at("l7b", 0));
  const p = spring({ frame: frame - s, fps, config: { damping: 12, stiffness: 160 } });
  const o = interpolate(frame, [s, s + 2, s + 20, s + 26], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: `rgba(14,15,18,${o})`, alignItems: "center", justifyContent: "center", opacity: o }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 400, color: "#fff", letterSpacing: 10, transform: `scale(${0.6 + p * 0.4})`, lineHeight: 1 }}>
        SPITCH<span style={{ color: C.accent }}>.</span>
      </div>
    </AbsoluteFill>
  );
};

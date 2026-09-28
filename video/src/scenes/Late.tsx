import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import site from "../site.json";
import { at, C, f, SERIF } from "../config";
import { Presenter } from "./Presenter";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.65, 0, 0.35, 1);

// Where the "See Spitch in one minute" video frame sits on the page, and the scroll that centres it.
const V = site.video;
const SCROLL0 = V.y + V.h / 2 - 540;
const K = 1920 / V.w; // zoom at which the video frame fills the screen
export const ZOOM = { start: at("l7b", 0) + 0.72, end: at("l7b", 0) + 1.45 };
export const SCROLL = { start: ZOOM.end + 1.0, end: at("l9", 0) - 0.15, to: site.examples.y - 40 };

/** The website: the presenter plays inside its launch-video frame, the camera pulls back, then it scrolls. */
export const Website = ({ dim = 0, fixedScroll }: { dim?: number; fixedScroll?: number }) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [f(ZOOM.start), f(ZOOM.end)], [K, 1], { ...clamp, easing: ease });
  const scroll = fixedScroll ?? interpolate(frame, [f(SCROLL.start), f(SCROLL.end)], [SCROLL0, SCROLL.to], { ...clamp, easing: ease });
  const showFrame = fixedScroll === undefined && frame < f(SCROLL.start) + 20;
  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "960px 540px" }}>
        <div style={{ position: "absolute", left: 0, top: -scroll, width: 1920, height: site.height }}>
          <Img src={staticFile("site-full.png")} style={{ width: 1920, height: site.height, display: "block" }} />
          {showFrame && (
            <div style={{ position: "absolute", left: V.x, top: V.y, width: V.w, height: V.h, borderRadius: 28 * (1 / z) + 0, overflow: "hidden" }}>
              <div style={{ width: 1920, height: 1080, transform: `scale(${V.w / 1920})`, transformOrigin: "0 0" }}>
                <Presenter />
              </div>
            </div>
          )}
        </div>
      </div>
      {dim > 0 && <AbsoluteFill style={{ background: `rgba(14,15,18,${dim})` }} />}
    </AbsoluteFill>
  );
};

/** "visibility, partnerships and collaborations" appear one by one as they are said. */
export const Benefits = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words: [string, number][] = [["visibility", at("l8", 8)], ["partnerships", at("l8", 9)], ["collaborations", at("l8", 11)]];
  const end = f(at("l9", 0)) - 4;
  const o = interpolate(frame, [end - 8, end], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 150, opacity: o }}>
      <div style={{ display: "flex", gap: 28 }}>
        {words.map(([w, t]) => {
          const p = spring({ frame: frame - f(t), fps, config: { damping: 14, stiffness: 180 } });
          return (
            <div key={w} style={{ opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 30}px) scale(${0.85 + p * 0.15})`, fontFamily: SERIF, fontWeight: 700, fontSize: 72, color: "#fff", background: C.ink, border: `3px solid ${C.accent}`, borderRadius: 999, padding: "10px 40px 16px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>{w}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const PITCHES = [
  { title: "Campus food rescue", summary: "Connects cafeterias' leftover food with students at closing time.", needs: ["Mobile developer", "UX designer"], score: 4 },
  { title: "Study room finder", summary: "Shows free study rooms on campus in real time.", needs: ["Backend developer", "Marketing"], score: 5 },
  { title: "Solar bike chargers", summary: "Solar charging stations for e-bikes around the city.", needs: ["Electrical engineer", "Funding"], score: 3 },
];

const Card = ({ p, label }: { p: (typeof PITCHES)[number]; label: number }) => (
  <div style={{ width: 520, borderRadius: 30, background: "#fff", padding: 22, boxShadow: "0 30px 70px rgba(0,0,0,0.45)", fontFamily: "sans-serif", color: C.ink }}>
    <div style={{ position: "relative", height: 290, borderRadius: 22, background: C.ink, overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -40, bottom: -70, width: 230, height: 230, borderRadius: "50%", background: C.accent }} />
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 84, height: 84, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", fontSize: 34 }}>▶</div>
      <div style={{ position: "absolute", left: 18, top: 16, background: "rgba(14,15,18,0.85)", color: "#fff", borderRadius: 999, padding: "6px 16px", fontSize: 22, fontWeight: 700, opacity: label, transform: `scale(${0.7 + label * 0.3})` }}>{"< 1 min"}</div>
    </div>
    <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 44, marginTop: 18 }}>{p.title}</div>
    <div style={{ fontSize: 24, color: "#44454b", marginTop: 6, lineHeight: 1.35 }}>{p.summary}</div>
    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>{p.needs.map((n) => <span key={n} style={{ background: C.paper, borderRadius: 999, padding: "8px 16px", fontSize: 21, fontWeight: 600 }}>{n}</span>)}</div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, borderTop: "1px solid #e4e1d9", paddingTop: 14, fontSize: 21, color: "#6b6b72" }}>
      Compatibility
      <span style={{ display: "flex", gap: 7, alignItems: "center" }}>{[0, 1, 2, 3, 4].map((i) => <span key={i} style={{ width: 16, height: 16, borderRadius: 8, background: i < p.score ? C.accent : "#e4e1d9" }} />)}<b style={{ color: C.ink, marginLeft: 6 }}>{p.score}/5</b></span>
    </div>
  </div>
);

/** "Pitch it in less than a minute, post it, and people swipe right or left ... to connect with you." */
export const SWIPES = { left: at("l9", 11), right: at("l9", 14) };
export const AppMockup = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = f(at("l9", 0)) - 4, end = f(at("l10a", 0));
  const zoom = interpolate(frame, [s, s + 24], [1.35, 1], { ...clamp, easing: ease });
  const o = interpolate(frame, [s, s + 6, end - 6, end], [0, 1, 1, 0], clamp);
  const label = spring({ frame: frame - f(at("l9", 3)), fps, config: { damping: 12 } });
  const posted = spring({ frame: frame - f(at("l9", 7)), fps, config: { damping: 16 } });
  const sw = (t: number) => interpolate(frame, [f(t), f(t) + 14], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const a = sw(SWIPES.left), b = sw(SWIPES.right);
  const link = spring({ frame: frame - f(at("l9", 21)), fps, config: { damping: 200 } });
  const stack = [
    { p: PITCHES[2], style: {} },
    { p: PITCHES[1], style: { transform: `translateX(${b * 1100}px) rotate(${b * 20}deg)` } },
    { p: PITCHES[0], style: { transform: `translateX(${-a * 1100}px) rotate(${-a * 20}deg) translateY(${Math.sin(Math.min(1, posted) * Math.PI) * -26}px)` } },
  ];
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #1b1c22 0%, ${C.ink} 65%)`, opacity: o, alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${zoom * 0.86})`, position: "relative", width: 600, height: 880, marginTop: -150 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 64, background: "#1c1d22", boxShadow: "inset 0 0 0 3px #2c2d33, 0 50px 100px rgba(0,0,0,0.6)" }} />
        <div style={{ position: "absolute", inset: 16, borderRadius: 50, background: C.paper, overflow: "hidden" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 40, padding: "30px 34px 0", color: C.ink }}>spitch<span style={{ color: C.accent }}>.</span></div>
          {stack.map(({ p, style }, i) => (
            <div key={p.title} style={{ position: "absolute", left: 24, top: 110 + (2 - i) * 10, ...style }}>
              <Card p={p} label={i === 2 ? label : 1} />
            </div>
          ))}
        </div>
      </div>
      {/* "connect": two people link up */}
      {[{ x: -560, t: "P" }, { x: 560, t: "B" }].map(({ x, t }) => (
        <div key={t} style={{ position: "absolute", left: 960 + x - 70 + (x < 0 ? -1 : 1) * (1 - link) * 200, top: 400, width: 140, height: 140, borderRadius: "50%", background: t === "P" ? C.accent : "#fff", color: C.ink, display: "grid", placeItems: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 70, opacity: link }}>{t}</div>
      ))}
      <div style={{ position: "absolute", left: 960 - 420, top: 468, width: 840 * link, height: 6, borderRadius: 3, background: C.accent, opacity: link * 0.9 }} />
    </AbsoluteFill>
  );
};

/** "Pitchers and builders ... for the price of a coffee." */
export const COFFEE = at("l10b", 6);
export const Split = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = f(at("l10a", 0)) - 3, end = f(at("l11", 0)) - 2;
  const o = interpolate(frame, [s, s + 6, end - 6, end], [0, 1, 1, 0], clamp);
  const merge = interpolate(frame, [f(at("l10b", 0)) - 6, f(at("l10b", 0)) + 14], [0, 1], { ...clamp, easing: ease });
  const cup = spring({ frame: frame - f(COFFEE), fps, config: { damping: 11, stiffness: 170 } });
  const half = (side: -1 | 1) => (
    <div style={{ position: "absolute", top: 0, bottom: 0, width: 960, left: side < 0 ? 0 : 960, background: side < 0 ? C.ink2 : C.accent, transform: `translateX(${-side * merge * 480}px)`, display: "grid", placeItems: "center", opacity: side < 0 ? 1 : 1 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 130, color: side < 0 ? "#fff" : C.ink, letterSpacing: 4, opacity: 1 - merge, marginBottom: 180 }}>{side < 0 ? "PITCHERS" : "BUILDERS"}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: C.ink, opacity: o, overflow: "hidden" }}>
      {half(-1)}{half(1)}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: merge }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 96, color: "#fff", marginBottom: 440, textShadow: "0 6px 30px rgba(0,0,0,0.5)" }}>PITCHERS <span style={{ color: C.ink }}>+</span> BUILDERS</div>
      </AbsoluteFill>
      {/* An illustrated coffee and a stylized $5, not a real bank note. */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 40 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 60, transform: `scale(${cup})`, opacity: Math.min(1, cup * 1.5) }}>
          <div style={{ position: "relative", width: 190, height: 200 }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 45 + i * 40, top: -70 - Math.sin(frame / 6 + i) * 8, width: 10, height: 50, borderRadius: 5, background: "rgba(255,255,255,0.6)" }} />)}
            <div style={{ position: "absolute", left: 0, bottom: 0, width: 160, height: 190, background: "#fff", borderRadius: "10px 10px 50px 50px" }} />
            <div style={{ position: "absolute", left: 0, bottom: 70, width: 160, height: 44, background: C.accent }} />
            <div style={{ position: "absolute", right: -4, bottom: 70, width: 60, height: 80, border: "14px solid #fff", borderRadius: "0 40px 40px 0", borderLeft: "none" }} />
          </div>
          <div style={{ width: 330, height: 170, borderRadius: 18, background: C.ink, border: `6px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", border: `4px dashed ${C.accent}` }} />
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 110, color: "#fff" }}>$5</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** "The market starts here, at uOttawa." The counter lands on 48,000 exactly on "here". */
export const COUNT = { start: at("l11", 0), stop: at("l11", 3) };
export const Market = () => {
  const frame = useCurrentFrame();
  const s = f(at("l11", 0)) - 4, end = f(at("l12", 0)) - 2;
  const o = interpolate(frame, [s, s + 6, end - 6, end], [0, 1, 1, 0], clamp);
  const n = Math.round(interpolate(frame, [f(COUNT.start), f(COUNT.stop)], [0, 48000], { ...clamp, easing: Easing.out(Easing.cubic) }));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Website dim={0.93} fixedScroll={0} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", marginTop: -120 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 250, color: "#fff", lineHeight: 1 }}>uOttawa</div>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 110, color: C.accent, marginTop: 20, fontVariantNumeric: "tabular-nums" }}>{n.toLocaleString("en-CA")} students</div>
        <div style={{ fontFamily: SERIF, fontSize: 30, color: C.muted, marginTop: 14 }}>uOttawa, 2023</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** "Or swipe right." A card flies across to the right; everything cuts on "right". */
export const SwipeRight = () => {
  const frame = useCurrentFrame();
  const s = f(at("l14", 1)), e = f(at("l14", 2)) + 10;
  const p = interpolate(frame, [s, e], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  if (frame < s || frame > e + 2) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `translateX(${-700 + p * 2000}px) rotate(${-4 + p * 22}deg)`, width: 420, height: 540, borderRadius: 34, background: "#fff", boxShadow: "0 40px 90px rgba(0,0,0,0.6)", display: "grid", placeItems: "center" }}>
        <div style={{ width: 170, height: 170, borderRadius: "50%", background: C.accent, display: "grid", placeItems: "center", fontSize: 90, color: C.ink }}>♥</div>
      </div>
    </AbsoluteFill>
  );
};

/** 0:57-1:00: the outro card. */
export const Outro = () => {
  const frame = useCurrentFrame();
  const s = f(at("l14", 2)) + 12;
  const o = interpolate(frame, [s, s + 8], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.ink, opacity: o, alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 80, color: "#fff", letterSpacing: 6 }}>SPITCH<span style={{ color: C.accent }}>.</span></div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 120, color: "#fff", marginTop: 26 }}>mberg133@uottawa.ca</div>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import envelope from "../envelope.json";
import { at, C, f, FPS } from "../config";

/**
 * An illustrated presenter, used when there is no face-cam: a 22-year-old engineering student in a
 * (stylized, busy) office. The mouth follows the voice, he blinks, and his face follows the script's arc.
 * Colours are here so they can be matched to the real person.
 */
export const LOOK = {
  skin: "#C68B63", skinShade: "#A8704E", hair: "#1B1414", beard: "rgba(27,20,20,0.55)",
  top: "#22252D", topShade: "#191B21", collar: "#F2EEE8", iris: "#3B2618", mouth: "#4A1D1D", teeth: "#F2EEE8",
};

type Face = { browL: number; browR: number; browTilt: number; smile: number; smirk: number; eyeOpen: number; lookX: number; lookY: number; tilt: number; nod: number };
const N: Face = { browL: 0, browR: 0, browTilt: 0, smile: 0.25, smirk: 0, eyeOpen: 1, lookX: 0, lookY: 0, tilt: 0, nod: 0 };

/** Expression keyframes (seconds), following the emotional arc of the script. */
function keys(): [number, Partial<Face>][] {
  return [
    [0, { smile: 0.35 }],
    [at("l1", 0), { browL: 12, browR: 12, smile: 0.3, tilt: 3 }],                 // curious
    [at("l1", 6), { browL: 20, browR: 20, smile: 0.35, tilt: 5 }],                // "idea?" rises
    [at("l2", 0), { browL: 8, browR: 8, smile: 0.55, lookX: 5, lookY: -7, tilt: -2 }], // dreamy
    [at("l3", 0) - 0.1, { browL: 4, browR: 4, browTilt: 0, smile: 0.1, lookY: 0, lookX: 0 }],
    [at("l3", 2), { browL: 6, browR: 6, browTilt: 9, smile: -0.7, nod: 10, tilt: 0, eyeOpen: 0.8 }], // "died": sad
    [at("l4", 0), { browL: -4, browR: -4, browTilt: 4, smile: -0.25, nod: 3, eyeOpen: 0.95 }],       // sincere, frustrated
    [at("l5a", 0), { browL: 2, browR: 10, browTilt: 0, smile: 0.35, smirk: 0.6, nod: 0 }],          // sarcastic
    [at("l5b", 0), { browL: -2, browR: 22, smile: 0.4, smirk: 0.9, tilt: -4 }],                    // "rough"
    [at("l6a", 0), { browL: 4, browR: 4, smile: 0.2, smirk: 0.2, tilt: 0 }],
    [at("l6b", 0), { browL: -2, browR: -2, smile: 0, smirk: 0, eyeOpen: 0.55, tilt: 0 }],           // robotic deadpan
    [at("l6c", 0), { browL: 6, browR: 6, smile: 0.2, eyeOpen: 1 }],
    [at("l7a", 0), { browL: 18, browR: 18, smile: 0.7, eyeOpen: 1.1, tilt: 0 }],                   // big energy
    [at("l7b", 0), { browL: 22, browR: 22, smile: 1, eyeOpen: 1.1 }],
    [at("l12", 0), { browL: 2, browR: 2, smile: 0.15, nod: 2 }],                                     // honest
    [at("l12", 6), { browL: 4, browR: 4, smile: 0.45, nod: 0 }],                                     // small self-aware smile
    [at("l13", 0), { browL: 8, browR: 8, smile: 0.75, tilt: 2 }],                                    // warm invitation
    [at("l14", 0), { browL: 12, browR: 16, smile: 0.95, smirk: 0.3, tilt: -3 }],                     // playful
  ];
}
const KEYS = keys();
function face(t: number): Face {
  const out = { ...N } as Face;
  (Object.keys(N) as (keyof Face)[]).forEach((k) => {
    const pts = KEYS.filter(([, v]) => v[k] !== undefined);
    if (!pts.length) return;
    const xs = pts.flatMap(([s], i) => (i === 0 ? [s] : [s - 0.001, s + 0.25]));
    const ys = pts.flatMap(([, v], i) => (i === 0 ? [v[k] as number] : [pts[i - 1][1][k] as number, v[k] as number]));
    out[k] = interpolate(t, xs, ys, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  });
  return out;
}

/** Blinks every few seconds, and a wink on "swipe right". */
function eyes(frame: number) {
  const t = frame / FPS;
  const blinkAt = [1.6, 4.9, 9.4, 13.0, 18.2, 22.8, 48.9, 53.4, 55.2];
  let open = 1;
  for (const b of blinkAt) { const d = Math.abs(t - b); if (d < 0.09) open = Math.min(open, d / 0.09); }
  const w0 = at("l14", 1), w1 = at("l14", 2) + 0.3;
  const wink = t > w0 && t < w1 ? Math.max(0.05, Math.abs(t - (w0 + w1) / 2) / ((w1 - w0) / 2)) ** 3 : 1;
  return { open, wink };
}

function mouthPath(cx: number, cy: number, w: number, o: number, smile: number, smirk: number) {
  const lx = cx - w / 2, rx = cx + w / 2;
  const ly = cy - smile * 12 - smirk * 8, ry = cy - smile * 12 + smirk * 8;
  const up = cy - 3 - o * 8 + smile * 3;
  const lo = cy + 4 + o * 46 + Math.max(0, smile) * 10;
  return `M ${lx} ${ly} Q ${cx} ${up} ${rx} ${ry} Q ${cx} ${lo} ${lx} ${ly} Z`;
}

export const Avatar = ({ aside = 0 }: { aside?: number }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const env = envelope as number[];
  const e = env[Math.min(frame, env.length - 1)] ?? 0;
  const eNext = env[Math.min(frame + 2, env.length - 1)] ?? 0;
  const o = Math.min(1, Math.pow(Math.max(0, (e * 0.6 + eNext * 0.4) - 0.04) * 1.9, 0.8)) * (0.85 + 0.15 * Math.sin(frame * 1.7));
  const F = face(t);
  const { open, wink } = eyes(frame);
  const breathe = Math.sin(t * 1.3) * 3;
  const talkBob = e * 6 * Math.sin(frame * 0.9);
  const headRot = F.tilt + Math.sin(t * 0.7) * 1.2 + talkBob * 0.25;
  const hx = 960, hy = 455 + F.nod + breathe * 0.5;
  const eyeY = hy - 18, eyeDX = 62;
  const eye = (side: -1 | 1, amount: number) => {
    const ry = 15 * Math.max(0.04, Math.min(1.15, F.eyeOpen * amount));
    const x = hx + side * eyeDX;
    return (
      <g key={side}>
        <ellipse cx={x} cy={eyeY} rx={24} ry={ry} fill="#fff" />
        <clipPath id={`eye${side}`}><ellipse cx={x} cy={eyeY} rx={24} ry={ry} /></clipPath>
        <g clipPath={`url(#eye${side})`}>
          <circle cx={x + F.lookX} cy={eyeY + F.lookY} r={12} fill={LOOK.iris} />
          <circle cx={x + F.lookX} cy={eyeY + F.lookY} r={6} fill="#0b0605" />
          <circle cx={x + F.lookX + 4} cy={eyeY + F.lookY - 4} r={3} fill="#fff" />
        </g>
        <path d={`M ${x - 27} ${eyeY - ry + 1} Q ${x} ${eyeY - ry - 7} ${x + 27} ${eyeY - ry + 1}`} stroke={LOOK.skinShade} strokeWidth={3} fill="none" opacity={0.7} />
      </g>
    );
  };
  const brow = (side: -1 | 1, raise: number) => {
    const x = hx + side * eyeDX, y = eyeY - 38 - raise;
    const inner = F.browTilt * 1.0; // positive: inner ends go up (sad)
    return <path key={`b${side}`} d={`M ${x - side * 32} ${y + 4} Q ${x} ${y - 8} ${x + side * 30} ${y + 6 - inner}`} stroke={LOOK.hair} strokeWidth={11} strokeLinecap="round" fill="none" />;
  };
  const talkingShape = mouthPath(hx, hy + 88, 88 + F.smile * 18, o, F.smile, F.smirk);

  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <Office t={t} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, transform: `translateX(${aside}px)` }}>
        <defs>
          <radialGradient id="rim" cx="50%" cy="40%" r="60%"><stop offset="60%" stopColor="rgba(255,90,31,0)" /><stop offset="100%" stopColor="rgba(255,90,31,0.22)" /></radialGradient>
        </defs>
        {/* torso */}
        <g transform={`translate(0 ${breathe})`}>
          <path d="M 560 1080 C 580 800 700 712 860 688 L 1060 688 C 1220 712 1340 800 1360 1080 Z" fill={LOOK.top} />
          <path d="M 860 688 L 960 772 L 1060 688 L 1030 678 L 960 732 L 890 678 Z" fill={LOOK.collar} />
          <path d="M 700 1080 C 705 930 720 860 760 820" stroke={LOOK.topShade} strokeWidth={10} fill="none" />
          <path d="M 1220 1080 C 1215 930 1200 860 1160 820" stroke={LOOK.topShade} strokeWidth={10} fill="none" />
          <rect x={925} y={615} width={70} height={90} rx={20} fill={LOOK.skinShade} />
        </g>
        {/* head */}
        <g transform={`rotate(${headRot} ${hx} ${hy + 120})`}>
          <ellipse cx={hx - 158} cy={hy + 5} rx={24} ry={38} fill={LOOK.skinShade} />
          <ellipse cx={hx + 158} cy={hy + 5} rx={24} ry={38} fill={LOOK.skinShade} />
          <path d={`M ${hx - 150} ${hy - 60} C ${hx - 155} ${hy + 110} ${hx - 90} ${hy + 175} ${hx} ${hy + 180} C ${hx + 90} ${hy + 175} ${hx + 155} ${hy + 110} ${hx + 150} ${hy - 60} C ${hx + 140} ${hy - 170} ${hx - 140} ${hy - 170} ${hx - 150} ${hy - 60} Z`} fill={LOOK.skin} />
          {/* short beard */}
          <path d={`M ${hx - 146} ${hy + 20} C ${hx - 140} ${hy + 130} ${hx - 80} ${hy + 182} ${hx} ${hy + 184} C ${hx + 80} ${hy + 182} ${hx + 140} ${hy + 130} ${hx + 146} ${hy + 20} C ${hx + 120} ${hy + 110} ${hx + 60} ${hy + 125} ${hx} ${hy + 125} C ${hx - 60} ${hy + 125} ${hx - 120} ${hy + 110} ${hx - 146} ${hy + 20} Z`} fill={LOOK.beard} />
          {/* hair */}
          <path d={`M ${hx - 158} ${hy - 30} C ${hx - 175} ${hy - 190} ${hx - 40} ${hy - 225} ${hx + 30} ${hy - 205} C ${hx + 120} ${hy - 215} ${hx + 185} ${hy - 150} ${hx + 158} ${hy - 30} C ${hx + 140} ${hy - 110} ${hx + 90} ${hy - 130} ${hx + 20} ${hy - 118} C ${hx - 60} ${hy - 105} ${hx - 120} ${hy - 110} ${hx - 158} ${hy - 30} Z`} fill={LOOK.hair} />
          {brow(-1, F.browL)}{brow(1, F.browR)}
          {eye(-1, open)}{eye(1, open * wink)}
          <path d={`M ${hx} ${hy + 5} Q ${hx - 16} ${hy + 50} ${hx - 6} ${hy + 56} Q ${hx + 4} ${hy + 60} ${hx + 16} ${hy + 54}`} stroke={LOOK.skinShade} strokeWidth={6} fill="none" strokeLinecap="round" />
          {/* mouth: follows the voice */}
          <path d={talkingShape} fill={LOOK.mouth} stroke="#3a1414" strokeWidth={3} />
          {o > 0.25 && <rect x={hx - 30} y={hy + 84 - F.smile * 8} width={60} height={9 * Math.min(1, o)} rx={4} fill={LOOK.teeth} opacity={0.9} />}
          <ellipse cx={hx} cy={hy} rx={170} ry={200} fill="url(#rim)" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** A stylized busy office at night, kept soft and out of focus behind him. */
const Office = ({ t }: { t: number }) => {
  const people = [
    { x0: -200, speed: 90, y: 560, s: 1, c: "#2c2f38", d: 0 },
    { x0: 2100, speed: -70, y: 600, s: 1.15, c: "#262930", d: 3 },
    { x0: 400, speed: 55, y: 540, s: 0.85, c: "#30343d", d: 8 },
  ];
  return (
    <AbsoluteFill style={{ filter: "blur(7px)", transform: "scale(1.04)" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#15171d 0%,#101116 60%,#0c0d10 100%)" }} />
      {/* window wall with city lights */}
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 40 + i * 212, top: 70, width: 196, height: 430, background: "linear-gradient(180deg,#1b2233,#141824)", borderRadius: 4 }}>
          {Array.from({ length: 14 }, (_, j) => <div key={j} style={{ position: "absolute", left: ((i * 37 + j * 53) % 170) + 8, top: ((i * 61 + j * 29) % 380) + 20, width: 6, height: 6, borderRadius: 3, background: j % 5 === 0 ? "#ffcf9e" : "#8fa6d6", opacity: 0.55 + 0.3 * Math.sin(t * 0.8 + i + j) }} />)}
        </div>
      ))}
      {/* pendant lights */}
      {[300, 960, 1620].map((x, i) => <div key={x} style={{ position: "absolute", left: x - 45, top: 40, width: 90, height: 34, borderRadius: "0 0 45px 45px", background: i === 1 ? C.accent : "#e9e2d2", boxShadow: `0 30px 90px 30px ${i === 1 ? "rgba(255,90,31,0.25)" : "rgba(255,236,200,0.18)"}` }} />)}
      {/* people walking past */}
      {people.map((p, i) => {
        const x = ((p.x0 + p.speed * (t + p.d)) % 2400 + 2400) % 2400 - 240;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: p.y, transform: `scale(${p.s})` }}>
            <div style={{ width: 70, height: 70, borderRadius: "50%", background: p.c, margin: "0 auto" }} />
            <div style={{ width: 150, height: 260, borderRadius: "60px 60px 10px 10px", background: p.c, marginTop: 8 }} />
          </div>
        );
      })}
      {/* desks and glowing monitors */}
      {[120, 520, 1300, 1700].map((x, i) => (
        <div key={x}>
          <div style={{ position: "absolute", left: x, top: 640 + (i % 2) * 20, width: 150, height: 92, borderRadius: 8, background: "#9fc3ff", opacity: 0.35, boxShadow: "0 0 60px rgba(159,195,255,0.35)" }} />
          <div style={{ position: "absolute", left: x - 70, top: 745 + (i % 2) * 20, width: 300, height: 26, borderRadius: 6, background: "#2a2d35" }} />
        </div>
      ))}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(14,15,18,0) 0%, rgba(14,15,18,0.55) 75%)" }} />
    </AbsoluteFill>
  );
};

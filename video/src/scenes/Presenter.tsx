import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { at, C, f, HAS_FACECAM } from "../config";
import { Avatar } from "./Avatar";

/**
 * The presenter. With your face-cam (public/facecam.mp4) it plays full frame.
 * Without it, a stand-in: a speaker ring that breathes with the voice, so the video still reads.
 */
export const Presenter = ({ dim = 0 }: { dim?: number }) => {
  const frame = useCurrentFrame();
  if (HAS_FACECAM) {
    return (
      <AbsoluteFill style={{ background: C.ink }}>
        <OffthreadVideo src={staticFile("facecam.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <AbsoluteFill style={{ background: `rgba(14,15,18,${dim})` }} />
      </AbsoluteFill>
    );
  }
  const aside = interpolate(frame, [f(at("l2", 0)) - 8, f(at("l2", 0)) + 4, f(at("l7a", 0)) - 10, f(at("l7a", 0)) + 4], [0, -440, -440, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Avatar aside={aside} />
      <AbsoluteFill style={{ background: `rgba(14,15,18,${dim})` }} />
    </AbsoluteFill>
  );
};

import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { at, C, f } from "./config";
import { Captions } from "./scenes/Captions";
import { BigSpitch, ChatBox, Graph, Inbox, IntroCard, Resume } from "./scenes/Early";
import { AppMockup, Benefits, Market, Outro, Split, SwipeRight, Website, ZOOM } from "./scenes/Late";
import { Presenter } from "./scenes/Presenter";

/** The 60-second pitch. Every cue is tied to the word timings in timeline.json. */
export const Pitch = () => {
  const frame = useCurrentFrame();
  const inRange = (a: number, b: number) => frame >= a && frame < b;
  const zoomStart = f(ZOOM.start);
  const appStart = f(at("l9", 0)) - 4;
  const splitStart = f(at("l10a", 0)) - 3;
  const marketStart = f(at("l11", 0)) - 4;
  const backToCam = f(at("l12", 0)) - 2;
  const outro = f(at("l14", 2)) + 12;

  return (
    <AbsoluteFill style={{ background: C.ink }}>
      {inRange(0, zoomStart) && <Presenter />}
      {inRange(0, f(1.4)) && <IntroCard />}
      {inRange(f(at("l2", 0)), f(at("l3", 0)) + 6) && <Graph />}
      {inRange(f(at("l3", 0)) - 4, f(at("l4", 0))) && <ChatBox />}
      {inRange(f(at("l5a", 0)), f(at("l6a", 0))) && <Resume />}
      {inRange(f(at("l6a", 0)), f(at("l7a", 0))) && <Inbox />}
      {inRange(zoomStart, appStart + 8) && <Website />}
      {inRange(f(at("l8", 0)), appStart + 4) && <Benefits />}
      {inRange(f(at("l7b", 0)), f(at("l7b", 0)) + 28) && <BigSpitch />}
      {inRange(appStart, splitStart + 8) && <AppMockup />}
      {inRange(splitStart, marketStart + 8) && <Split />}
      {inRange(marketStart, backToCam + 8) && <Market />}
      {inRange(backToCam, outro + 8) && <Presenter />}
      <SwipeRight />
      {frame < outro && frame >= f(1.0) - 2 && <Captions />}
      {frame >= outro && <Outro />}
      <Audio src={staticFile("mix.wav")} />
    </AbsoluteFill>
  );
};

import { Composition } from "remotion";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./config";
import { Pitch } from "./Pitch";

export const Root = () => (
  <Composition id="Pitch" component={Pitch} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
);

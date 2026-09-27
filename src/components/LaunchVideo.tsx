import { PlayIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { content } from "@/content";
import { parseVideo } from "@/lib/video";
import { Section } from "./Section";

export function LaunchVideo() {
  const video = parseVideo(content.placeholders.videoUrl);
  const [playing, setPlaying] = useState(false);

  return (
    <Section id="video" tone="light" labelledBy="video-title">
      <h2 id="video-title" data-reveal className="max-w-[16ch] text-[clamp(2.25rem,6vw,4rem)] font-bold">
        {content.video.title}
      </h2>
      <div data-reveal style={{ ["--i" as string]: 1 }} className="relative mt-10 aspect-video w-full overflow-hidden rounded-[28px] bg-ink text-white">
        {video && playing ? (
          video.kind === "youtube" ? (
            <iframe
              className="absolute inset-0 size-full"
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
              title={content.a11y.videoTitle}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <video className="absolute inset-0 size-full bg-ink object-contain" src={video.src} controls autoPlay playsInline preload="none" title={content.a11y.videoTitle} />
          )
        ) : (
          <Poster ready={!!video} onPlay={() => setPlaying(true)} />
        )}
      </div>
    </Section>
  );
}

/** The styled poster: a play button when a video is set, "coming soon" when it is not. Nothing loads until play. */
function Poster({ ready, onPlay }: { ready: boolean; onPlay: () => void }) {
  return (
    <div className="absolute inset-0">
      <span aria-hidden="true" className="absolute -top-[42%] -right-[9%] aspect-square w-[38%] rounded-full bg-brand" />
      <span aria-hidden="true" className="absolute bottom-[12%] left-[7%] aspect-square w-[11%] rounded-full border-2 border-white/15" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
        {ready ? (
          <button type="button" onClick={onPlay} className="grid size-20 place-items-center rounded-full bg-white text-ink transition-transform duration-150 hover:scale-105 active:scale-95 md:size-24" aria-label={content.a11y.playVideo}>
            <PlayIcon size={34} weight="fill" aria-hidden="true" />
          </button>
        ) : (
          <>
            <span aria-hidden="true" className="grid size-16 place-items-center rounded-full border-2 border-white/25 text-white/80 md:size-20">
              <PlayIcon size={28} weight="fill" />
            </span>
            <p className="font-display text-xl font-semibold tracking-tight md:text-3xl">{content.video.comingSoon}</p>
          </>
        )}
      </div>
    </div>
  );
}

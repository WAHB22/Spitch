import { MapPinIcon } from "@phosphor-icons/react";
import { content } from "@/content";
import { PitchCard } from "./PitchCard";
import { Wordmark } from "./Wordmark";

const [front, back] = content.examples.pitches;

/** The app on a phone, built in code: the top pitch card, with the next one waiting behind it. */
export function PhoneMockup() {
  return (
    <div className="phone-in relative mx-auto w-[min(100%,300px)] sm:w-[320px]" role="img" aria-label={content.a11y.phoneMockup(front)}>
      <div aria-hidden="true" className="rounded-[46px] bg-[#1c1d22] p-2.5 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8),inset_0_0_0_1.5px_rgb(255_255_255/0.08)]">
        <div className="relative overflow-hidden rounded-[38px] bg-paper px-3 pt-3 pb-4">
          <div className="mx-auto mb-3 h-6 w-24 rounded-full bg-[#1c1d22]" />
          <div className="mb-3 flex items-center justify-between px-1">
            <Wordmark className="text-xl text-ink" />
            <span className="tag min-h-6 gap-1 bg-card px-2.5 text-[11px] text-ink">
              <MapPinIcon size={12} weight="fill" className="text-brand" />
              {content.region}
            </span>
          </div>
          <div className="relative">
            {/* The next pitch, waiting in the stack. */}
            <div className="absolute inset-x-1 top-3 bottom-3 translate-x-4 rotate-[5deg] opacity-80">
              <PitchCard pitch={back} compact actions={false} className="h-full" />
            </div>
            <div className="swipe-hint relative">
              <PitchCard pitch={front} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

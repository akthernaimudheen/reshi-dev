import { VideoCore } from '@/components/shared/video-core';
import { Reveal } from '@/components/shared/reveal';
import { Eyebrow } from '@/components/ui/eyebrow';

/**
 * A full-bleed cinematic band: the neuron-core video as a brand statement.
 *
 * Sits on a near-black ground with the black-background clip screen-blended
 * over it, so the glowing brain composites as pure light. This is the emotive
 * beat of the page — the vision the studio is building toward — placed after
 * the proof and before the call to action.
 *
 * Legibility over spectacle: the video is pushed to the right and dimmed by a
 * left-to-right scrim, so the headline on the left never fights it. A vignette
 * darkens the edges, which also hides the small generator watermark that sits
 * in the clip's bottom-right corner.
 */
export function CoreShowcase() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950">
      <VideoCore
        src="/videos/neural-core.mp4"
        poster="/videos/neural-core-poster.jpg"
        blend
        // Offset right and slightly oversized on large screens, so the bright
        // core sits beside the copy rather than under it.
        className="lg:left-[28%]"
      />

      {/* Left-weighted scrim for headline contrast. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/80 to-transparent"
      />
      {/* Edge vignette — depth, and it masks the clip's corner watermark. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 shadow-[inset_0_0_120px_60px_var(--color-navy-950)]"
      />

      <div className="relative container-content flex min-h-[75vh] items-center py-24 lg:min-h-[85vh]">
        <div className="flex max-w-xl flex-col gap-6">
          <Reveal y={12} blur={false}>
            <Eyebrow tone="dark">The vision</Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="text-h1 text-ink-inverse">
              A system that never stops{' '}
              <span className="text-gradient">learning your business</span>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="max-w-md text-lead text-ink-inverse-muted">
              Every site, automation and assistant we ship feeds one core that gets
              sharper the longer it runs. Today it powers the work below. Tomorrow it runs
              more of your business than you would have trusted to software.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

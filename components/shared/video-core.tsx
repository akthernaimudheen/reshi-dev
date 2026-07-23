'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useMotionCapability } from '@/hooks/use-device-tier';
import { cn } from '@/lib/utils';

type VideoCoreProps = {
  /** Path under /public, e.g. "/videos/neural-core.mp4". */
  src: string;
  /** Still shown before the video loads and as the reduced-motion fallback. */
  poster: string;
  className?: string;
  /**
   * `screen` blend drops the video's pure-black background out, so a glowing
   * subject composites as light over whatever sits behind it — the reason this
   * clip has to be black-on-black. Only correct over a DARK ground; on a light
   * ground screen washes to white.
   */
  blend?: boolean;
};

/**
 * A hero-grade background video, held to the same performance discipline as
 * the canvas cores.
 *
 * WHY IT IS NOT AUTOPLAY-ON-MOUNT. A 2.7MB video that begins downloading and
 * decoding the instant the page loads would compete with the LCP text for
 * bandwidth and main-thread time. Instead:
 *   - `preload="none"` — the browser fetches nothing until we ask.
 *   - An IntersectionObserver starts the download and playback only as the
 *     section approaches the viewport, and pauses it when it leaves. A video
 *     playing behind three screens of scrolled-past content is pure waste.
 *   - The poster paints instantly, so the section is never empty.
 *   - Under prefers-reduced-motion, or on the `static` tier, the video is
 *     never loaded at all — the poster is the whole experience.
 *
 * Muted + playsInline + loop are mandatory for mobile autoplay; without muted,
 * iOS and Android refuse to start an inline video without a user gesture.
 */
export function VideoCore({ src, poster, className, blend = true }: VideoCoreProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reducedMotion = usePrefersReducedMotion();
  const { allowsMotion } = useMotionCapability();
  const staticOnly = reducedMotion || !allowsMotion;

  // Gates the <video> into the tree only once it is worth loading, so the
  // poster is all that ships for users who never reach or never animate it.
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (staticOnly) return;
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (entry?.isIntersecting) {
          setActivated(true);
          // play() may reject if the tab is backgrounded — harmless.
          video?.play().catch(() => {});
        } else {
          video?.pause();
        }
      },
      // Begin loading a little before it scrolls in, so it is running by the
      // time it is on screen rather than starting from black.
      { rootMargin: '200px 0px' },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [staticOnly]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={cn('absolute inset-0 overflow-hidden', className)}
    >
      {/* Poster layer — always present, so there is never a blank frame and it
          is the entire visual under reduced motion. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        className={cn(
          'absolute inset-0 h-full w-full object-cover',
          blend && 'mix-blend-screen',
        )}
      />

      {!staticOnly && activated ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            blend && 'mix-blend-screen',
          )}
        />
      ) : null}
    </div>
  );
}

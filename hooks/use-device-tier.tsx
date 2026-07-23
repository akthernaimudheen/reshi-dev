'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Adaptive motion tiering.
 *
 * `full`    — every signature moment runs.
 * `reduced` — entrances and transitions only; heavy continuous work is cut.
 * `static`  — no motion beyond instant state changes.
 *
 * Two-stage detection, because neither stage is trustworthy alone:
 *
 *   1. Static signals (memory, cores, save-data, reduced-motion) give an
 *      instant guess. They are crude — `deviceMemory` is bucketed and absent
 *      on Safari, and a phone can report eight cores while thermally throttled
 *      to a crawl.
 *   2. A runtime frame probe measures what the device is ACTUALLY doing and
 *      downgrades if the first second of animation is janky. This is the part
 *      that protects mid-tier Android, and it is the only signal that reflects
 *      real conditions — battery saver, a hot chassis, twelve other tabs.
 *
 * The probe runs ONCE for the whole page and is shared through context.
 * Running it per component would mean several simultaneous measurement loops
 * all competing for the frames they are trying to measure.
 */

export type DeviceTier = 'full' | 'reduced' | 'static';

const DeviceTierContext = createContext<DeviceTier>('full');

/**
 * Frame budget above which we consider the device to be struggling.
 *
 * 32ms is ~31fps. Deliberately well below 60: a 60Hz display idles at 16.7ms,
 * and a threshold near that fires on any momentary hiccup and permanently
 * strips the motion from a healthy machine. Only a device whose MEDIAN idle
 * frame is this slow is genuinely unable to keep up.
 */
const SLOW_FRAME_MS = 32;
const PROBE_FRAMES = 60;

/**
 * When the probe starts, in ms after mount. It must begin AFTER the boot
 * sequence (1600ms) and initial hydration have finished — measuring across
 * that one-off startup work made the probe see a busy load tail and downgrade
 * a fast 12-core machine to the reduced tier, freezing the hero core.
 */
const PROBE_START_DELAY = 2200;

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

function staticGuess(): DeviceTier {
  if (typeof window === 'undefined') return 'full';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'static';
  }

  const nav = navigator as NavigatorWithHints;

  // An explicit user request to save data. Honour it as strictly as
  // reduced-motion — it usually means a metered or expensive connection.
  if (nav.connection?.saveData) return 'static';

  const effectiveType = nav.connection?.effectiveType;
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'static';
  if (effectiveType === '3g') return 'reduced';

  /**
   * These thresholds are deliberately extreme, and an earlier version got it
   * badly wrong by using `<= 4` for both.
   *
   * `navigator.deviceMemory` is capped at 8 and rounded DOWN to a power of
   * two, so a 6GB machine reports 4 and plenty of 8GB machines report 4 as
   * well. Downgrading on `<= 4` froze the core on a 12-core desktop. Only
   * 2GB-or-less is unambiguously low-end.
   *
   * Core count is similarly weak evidence — a modern efficiency-core laptop
   * can report 4 and still composite this effortlessly.
   *
   * The static hints exist only to catch the obviously incapable. The frame
   * probe below is the signal that actually decides, because it measures the
   * device instead of guessing about it.
   */
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) return 'reduced';
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) return 'reduced';

  return 'full';
}

function downgrade(tier: DeviceTier): DeviceTier {
  return tier === 'full' ? 'reduced' : 'static';
}

export function DeviceTierProvider({ children }: { children: React.ReactNode }) {
  // Start optimistic and step down. Starting pessimistic would mean capable
  // devices see a plain page for the first second and then a burst of motion,
  // which is far more jarring than a single quiet downgrade.
  const [tier, setTier] = useState<DeviceTier>('full');

  useEffect(() => {
    const initial = staticGuess();
    setTier(initial);

    if (initial === 'static') return;

    // Declared out here so cleanup can actually reach it. Returning a cleanup
    // from inside the setTimeout callback would be discarded, and the probe
    // would keep running after unmount.
    let raf = 0;

    // Wait out the boot sequence and hydration before measuring — see
    // PROBE_START_DELAY.
    const startDelay = setTimeout(() => {
      const frames: number[] = [];
      let last = performance.now();

      const tick = (now: number) => {
        frames.push(now - last);
        last = now;

        if (frames.length < PROBE_FRAMES) {
          raf = requestAnimationFrame(tick);
          return;
        }

        // A hidden or backgrounded tab throttles rAF to ~1fps, which would
        // make every device look broken. Never downgrade on that evidence.
        if (document.visibilityState !== 'visible') return;

        // Median, not mean: a couple of GC pauses should not condemn a device
        // that is otherwise running perfectly.
        const sorted = [...frames].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)] ?? 16;

        if (median > SLOW_FRAME_MS) {
          setTier((current) => downgrade(current));
        }
      };

      raf = requestAnimationFrame(tick);
    }, PROBE_START_DELAY);

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreferenceChange = () => setTier(media.matches ? 'static' : staticGuess());
    media.addEventListener('change', onPreferenceChange);

    return () => {
      clearTimeout(startDelay);
      cancelAnimationFrame(raf);
      media.removeEventListener('change', onPreferenceChange);
    };
  }, []);

  return <DeviceTierContext.Provider value={tier}>{children}</DeviceTierContext.Provider>;
}

export function useDeviceTier() {
  return useContext(DeviceTierContext);
}

/** Convenience flags, so components read intent rather than compare strings. */
export function useMotionCapability() {
  const tier = useDeviceTier();
  return useMemo(
    () => ({
      tier,
      /** Continuous animation loops (the core, ambient drift). */
      allowsContinuous: tier === 'full',
      /** Scroll-linked transforms and entrances. */
      allowsScrollMotion: tier !== 'static',
      /** Any motion at all. */
      allowsMotion: tier !== 'static',
    }),
    [tier],
  );
}

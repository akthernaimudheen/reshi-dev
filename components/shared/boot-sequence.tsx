'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMotionCapability } from '@/hooks/use-device-tier';

/**
 * First-visit boot sequence — the site coming online rather than loading.
 *
 * CRITICAL CONSTRAINT: this must never gate content. A classic preloader that
 * hides the page until it finishes is the single most reliable way to wreck
 * LCP, because the largest element is invisible for the whole animation. This
 * overlay sits ON TOP of a fully painted, fully interactive page and fades
 * out. If the JavaScript never runs, the visitor simply sees the site.
 *
 * It also runs once per session, not once per navigation. A boot animation on
 * every page view stops reading as a system starting up and starts reading as
 * an obstacle.
 */

const SESSION_KEY = 'reshi-booted';
const DURATION_MS = 1600;

export function BootSequence() {
  const { allowsMotion } = useMotionCapability();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!allowsMotion) return;

    // sessionStorage throws in some privacy modes; a boot animation is not
    // worth an exception that breaks hydration.
    let alreadyBooted = false;
    try {
      alreadyBooted = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      alreadyBooted = false;
    }

    if (alreadyBooted) return;

    setVisible(true);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Non-fatal — worst case it plays again next navigation.
    }

    const timer = setTimeout(() => setVisible(false), DURATION_MS);
    return () => clearTimeout(timer);
  }, [allowsMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          // Decorative and transient. Announcing it would interrupt a screen
          // reader that is already reading the real page underneath.
          aria-hidden="true"
          // `pointer-events-none` from the very first frame: the page beneath
          // is interactive, and the overlay must never swallow a click on the
          // hero CTA.
          className="pointer-events-none fixed inset-0 z-200"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Ground: opaque at first so the assembly reads, then clears. */}
          <motion.div
            className="absolute inset-0 bg-navy-950"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Grid ignition — the surface powering up. */}
          <motion.div
            className="absolute inset-0 bg-grid-dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0.25, 0] }}
            transition={{ duration: 1.3, times: [0, 0.25, 0.6, 1], ease: 'linear' }}
          />

          {/* Horizontal scan line sweeping the frame once. */}
          <motion.div
            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            initial={{ top: '0%', opacity: 0 }}
            animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 0.9,
              times: [0, 0.1, 0.85, 1],
              ease: [0.83, 0, 0.17, 1],
            }}
          />

          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-5">
              {/* The mark draws itself: stroke dash offset animating to zero. */}
              <svg viewBox="0 0 32 32" className="size-14">
                <motion.rect
                  x="0.75"
                  y="0.75"
                  width="30.5"
                  height="30.5"
                  rx="9"
                  fill="none"
                  stroke="#12C7C7"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.path
                  d="M11 23V9.6c0-.33.27-.6.6-.6h5.02a4.3 4.3 0 0 1 .93 8.5L21.6 23"
                  fill="none"
                  stroke="#36D8FF"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>

              <motion.p
                className="font-mono text-[0.625rem] tracking-[0.32em] text-cyan-300/80 uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.2, times: [0, 0.3, 0.75, 1] }}
              >
                Core online
              </motion.p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

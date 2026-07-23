'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useMotionCapability } from '@/hooks/use-device-tier';
import { cn } from '@/lib/utils';

type ScanRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Light on dark sections, dark on light ones. */
  tone?: 'light' | 'dark';
};

/**
 * A single beam sweeps the band as it enters, like a scanner reading the page.
 *
 * Deliberately restrained: one pass, no repeat, no residue. The effect works
 * because it is brief and slightly unexpected — repeating it or slowing it
 * turns a moment of craft into a distraction sitting between the reader and
 * the content.
 *
 * The beam is a sibling overlay rather than a mask on the content, so text
 * remains selectable and searchable throughout, and nothing about the reveal
 * can leave content invisible if the animation fails to run.
 */
export function ScanReveal({ children, className, tone = 'light' }: ScanRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotionPreference = usePrefersReducedMotion();
  const { allowsScrollMotion } = useMotionCapability();

  // `once` — a beam that re-fires every time a section scrolls back into view
  // rapidly becomes irritating.
  const inView = useInView(ref, { once: true, margin: '-18% 0px -18% 0px' });

  const still = reducedMotionPreference || !allowsScrollMotion;

  return (
    <div ref={ref} className={cn('relative', className)}>
      {children}

      {!still && inView ? (
        <motion.span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-0 z-10 h-40',
            tone === 'light'
              ? 'bg-gradient-to-b from-transparent via-cyan-400/12 to-transparent'
              : 'bg-gradient-to-b from-transparent via-cyan-300/18 to-transparent',
          )}
          initial={{ top: '-10%', opacity: 0 }}
          animate={{ top: ['-10%', '105%'], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 1.1,
            times: [0, 0.15, 0.8, 1],
            ease: [0.83, 0, 0.17, 1],
          }}
        />
      ) : null}
    </div>
  );
}

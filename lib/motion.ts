import type { Transition, Variants } from 'framer-motion';

/**
 * The four durations the design spec allows, in seconds. Importing from here
 * rather than typing numbers inline is what keeps the whole site feeling like
 * one object rather than a pile of components.
 */
export const duration = {
  fast: 0.2,
  base: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const;

export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.83, 0, 0.17, 1],
} as const satisfies Record<string, [number, number, number, number]>;

export const spring = {
  soft: { type: 'spring', stiffness: 120, damping: 20, mass: 0.6 },
  snappy: { type: 'spring', stiffness: 400, damping: 30, mass: 0.8 },
  gentle: { type: 'spring', stiffness: 60, damping: 18, mass: 1 },
} as const satisfies Record<string, Transition>;

/**
 * Standard scroll-reveal: a short rise with a blur burn-off. The blur is what
 * separates this from the default "fade up" everyone ships — it reads as
 * focus pulling in rather than opacity ramping.
 */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: duration.slower, ease: ease.out },
  },
};

export const revealScale: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.slow, ease: ease.out },
  },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.slow, ease: ease.out } },
};

/** Parent for staggered lists. Children should use `revealUp`. */
export function stagger(staggerChildren = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  };
}

/**
 * Shared viewport config. `once` prevents re-animation on scroll-back, which
 * is both distracting and a needless recompute; the negative bottom margin
 * delays the trigger until the element is meaningfully on screen.
 */
export const viewportOnce = { once: true, margin: '-12% 0px -12% 0px' } as const;

/** Applied to every variant when the user asks for reduced motion. */
export const staticVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Reading-progress rail. Uses `scaleX` on a fixed element so it never triggers
 * layout, and springs the value so fast wheel scrolls do not look jittery.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-100 h-0.5 origin-left bg-gradient-to-r from-cyan-500 via-accent to-cyan-300"
    />
  );
}

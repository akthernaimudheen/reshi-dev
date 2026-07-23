'use client';

import { useRef } from 'react';
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion';
import { usePrefersReducedMotion } from './use-prefers-reduced-motion';

type MagneticResult = {
  ref: React.RefObject<HTMLElement | null>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  onPointerMove: (event: React.PointerEvent) => void;
  onPointerLeave: () => void;
};

/**
 * Pulls an element toward the cursor within its own bounds.
 *
 * Only the transform is animated, and it runs on a spring rather than a
 * transition so quick direction changes stay continuous. Pointer-type is
 * checked because a magnetic effect on touch just delays the tap.
 */
export function useMagnetic(strength = 0.35): MagneticResult {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 260, damping: 22, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 260, damping: 22, mass: 0.5 });

  const onPointerMove = (event: React.PointerEvent) => {
    if (prefersReducedMotion || event.pointerType !== 'mouse' || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);

    rawX.set(offsetX * strength);
    rawY.set(offsetY * strength);
  };

  const onPointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { ref, x, y, onPointerMove, onPointerLeave };
}

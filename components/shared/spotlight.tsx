'use client';

import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

type SpotlightProps = {
  children: React.ReactNode;
  className?: string;
  size?: number;
  /** Any valid CSS colour, including the `rgb(... / alpha)` form. */
  color?: string;
};

/**
 * Wraps a section in a soft light that tracks the cursor.
 *
 * The gradient position is driven by motion values composed into a CSS
 * template, so pointer movement never re-renders React — it writes straight to
 * the style attribute. The listener lives on this wrapper rather than the
 * window, so movement elsewhere on the page costs nothing.
 */
export function Spotlight({
  children,
  className,
  size = 520,
  color = 'rgb(18 199 199 / 0.16)',
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const rawX = useMotionValue(-9999);
  const rawY = useMotionValue(-9999);
  const x = useSpring(rawX, { stiffness: 120, damping: 24, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 120, damping: 24, mass: 0.5 });

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 72%)`;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set(event.clientX - rect.left);
    rawY.set(event.clientY - rect.top);
  };

  const handlePointerLeave = () => {
    // Park the light far outside the box rather than fading it, so re-entry
    // from any edge animates in from the correct direction.
    rawX.set(-9999);
    rawY.set(-9999);
  };

  if (prefersReducedMotion) {
    return <div className={cn('relative', className)}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn('relative', className)}
    >
      <motion.div
        aria-hidden="true"
        style={{ background }}
        className="pointer-events-none absolute inset-0 z-0"
      />
      {children}
    </div>
  );
}

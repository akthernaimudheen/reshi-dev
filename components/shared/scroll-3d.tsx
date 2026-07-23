'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useMotionCapability } from '@/hooks/use-device-tier';
import { cn } from '@/lib/utils';

type Variant = 'lift' | 'swivel' | 'recede';

type Scroll3DProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * `lift`   — tilts up from below, as though laid flat and raised into view.
   * `swivel` — rotates in from the side around the Y axis.
   * `recede` — sits back in Z and comes forward.
   */
  variant?: Variant;
  /** Degrees of rotation at the start of the range. */
  intensity?: number;
  as?: 'div' | 'li';
};

/**
 * Scroll-linked 3D entrance.
 *
 * Different from `Reveal`, and they should not be combined on one element:
 * `Reveal` fires once when an element crosses into view, while this stays
 * bound to scroll position for the whole approach, so the element keeps
 * turning as the reader moves. Use `Reveal` for text and this for cards and
 * panels where the extra depth reads as craft rather than noise.
 *
 * COST. Transforms are driven by motion values derived from `scrollYProgress`,
 * which write straight to the style attribute — no React render per frame.
 * There is deliberately no spring: a spring per card would mean an
 * independent animation loop each, and the difference is imperceptible on an
 * entrance this short.
 */
export function Scroll3D({
  children,
  className,
  variant = 'lift',
  intensity = 10,
  as = 'div',
}: Scroll3DProps) {
  // Typed as HTMLElement because the outer tag may be a div or an li.
  const ref = useRef<HTMLElement>(null);
  const reducedMotionPreference = usePrefersReducedMotion();
  const { allowsScrollMotion } = useMotionCapability();

  // Scroll-linked transforms survive into the `reduced` tier — they are cheap
  // and they carry the design. Only `static` drops them.
  const prefersReducedMotion = reducedMotionPreference || !allowsScrollMotion;

  /**
   * Completes once the element's centre reaches 65% down the viewport — well
   * before it is centred, so it is settled by the time anyone reads it.
   *
   * Deliberately NOT `['start end', 'center center']`. That only reaches
   * progress 1 when the element sits dead centre, which an element near the
   * bottom of the document can never do — there is no scroll left beneath it.
   * Such a card would stay permanently tilted and semi-transparent.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center 65%'],
  });

  const rotateX = useTransform(
    scrollYProgress,
    [0, 1],
    [variant === 'lift' ? intensity : 0, 0],
  );
  const rotateY = useTransform(
    scrollYProgress,
    [0, 1],
    [variant === 'swivel' ? -intensity : 0, 0],
  );
  const z = useTransform(scrollYProgress, [0, 1], [variant === 'recede' ? -160 : 0, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [36, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.45], [0, 1]);

  const Tag = as;

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    // The OUTER element carries the caller's tag, so `as="li"` still produces
    // a real <li> child of the <ul> — wrapping it in a div would be invalid
    // list markup and would break the list semantics for screen readers.
    //
    // Perspective sits here too, giving each card its own vanishing point. A
    // single shared perspective across a grid shears the outer cards badly.
    <Tag
      ref={ref as React.RefObject<HTMLDivElement & HTMLLIElement>}
      className={cn('[perspective:1400px]', className)}
    >
      <motion.div
        style={{ rotateX, rotateY, z, y, opacity, transformStyle: 'preserve-3d' }}
        className="h-full"
      >
        {children}
      </motion.div>
    </Tag>
  );
}

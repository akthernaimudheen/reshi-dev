'use client';

import { motion, type Variants } from 'framer-motion';
import { duration, ease, viewportOnce } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

type RevealProps = {
  children: React.ReactNode;
  /** Seconds. Use small offsets to cascade adjacent elements. */
  delay?: number;
  /** Distance travelled, in px. `0` gives a pure fade. */
  y?: number;
  blur?: boolean;
  className?: string;
  as?: 'div' | 'li' | 'span' | 'section';
};

/**
 * The site's one scroll-reveal primitive.
 *
 * Everything animates once, on entry, and never again — re-triggering on
 * scroll-back is the single fastest way to make a site feel cheap. When the
 * user prefers reduced motion the element renders immediately with no
 * transform, rather than animating faster.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  blur = true,
  className,
  as = 'div',
}: RevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const MotionTag = motion[as];

  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const variants: Variants = {
    hidden: { opacity: 0, y, ...(blur ? { filter: 'blur(6px)' } : {}) },
    visible: {
      opacity: 1,
      y: 0,
      ...(blur ? { filter: 'blur(0px)' } : {}),
      transition: { duration: duration.slower, ease: ease.out, delay },
    },
  };

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants}
      className={cn('gpu', className)}
    >
      {children}
    </MotionTag>
  );
}

'use client';

import { motion } from 'framer-motion';
import { duration, ease } from '@/lib/motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  /** Per-word stagger, in seconds. */
  stagger?: number;
  as?: 'h1' | 'h2' | 'p' | 'span';
};

/**
 * Word-by-word entrance for headline text.
 *
 * Split on words rather than characters: character splits look impressive in
 * a demo and shred readability at real headline sizes, and they multiply DOM
 * nodes by ~6×.
 *
 * The full string stays available to assistive technology via `aria-label`,
 * with the animated spans hidden — otherwise a screen reader announces each
 * fragment separately.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  as: Tag = 'span',
}: SplitTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const words = text.split(' ');

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      <span aria-hidden="true">
        {words.map((word, index) => (
          // Words repeat within a headline, so the index has to be part of the key.
          <span
            key={`${word}-${index}`}
            // `clip` on the wrapper is what makes the word rise out of a mask
            // instead of simply fading in place.
            className="inline-block overflow-hidden pb-[0.12em] align-bottom"
          >
            <motion.span
              className="inline-block"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{
                duration: duration.slower,
                ease: ease.out,
                delay: delay + index * stagger,
              }}
            >
              {word}
              {index < words.length - 1 ? ' ' : null}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

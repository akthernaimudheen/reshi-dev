'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

type CounterProps = {
  /** e.g. `"+47%"`, `"3.4×"`, `"<1.5s"`, `"Top 3"`. */
  value: string;
  className?: string;
};

/**
 * Counts a stat up when it scrolls into view.
 *
 * Values arrive as display strings with prefixes and suffixes baked in
 * (`+47%`, `<1.5s`), so we extract the first number, animate that, and
 * reassemble around it. Strings with no number render as-is.
 *
 * The final value is what renders on the server and before animation starts —
 * never a placeholder. An earlier version hid it until the first frame, which
 * meant no-JS clients, crawlers and background tabs saw an empty stat.
 *
 * The row cannot reflow while counting, and that is achieved by choosing the
 * START of the count rather than by reserving space. Counting 0 → 40 renders
 * "0" then "40", so the element grows by a digit mid-animation and nudges the
 * layout. Starting at 10 instead keeps the digit count constant for the whole
 * run, which needs no hidden duplicate, no `min-width`, and no padding
 * character. Combined with `tabular-nums` the width is genuinely fixed.
 *
 * Two earlier attempts were worse: a hidden duplicate in a grid cell put the
 * text into the DOM twice (`dd.textContent` read "40+40+", and copying the
 * stat produced it twice), and a `min-width` in `ch` over-reserved, because
 * `ch` is the width of a zero while `+`, `.` and `<` are much narrower.
 */
export function Counter({ value, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const prefersReducedMotion = usePrefersReducedMotion();

  // `24/7` is an idiom, not a quantity — counting it up produced "10/7",
  // which is meaningless. Ratios render static.
  const isRatio = value.includes('/');

  /**
   * Everything derived here must be a PRIMITIVE, because these values feed the
   * effect's dependency array.
   *
   * `String.match()` returns a fresh array on every render, so depending on the
   * array itself made the effect re-run every render — and since its cleanup
   * also set state, that was an unbreakable render loop ("Maximum update depth
   * exceeded") which pinned the main thread and stalled every other animation
   * on the page. Keep the matched text as a string.
   */
  const matched = isRatio ? null : (value.match(/-?\d+(\.\d+)?/)?.[0] ?? null);
  const target = matched === null ? null : Number.parseFloat(matched);
  const decimals = matched?.includes('.') ? (matched.split('.')[1]?.length ?? 0) : 0;

  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (target === null || matched === null || prefersReducedMotion || !inView) return;

    // Begin at the smallest number with the same integer-digit count as the
    // target, so the rendered string never changes length. 40 counts from 10,
    // 180 from 100; single-digit and decimal-led values start at 0 because
    // they are already the right width.
    const integerDigits = Math.floor(Math.abs(target)).toString().length;
    const magnitude = integerDigits > 1 ? Math.pow(10, integerDigits - 1) : 0;
    const origin = target < 0 ? -magnitude : magnitude;

    const durationMs = 1100;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      // Quint ease-out: fast start, long settle. Matches the CSS easing.
      const eased = 1 - Math.pow(1 - progress, 5);
      const current = (origin + (target - origin) * eased).toFixed(decimals);

      setDisplay(value.replace(matched, current));

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    // Cancel only. Setting state here would run on every dependency change,
    // not just unmount, and re-triggering the effect from its own cleanup is
    // exactly the loop described above.
    return () => cancelAnimationFrame(frame);
  }, [inView, prefersReducedMotion, target, decimals, value, matched]);

  return (
    <span ref={ref} className={cn('inline-block tabular-nums', className)}>
      {display}
    </span>
  );
}

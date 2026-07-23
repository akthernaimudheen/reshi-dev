import { cn } from '@/lib/utils';

type MarqueeProps = {
  items: readonly string[];
  className?: string;
};

/**
 * Infinite horizontal ticker.
 *
 * The list is rendered twice and translated by exactly -50%, which is what
 * makes the loop seamless. The duplicate is `aria-hidden` so screen readers
 * hear the names once. Pure CSS animation — no JS, no hydration.
 */
export function Marquee({ items, className }: MarqueeProps) {
  return (
    <div
      className={cn(
        'group relative flex overflow-hidden',
        // Fade the edges instead of hard-cutting the strip.
        '[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]',
        className,
      )}
    >
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1 ? 'true' : undefined}
          className="flex shrink-0 animate-marquee items-center gap-14 pr-14 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        >
          {items.map((item) => (
            <li
              key={item}
              className="text-lg font-semibold whitespace-nowrap text-navy-900/35 transition-colors duration-300 hover:text-navy-900/70"
            >
              {item}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

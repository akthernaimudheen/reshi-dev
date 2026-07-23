import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  tone?: 'light' | 'dark';
  /** Hides the wordmark, leaving only the mark. Used in the mobile header. */
  markOnly?: boolean;
};

/**
 * Wordmark. The mark is an inline SVG rather than an image file so it inherits
 * `currentColor`, scales without a second asset, and costs no extra request.
 */
export function Logo({ className, tone = 'light', markOnly = false }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="Reshi AI — home"
      className={cn(
        'group inline-flex items-center gap-2.5 rounded-lg',
        tone === 'light' ? 'text-navy-900' : 'text-ink-inverse',
        className,
      )}
    >
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="size-8 shrink-0 transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:rotate-[18deg]"
      >
        <defs>
          <linearGradient id="reshi-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#12C7C7" />
            <stop offset="100%" stopColor="#36D8FF" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="currentColor" />
        {/* An 'R' abstracted into a signal rising out of a baseline. */}
        <path
          d="M11 23V9.6c0-.33.27-.6.6-.6h5.02a4.3 4.3 0 0 1 .93 8.5L21.6 23"
          fill="none"
          stroke="url(#reshi-mark)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="11" cy="17.4" r="1.5" fill="url(#reshi-mark)" />
      </svg>

      {!markOnly ? (
        <span className="text-[1.0625rem] font-bold tracking-[-0.03em]">
          Reshi<span className="text-cyan-500">.</span>AI
        </span>
      ) : null}
    </Link>
  );
}

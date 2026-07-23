import { cn } from '@/lib/utils';

type AuroraProps = {
  className?: string;
  tone?: 'light' | 'dark';
};

/**
 * The ambient gradient field behind hero and CTA sections.
 *
 * Three blurred radial blobs on long, offset animation cycles. This is a
 * server component with pure CSS animation — no JS, no WebGL, nothing to
 * hydrate. The blobs are `will-change`-free and only animate `transform`, so
 * they composite on the GPU and cost effectively nothing per frame.
 */
export function Aurora({ className, tone = 'light' }: AuroraProps) {
  const blobs =
    tone === 'light'
      ? [
          'from-cyan-400/45 to-accent/25',
          'from-navy-500/30 to-cyan-300/20',
          'from-accent/30 to-cyan-500/15',
        ]
      : [
          'from-cyan-500/30 to-accent/15',
          'from-navy-500/35 to-cyan-400/12',
          'from-accent/22 to-cyan-600/12',
        ];

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <div
        className={cn(
          'absolute -top-[30%] -left-[10%] h-[70vh] w-[70vh] rounded-full',
          'bg-gradient-to-br blur-[90px]',
          'animate-aurora',
          blobs[0],
        )}
      />
      <div
        className={cn(
          'absolute top-[10%] -right-[15%] h-[60vh] w-[60vh] rounded-full',
          'bg-gradient-to-bl blur-[100px]',
          'animate-aurora [animation-delay:-7s]',
          blobs[1],
        )}
      />
      <div
        className={cn(
          'absolute -bottom-[25%] left-[25%] h-[55vh] w-[55vh] rounded-full',
          'bg-gradient-to-tr blur-[110px]',
          'animate-aurora [animation-delay:-14s]',
          blobs[2],
        )}
      />
    </div>
  );
}

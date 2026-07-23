import { cn } from '@/lib/utils';

type EyebrowProps = React.ComponentPropsWithoutRef<'p'> & {
  tone?: 'light' | 'dark';
};

/**
 * The small tracked label above a section heading. The leading rule is
 * decorative, so it is hidden from assistive technology.
 */
export function Eyebrow({ className, tone = 'light', children, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 text-eyebrow uppercase',
        tone === 'light' ? 'text-cyan-700' : 'text-cyan-300',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn('h-px w-8', tone === 'light' ? 'bg-cyan-500/50' : 'bg-cyan-400/50')}
      />
      {children}
    </p>
  );
}

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-pill border px-3 py-1 text-xs font-medium tracking-[-0.005em]',
  {
    variants: {
      variant: {
        default: 'border-line bg-surface-raised text-ink-muted',
        accent: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-700',
        navy: 'border-navy-900/12 bg-navy-900/6 text-navy-900',
        inverse: 'border-white/15 bg-white/8 text-ink-inverse-muted',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

type BadgeProps = React.ComponentPropsWithoutRef<'span'> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

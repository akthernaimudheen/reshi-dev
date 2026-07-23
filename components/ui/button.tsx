import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-2 whitespace-nowrap',
    'font-semibold tracking-[-0.01em] rounded-pill',
    'transition-[transform,box-shadow,background-color,color,border-color]',
    'duration-200 ease-[var(--ease-out-quint)]',
    'disabled:pointer-events-none disabled:opacity-50',
    // A 1px lift on press reads as physical without costing a layout pass.
    'active:translate-y-px',
    '[&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-navy-900 text-ink-inverse shadow-md',
          'hover:bg-navy-800 hover:shadow-lg',
        ],
        accent: [
          'bg-cyan-500 text-navy-950 shadow-md',
          'hover:bg-cyan-400 hover:shadow-glow',
        ],
        outline: [
          'border border-line-strong bg-transparent text-ink',
          'hover:border-navy-900 hover:bg-navy-900 hover:text-ink-inverse',
        ],
        ghost: 'text-ink hover:bg-navy-900/6',
        inverse: [
          'bg-surface-raised text-navy-900 shadow-md',
          'hover:bg-cyan-50 hover:shadow-lg',
        ],
        'outline-inverse': [
          'border border-white/25 bg-transparent text-ink-inverse',
          'hover:border-white/60 hover:bg-white/10',
        ],
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-[0.9375rem]',
        lg: 'h-13 px-7 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type ButtonProps = React.ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

type ButtonLinkProps = React.ComponentPropsWithoutRef<typeof Link> &
  VariantProps<typeof buttonVariants>;

/** Same visual treatment, rendered as a real anchor for navigation. */
export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

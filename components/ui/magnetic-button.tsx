'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { type VariantProps } from 'class-variance-authority';
import { useMagnetic } from '@/hooks/use-magnetic';
import { buttonVariants } from './button';
import { cn } from '@/lib/utils';

const MotionLink = motion.create(Link);

/**
 * Framer Motion redefines the drag and animation event handlers with its own
 * signatures, which collide with React's DOM types. Omitting them here is the
 * standard fix — none of them are meaningful on a link anyway.
 */
type ConflictingHandlers =
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDragEnter'
  | 'onDragExit'
  | 'onDragLeave'
  | 'onDragOver'
  | 'onDrop'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration';

type MagneticLinkProps = Omit<
  React.ComponentPropsWithoutRef<typeof Link>,
  ConflictingHandlers
> &
  VariantProps<typeof buttonVariants> & { strength?: number };

/**
 * A button-styled link that leans toward the cursor.
 *
 * Reserved for primary calls to action — if everything on the page is
 * magnetic, nothing reads as important. Falls back to a static link for touch
 * users and anyone who has asked for reduced motion (handled inside the hook).
 */
export function MagneticLink({
  className,
  variant,
  size,
  strength = 0.3,
  children,
  ...props
}: MagneticLinkProps) {
  const { ref, x, y, onPointerMove, onPointerLeave } = useMagnetic(strength);

  return (
    <MotionLink
      ref={ref as React.RefObject<HTMLAnchorElement>}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(buttonVariants({ variant, size }), 'gpu', className)}
      {...props}
    >
      {children}
    </MotionLink>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { mainNav, siteConfig, whatsappLink } from '@/constants/site';
import { duration, ease } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { ButtonLink } from '@/components/ui/button';

/**
 * Full-screen mobile navigation.
 *
 * Implements the dialog contract by hand: `role="dialog"` + `aria-modal`,
 * focus moved in on open and restored on close, Tab cycled within the panel,
 * Escape to dismiss, and background scroll locked. These are the four things
 * homegrown drawers usually miss.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    // Defer so the panel exists before we reach into it.
    const focusTimer = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusables.length === 0) return;

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="grid size-10 place-items-center rounded-full border border-line-strong text-navy-900 transition-colors duration-200 hover:bg-navy-900 hover:text-ink-inverse lg:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
            className="fixed inset-0 z-100 lg:hidden"
          >
            <button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-navy-950/40 backdrop-blur-sm"
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: duration.base, ease: ease.out }}
              className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-surface-raised p-6 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-eyebrow text-ink-muted uppercase">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid size-10 place-items-center rounded-full border border-line-strong text-navy-900"
                >
                  <X aria-hidden="true" className="size-5" />
                </button>
              </div>

              <nav aria-label="Mobile" className="mt-8 flex-1">
                <ul className="flex flex-col">
                  {mainNav.map((item, index) => (
                    <li key={item.label} className="border-b border-line last:border-0">
                      <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: duration.base,
                          ease: ease.out,
                          delay: 0.06 + index * 0.05,
                        }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center justify-between py-4 text-h3 text-navy-900',
                            pathname.startsWith(item.href) && 'text-cyan-600',
                          )}
                        >
                          {item.label}
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-5 text-ink-muted"
                          />
                        </Link>

                        {item.items?.length ? (
                          <ul className="-mt-1 flex flex-col gap-1 pb-4">
                            {item.items.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className="block py-1.5 text-sm text-ink-muted"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-8 flex flex-col gap-3">
                <ButtonLink href="/contact" size="lg" variant="primary">
                  Start a project
                  <ArrowUpRight aria-hidden="true" />
                </ButtonLink>
                {whatsappLink ? (
                  <ButtonLink
                    href={whatsappLink}
                    size="lg"
                    variant="outline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Message on WhatsApp
                  </ButtonLink>
                ) : null}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="pt-2 text-center text-sm text-ink-muted"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

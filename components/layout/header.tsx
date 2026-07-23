'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { mainNav } from '@/constants/site';
import { useScrollState } from '@/hooks/use-scroll-state';
import { duration, ease } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { MobileNav } from './mobile-nav';
import { ButtonLink } from '@/components/ui/button';

export function Header() {
  const { scrolled, hidden } = useScrollState();
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  // Closing on a timer stops the menu flickering shut while the pointer
  // crosses the gap between the trigger and the panel.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setOpenMenu(null), [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden && !openMenu ? '-110%' : '0%' }}
      transition={{ duration: duration.base, ease: ease.out }}
      className="fixed inset-x-0 top-0 z-50"
      onMouseLeave={scheduleClose}
    >
      <div
        className={cn(
          'transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300',
          scrolled || openMenu
            ? 'border-b border-line/70 glass shadow-sm'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav
          aria-label="Main"
          className="container-content flex h-18 items-center justify-between gap-8"
        >
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {mainNav.map((item) => {
              const hasMenu = Boolean(item.items?.length);
              const isOpen = openMenu === item.label;

              return (
                <li
                  key={item.label}
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMenu(hasMenu ? item.label : null);
                  }}
                >
                  <Link
                    href={item.href}
                    aria-expanded={hasMenu ? isOpen : undefined}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    onFocus={() => setOpenMenu(hasMenu ? item.label : null)}
                    className={cn(
                      'relative flex items-center gap-1 rounded-pill px-3.5 py-2 text-[0.9375rem] font-medium transition-colors duration-200',
                      isActive(item.href)
                        ? 'text-navy-900'
                        : 'text-ink-muted hover:text-navy-900',
                    )}
                  >
                    {item.label}
                    {hasMenu ? (
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          'size-3.5 transition-transform duration-300',
                          isOpen && 'rotate-180',
                        )}
                      />
                    ) : null}
                    {isActive(item.href) ? (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden="true"
                        className="absolute inset-x-3.5 -bottom-0.5 h-px bg-cyan-500"
                        transition={{ duration: duration.base, ease: ease.out }}
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ButtonLink
              href="/contact"
              size="sm"
              variant="primary"
              className="hidden sm:inline-flex"
            >
              Start a project
              <ArrowUpRight aria-hidden="true" />
            </ButtonLink>
            <MobileNav />
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {openMenu ? (
          <MegaMenu
            label={openMenu}
            onPointerEnter={cancelClose}
            onPointerLeave={scheduleClose}
          />
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

function MegaMenu({
  label,
  onPointerEnter,
  onPointerLeave,
}: {
  label: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  const group = mainNav.find((item) => item.label === label);
  if (!group?.items?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: duration.fast, ease: ease.out }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="hidden border-b border-line/70 glass shadow-lg lg:block"
    >
      <div className="container-content py-8">
        <ul className="grid grid-cols-3 gap-2">
          {group.items.map((entry) => (
            <li key={entry.href}>
              <Link
                href={entry.href}
                className="group flex flex-col gap-1 rounded-card p-4 transition-colors duration-200 hover:bg-navy-900/4"
              >
                <span className="flex items-center gap-1.5 font-semibold text-navy-900">
                  {entry.label}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </span>
                <span className="text-sm text-ink-muted">{entry.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

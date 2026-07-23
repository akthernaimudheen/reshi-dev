'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type TableOfContentsProps = {
  headings: { id: string; text: string; level: number }[];
};

/**
 * Sticky article outline with scroll spy.
 *
 * Uses one IntersectionObserver across all headings rather than a scroll
 * listener doing `getBoundingClientRect` per entry. The top margin pushes the
 * detection line down below the fixed header, so the highlighted item matches
 * what the reader sees rather than what is technically at viewport top.
 */
export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="flex flex-col gap-4">
      <p className="text-eyebrow text-ink-muted uppercase">On this page</p>

      <ul className="flex flex-col gap-1 border-l border-line">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  '-ml-px block border-l py-1.5 text-sm transition-colors duration-200',
                  heading.level === 3 ? 'pl-7' : 'pl-4',
                  isActive
                    ? 'border-cyan-500 font-medium text-navy-900'
                    : 'border-transparent text-ink-muted hover:border-line-strong hover:text-navy-900',
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

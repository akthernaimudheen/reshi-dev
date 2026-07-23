'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { CaseStudy } from '@/types';
import { industries } from '@/content/industries';
import { duration, ease } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { CaseStudyCard } from './case-study-card';

type WorkGridProps = {
  studies: CaseStudy[];
};

const ALL = 'all';

/**
 * Filterable portfolio grid.
 *
 * Cards animate position with `layout` rather than being torn down and
 * rebuilt, so filtering reads as the grid rearranging itself. Only industries
 * that actually have work are offered as filters — a filter that yields an
 * empty grid is a dead end.
 */
export function WorkGrid({ studies }: WorkGridProps) {
  const [active, setActive] = useState<string>(ALL);

  const filters = useMemo(() => {
    const present = new Set(studies.map((study) => study.industry));
    return [
      { slug: ALL, name: 'All work', count: studies.length },
      ...industries
        .filter((industry) => present.has(industry.slug))
        .map((industry) => ({
          slug: industry.slug,
          name: industry.name,
          count: studies.filter((study) => study.industry === industry.slug).length,
        })),
    ];
  }, [studies]);

  const visible =
    active === ALL ? studies : studies.filter((study) => study.industry === active);

  return (
    <div className="flex flex-col gap-12">
      <div
        role="group"
        aria-label="Filter projects by industry"
        className="flex flex-wrap gap-2"
      >
        {filters.map((filter) => {
          const isActive = active === filter.slug;
          return (
            <button
              key={filter.slug}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(filter.slug)}
              className={cn(
                'relative rounded-pill px-4 py-2 text-sm font-medium transition-colors duration-200',
                isActive ? 'text-ink-inverse' : 'text-ink-muted hover:text-navy-900',
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="work-filter-pill"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-pill bg-navy-900"
                  transition={{ duration: duration.base, ease: ease.out }}
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-pill border border-line"
                />
              )}
              <span className="relative">
                {filter.name}
                <span className="ml-1.5 opacity-60">{filter.count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((study) => (
            <motion.li
              key={study.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: duration.base, ease: ease.out }}
            >
              <CaseStudyCard study={study} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <p aria-live="polite" className="sr-only">
        Showing {visible.length} of {studies.length} projects.
      </p>
    </div>
  );
}

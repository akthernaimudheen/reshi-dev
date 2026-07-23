import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Aurora } from '@/components/shared/aurora';
import { AmbientField } from '@/components/shared/ambient-field';
import { Reveal } from '@/components/shared/reveal';
import { SplitText } from '@/components/shared/split-text';
import { Eyebrow } from '@/components/ui/eyebrow';

type Crumb = { name: string; path: string };

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  breadcrumbs?: Crumb[];
  children?: React.ReactNode;
};

/**
 * Shared masthead for every page below the home page. Keeping it in one place
 * is what makes the inner pages feel like one site rather than six.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20">
      <Aurora className="opacity-70" />
      {/* The same antigravity field as the home hero, so every page opens on
          the 3D masthead rather than only the landing page. */}
      <AmbientField tone="light" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_70%)]"
      />

      <div className="relative container-content">
        {breadcrumbs?.length ? (
          <Reveal y={10} blur={false}>
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <li key={crumb.path} className="flex items-center gap-1.5">
                      {index > 0 ? (
                        <ChevronRight
                          aria-hidden="true"
                          className="size-3.5 opacity-50"
                        />
                      ) : null}
                      {isLast ? (
                        <span aria-current="page" className="text-navy-900">
                          {crumb.name}
                        </span>
                      ) : (
                        <Link
                          href={crumb.path}
                          className="transition-colors duration-200 hover:text-navy-900"
                        >
                          {crumb.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </Reveal>
        ) : null}

        <div className="flex max-w-3xl flex-col gap-6">
          {eyebrow ? (
            <Reveal y={10} blur={false}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
          ) : null}

          <SplitText as="h1" text={title} className="text-h1 text-navy-900" />

          {description ? (
            <Reveal delay={0.3}>
              <p className="max-w-2xl text-lead text-ink-muted">{description}</p>
            </Reveal>
          ) : null}

          {children ? <Reveal delay={0.4}>{children}</Reveal> : null}
        </div>
      </div>
    </section>
  );
}

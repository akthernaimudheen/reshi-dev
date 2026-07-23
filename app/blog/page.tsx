import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/shared/json-ld';
import { PageHero } from '@/components/shared/page-hero';
import { Reveal } from '@/components/shared/reveal';
import { CtaSection } from '@/components/shared/cta-section';
import { Badge } from '@/components/ui/badge';

export const metadata = buildMetadata({
  title: 'Blog',
  description:
    'Practical writing on local SEO, website performance, automation and where AI is genuinely worth the money.',
  path: '/blog',
});

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Blog', path: '/blog' },
];

export default function BlogPage() {
  const posts = getAllPosts();
  const [lead, ...rest] = posts;

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <PageHero
        eyebrow="Writing"
        title="What we have learned, written down."
        description="No listicles and no reheated press releases. These are the things we explain repeatedly on calls, so we wrote them once properly."
        breadcrumbs={breadcrumbs}
      />

      <section className="pb-24 lg:pb-32">
        <div className="container-content flex flex-col gap-5">
          {lead ? (
            <Reveal>
              <Link
                href={`/blog/${lead.slug}`}
                className="group grid gap-8 overflow-hidden rounded-hero border border-line bg-surface-raised p-8 shadow-xs transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-lg lg:grid-cols-[1.2fr_1fr] lg:items-center lg:p-10"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="accent">{lead.category}</Badge>
                    <span className="text-sm text-ink-muted">
                      {formatDate(lead.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm text-ink-muted">
                      <Clock aria-hidden="true" className="size-3.5" />
                      {lead.readingTime} min read
                    </span>
                  </div>

                  <h2 className="max-w-[20ch] text-h2 text-navy-900">{lead.title}</h2>
                  <p className="max-w-[52ch] text-lead text-ink-muted">
                    {lead.description}
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-navy-900">
                    Read the article
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>

                <div
                  aria-hidden="true"
                  className="relative hidden aspect-[4/3] overflow-hidden rounded-panel bg-gradient-to-br from-cyan-500 to-navy-900 lg:block"
                >
                  <div className="absolute inset-0 bg-grid-dark opacity-30" />
                  <div className="absolute inset-0 grid place-items-center p-10">
                    <span className="text-6xl font-bold tracking-[-0.05em] text-white/15">
                      {lead.category}
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ) : null}

          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, index) => (
              <Reveal as="li" key={post.slug} delay={index * 0.06}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col gap-4 rounded-panel border border-line bg-surface-raised p-7 shadow-xs transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-lg"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge>{post.category}</Badge>
                    <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                      <Clock aria-hidden="true" className="size-3" />
                      {post.readingTime} min
                    </span>
                  </div>

                  <h2 className="text-h3 text-navy-900">{post.title}</h2>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                    {post.description}
                  </p>

                  <span className="mt-auto flex items-center justify-between border-t border-line pt-4 text-sm text-ink-muted">
                    {formatDate(post.date)}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>

          {posts.length === 0 ? (
            <p className="py-20 text-center text-ink-muted">
              No articles published yet. Check back shortly.
            </p>
          ) : null}
        </div>
      </section>

      <CtaSection />
    </>
  );
}

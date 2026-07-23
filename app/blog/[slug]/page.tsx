import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowUpRight, Clock } from 'lucide-react';
import { getAllPostSlugs, getPost, getRelatedPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import { buildMetadata } from '@/lib/seo';
import { blogPostSchema, breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/shared/json-ld';
import { ScrollProgress } from '@/components/shared/scroll-progress';
import { TableOfContents } from '@/components/blog/table-of-contents';
import { CtaSection } from '@/components/shared/cta-section';
import { Badge } from '@/components/ui/badge';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return buildMetadata({
      title: 'Not found',
      description: '',
      path: '/blog',
      noIndex: true,
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.date,
  });
}

/**
 * Not `as const` — MDX's option types expect mutable plugin arrays, and a
 * readonly tuple is not assignable to them.
 */
const mdxOptions: MDXRemoteProps['options'] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      // Wraps each heading in an anchor so readers can deep-link a section.
      [
        rehypeAutolinkHeadings,
        { behavior: 'wrap', properties: { className: 'heading-anchor' } },
      ],
      [rehypePrettyCode, { theme: 'github-dark-dimmed', keepBackground: true }],
    ],
  },
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const related = getRelatedPosts(slug);
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd data={[blogPostSchema(post), breadcrumbSchema(breadcrumbs)]} />
      <ScrollProgress />

      <article className="pt-32 pb-24 lg:pt-40">
        <header className="container-content">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-navy-900"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5"
            />
            All articles
          </Link>

          <div className="mt-8 flex max-w-3xl flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="accent">{post.category}</Badge>
              <time dateTime={post.date} className="text-sm text-ink-muted">
                {formatDate(post.date)}
              </time>
              <span className="inline-flex items-center gap-1.5 text-sm text-ink-muted">
                <Clock aria-hidden="true" className="size-3.5" />
                {post.readingTime} min read
              </span>
            </div>

            <h1 className="text-h1 text-navy-900">{post.title}</h1>
            <p className="text-lead text-ink-muted">{post.description}</p>

            <div className="flex items-center gap-3 border-t border-line pt-6">
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-full bg-navy-900 text-sm font-semibold text-cyan-400"
              >
                AN
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-navy-900">{post.author}</span>
                <span className="text-sm text-ink-muted">Founder, Reshi AI</span>
              </span>
            </div>
          </div>
        </header>

        <div className="container-content mt-14 grid gap-12 lg:grid-cols-[1fr_16rem] lg:gap-16">
          <div className="prose-article min-w-0">
            <MDXRemote source={post.content} options={mdxOptions} />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <TableOfContents headings={post.headings} />
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-line bg-surface-raised section-y">
          <div className="container-content">
            <h2 className="text-h2 text-navy-900">Keep reading</h2>

            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="group flex h-full flex-col gap-3 rounded-panel border border-line bg-surface p-6 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-cyan-500/30"
                  >
                    <Badge>{item.category}</Badge>
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-navy-900">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-ink-muted">
                      {item.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-navy-900">
                      Read
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <CtaSection />
    </>
  );
}

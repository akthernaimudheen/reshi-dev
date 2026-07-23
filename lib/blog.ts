import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { readingTime, slugify } from '@/lib/utils';
import type { BlogPost, BlogPostMeta } from '@/types';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

type Frontmatter = {
  title: string;
  description: string;
  date: string;
  category: string;
  author: string;
  featured?: boolean;
};

function readPostFile(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return { frontmatter: data as Frontmatter, content };
}

/**
 * Pulls `##` and `###` headings for the table of contents.
 *
 * Fenced code blocks are stripped first — a `# comment` inside a shell snippet
 * is not a heading, and it would otherwise show up in the sidebar.
 */
function extractHeadings(content: string) {
  const withoutCode = content.replace(/```[\s\S]*?```/g, '');
  const matches = withoutCode.matchAll(/^(#{2,3})\s+(.+)$/gm);

  return Array.from(matches).map((match) => {
    const level = match[1]!.length;
    const text = match[2]!.trim();
    return { id: slugify(text), text, level };
  });
}

export function getAllPostSlugs() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export function getPost(slug: string): BlogPost | null {
  const file = readPostFile(slug);
  if (!file) return null;

  const { frontmatter, content } = file;

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    category: frontmatter.category,
    author: frontmatter.author,
    featured: frontmatter.featured ?? false,
    readingTime: readingTime(content),
    content,
    headings: extractHeadings(content),
  };
}

/** All posts, newest first. */
export function getAllPosts(): BlogPostMeta[] {
  return getAllPostSlugs()
    .map((slug) => getPost(slug))
    .filter((post): post is BlogPost => post !== null)
    .map(({ content: _content, headings: _headings, ...meta }) => meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCategories() {
  return Array.from(new Set(getAllPosts().map((post) => post.category))).sort();
}

/** Posts sharing a category, excluding the current one. */
export function getRelatedPosts(slug: string, limit = 3): BlogPostMeta[] {
  const current = getPost(slug);
  if (!current) return [];

  const others = getAllPosts().filter((post) => post.slug !== slug);
  const sameCategory = others.filter((post) => post.category === current.category);

  return [
    ...sameCategory,
    ...others.filter((post) => post.category !== current.category),
  ].slice(0, limit);
}

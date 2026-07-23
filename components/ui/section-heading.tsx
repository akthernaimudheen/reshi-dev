import { Eyebrow } from './eyebrow';
import { Reveal } from '@/components/shared/reveal';
import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  /** Renders as h1 on pages where this is the page title. */
  as?: 'h1' | 'h2';
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
  as: Tag = 'h2',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}

      <Reveal delay={0.06}>
        <Tag
          className={cn(
            Tag === 'h1' ? 'text-h1' : 'text-h2',
            'max-w-[20ch]',
            align === 'center' && 'mx-auto max-w-[22ch]',
            tone === 'light' ? 'text-navy-900' : 'text-ink-inverse',
          )}
        >
          {title}
        </Tag>
      </Reveal>

      {description ? (
        <Reveal delay={0.12}>
          <p
            className={cn(
              'max-w-[58ch] text-lead',
              tone === 'light' ? 'text-ink-muted' : 'text-ink-inverse-muted',
            )}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

import { Info } from 'lucide-react';
import { illustrativeNotice } from '@/content/work';
import { cn } from '@/lib/utils';

/**
 * States plainly that the case studies are illustrative, not delivered client
 * work.
 *
 * This renders on every surface that shows case study data. It is deliberately
 * legible rather than a footnote: presenting invented scenarios as delivered
 * results would be a false claim about the business, and a prospect who later
 * discovers it has every reason to distrust everything else on the site.
 *
 * Delete this component only when every entry in `content/work.ts` is a real
 * engagement with measured numbers and the client's permission to publish.
 */
export function IllustrativeNotice({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        'flex items-start gap-2.5 rounded-card border border-line bg-surface-sunken px-4 py-3 text-sm text-ink-muted',
        className,
      )}
    >
      <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cyan-600" />
      <span>{illustrativeNotice}</span>
    </p>
  );
}

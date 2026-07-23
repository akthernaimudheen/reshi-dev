import { clientLogos } from '@/content/site-content';
import { Marquee } from '@/components/shared/marquee';

export function TrustedBy() {
  return (
    <section
      aria-label="Clients"
      className="border-y border-line bg-surface-raised py-10"
    >
      <div className="container-content flex flex-col gap-6">
        <p className="text-center text-eyebrow text-ink-muted uppercase">
          Working with businesses like these
        </p>
      </div>
      <Marquee items={clientLogos} className="mt-2" />
    </section>
  );
}

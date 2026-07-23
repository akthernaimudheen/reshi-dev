'use client';

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, ButtonLink } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with your error reporting service when one is configured.
    console.error(error);
  }, [error]);

  return (
    <section className="grid min-h-[80vh] place-items-center py-32">
      <div className="container-content">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
          <h1 className="text-h2 text-navy-900">Something broke on our side.</h1>
          <p className="text-lead text-ink-muted">
            This is not you. Try again, and if it keeps happening we would genuinely like
            to hear about it.
          </p>

          {error.digest ? (
            <p className="font-mono text-xs text-ink-muted">Reference: {error.digest}</p>
          ) : null}

          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={reset}>
              <RotateCcw aria-hidden="true" />
              Try again
            </Button>
            <ButtonLink href="/" size="lg" variant="outline">
              Back to home
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

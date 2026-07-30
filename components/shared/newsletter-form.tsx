'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { newsletterSchema, type NewsletterInput } from '@/lib/validations';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: NewsletterInput) => {
    setStatus('submitting');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Subscription failed');
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <p
        role="status"
        className="flex items-center gap-2.5 rounded-card border border-cyan-400/30 bg-cyan-400/8 px-4 py-3.5 text-sm text-cyan-200"
      >
        <Check aria-hidden="true" className="size-4 shrink-0" />
        Thanks — we received your subscription.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'newsletter-error' : undefined}
            className={cn(
              'w-full rounded-pill border border-white/15 bg-white/6 px-5 py-3 text-sm text-ink-inverse',
              'placeholder:text-ink-inverse-muted/70',
              'transition-[border-color,background-color] duration-200',
              'focus:border-cyan-400 focus:bg-white/10 focus:outline-none',
              errors.email && 'border-red-400/60',
            )}
            {...register('email')}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          aria-label="Subscribe"
          className="grid size-12 shrink-0 place-items-center rounded-full bg-cyan-500 text-navy-950 transition-colors duration-200 hover:bg-cyan-400 disabled:opacity-60"
        >
          {status === 'submitting' ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <ArrowRight aria-hidden="true" className="size-4" />
          )}
        </button>
      </div>

      {errors.email ? (
        <p id="newsletter-error" role="alert" className="text-sm text-red-300">
          {errors.email.message}
        </p>
      ) : status === 'error' ? (
        <p role="alert" className="text-sm text-red-300">
          That did not go through. Please try again.
        </p>
      ) : null}
    </form>
  );
}

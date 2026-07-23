'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Loader2 } from 'lucide-react';
import { services } from '@/content/services';
import { budgetOptions, contactSchema, type ContactInput } from '@/lib/validations';
import { duration, ease } from '@/lib/motion';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';

type Status = 'idle' | 'submitting' | 'success' | 'error';

type ContactFormProps = {
  /** Pre-selects a service, e.g. from `/contact?plan=growth`. */
  defaultService?: string;
};

export function ContactForm({ defaultService }: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    // Validate on blur, then live once a field has already errored — this is
    // the least irritating pattern: no red text while you are still typing
    // your email for the first time.
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      service: defaultService ?? '',
      budget: '',
      message: '',
      website: '',
    },
  });

  const onSubmit = async (values: ContactInput) => {
    setStatus('submitting');
    setServerError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? 'Something went wrong.');
      }

      setStatus('success');
      reset();
    } catch (error) {
      setStatus('error');
      setServerError(
        error instanceof Error
          ? error.message
          : 'We could not send that. Please email us directly.',
      );
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: duration.slow, ease: ease.out }}
        className="flex flex-col items-start gap-4 rounded-panel border border-cyan-500/25 bg-cyan-500/6 p-8"
        role="status"
      >
        <span className="grid size-12 place-items-center rounded-full bg-cyan-500 text-navy-950">
          <Check aria-hidden="true" className="size-6" />
        </span>
        <div>
          <h3 className="text-h3 text-navy-900">Thank you — that came through.</h3>
          <p className="mt-2 max-w-md text-ink-muted">
            We read every enquiry ourselves and reply within one working day, usually
            sooner. If it is urgent, WhatsApp is faster.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setStatus('idle')}>
          Send another message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Honeypot. Hidden from sight and from assistive tech, but present in
          the DOM for bots that fill every input they find. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website-field">Website</label>
        <input
          id="website-field"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" required error={errors.name?.message}>
          {(props) => (
            <input
              type="text"
              autoComplete="name"
              placeholder="Your name"
              {...props}
              {...register('name')}
            />
          )}
        </Field>

        <Field label="Email" required error={errors.email?.message}>
          {(props) => (
            <input
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              {...props}
              {...register('email')}
            />
          )}
        </Field>

        <Field label="Company" error={errors.company?.message}>
          {(props) => (
            <input
              type="text"
              autoComplete="organization"
              placeholder="Business name"
              {...props}
              {...register('company')}
            />
          )}
        </Field>

        <Field label="Phone" error={errors.phone?.message}>
          {(props) => (
            <input
              type="tel"
              autoComplete="tel"
              placeholder="+91 00000 00000"
              {...props}
              {...register('phone')}
            />
          )}
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="What do you need?" required error={errors.service?.message}>
          {(props) => (
            <select {...props} {...register('service')}>
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.slug} value={service.title}>
                  {service.title}
                </option>
              ))}
              <option value="Not sure yet">Not sure yet — help me decide</option>
            </select>
          )}
        </Field>

        <Field label="Budget" error={errors.budget?.message}>
          {(props) => (
            <select {...props} {...register('budget')}>
              <option value="">Prefer not to say</option>
              {budgetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <Field
        label="Tell us about the project"
        required
        error={errors.message?.message}
        hint="What you sell, who buys it, and what is not working right now."
      >
        {(props) => (
          <textarea
            rows={6}
            placeholder="We run a 40-seat restaurant in Kochi. Weekends are full, weekdays are empty, and our site is a template from 2019…"
            {...props}
            {...register('message')}
          />
        )}
      </Field>

      {serverError ? (
        <p role="alert" className="text-sm text-red-600">
          {serverError}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button type="submit" size="lg" disabled={status === 'submitting'}>
          {status === 'submitting' ? (
            <>
              <Loader2 aria-hidden="true" className="animate-spin" />
              Sending
            </>
          ) : (
            <>
              Send enquiry
              <ArrowUpRight aria-hidden="true" />
            </>
          )}
        </Button>
        <p className="text-sm text-ink-muted">We reply within one working day.</p>
      </div>
    </form>
  );
}

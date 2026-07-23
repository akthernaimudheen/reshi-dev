import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';

/**
 * Contact form endpoint.
 *
 * NOTE: this validates, rate-limits and logs the enquiry, but does not yet
 * deliver it anywhere — no email provider is configured. Wire up Resend (or
 * similar) at the marked TODO before launch, or enquiries will be accepted
 * and silently dropped.
 */

/**
 * In-memory rate limit. Adequate for a single instance; on a multi-region
 * deployment this needs to move to a shared store (Upstash, Redis) or it
 * only limits per-instance.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many enquiries. Please try again in a minute.' },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Please check the highlighted fields.',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // Honeypot tripped. Return 200 so the bot records a success and moves on
  // rather than retrying with the field cleared.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { website: _honeypot, ...enquiry } = parsed.data;

  // TODO: deliver the enquiry. Suggested: Resend for the notification email
  // plus a row in your CRM. Until this exists, enquiries reach the server log
  // and nowhere else.
  console.info('[contact] enquiry received', {
    ...enquiry,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}

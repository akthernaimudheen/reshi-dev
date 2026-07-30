import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { sendContactNotification } from '@/lib/email';

/**
 * Contact form endpoint.
 *
 * Validates, rate-limits, then emails the enquiry via Resend. A missing
 * configuration or provider failure returns 503 so the visitor is never shown
 * a false success message.
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
  const receivedAt = new Date().toISOString();

  const result = await sendContactNotification(enquiry);

  if (!result.delivered) {
    console.error('[contact] delivery failed', {
      reason: result.reason,
      detail: 'detail' in result ? result.detail : undefined,
      receivedAt,
    });

    return NextResponse.json(
      {
        error:
          'We could not deliver that enquiry. Please email us directly and try again later.',
      },
      { status: 503 },
    );
  }

  console.info('[contact] enquiry delivered', { receivedAt });
  return NextResponse.json({ ok: true });
}

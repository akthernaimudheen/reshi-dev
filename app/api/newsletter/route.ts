import { NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validations';
import { sendNewsletterNotification } from '@/lib/email';

/**
 * Newsletter signup.
 *
 * Sends an inbox notification via Resend. This is not yet an automated
 * audience or double-opt-in flow; add that when a newsletter platform is
 * selected.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    );
  }

  const receivedAt = new Date().toISOString();
  const result = await sendNewsletterNotification(parsed.data.email);

  if (!result.delivered) {
    console.error('[newsletter] delivery failed', {
      reason: result.reason,
      detail: 'detail' in result ? result.detail : undefined,
      receivedAt,
    });

    return NextResponse.json(
      { error: 'We could not record that subscription. Please try again later.' },
      { status: 503 },
    );
  }

  console.info('[newsletter] signup delivered', { receivedAt });
  return NextResponse.json({ ok: true });
}

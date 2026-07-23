import { NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validations';

/**
 * Newsletter signup.
 *
 * NOTE: like the contact route, this validates and logs but does not yet
 * persist anywhere. Connect your email platform's audience API at the TODO
 * before promoting the form.
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

  // TODO: add the address to your audience (Resend / Mailchimp / Klaviyo) and
  // trigger the double opt-in email the success message promises.
  console.info('[newsletter] signup', {
    email: parsed.data.email,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}

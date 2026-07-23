import { z } from 'zod';

/**
 * Shared between the client form and the API route, so validation cannot
 * drift between the two. The client gets instant feedback; the server
 * re-validates because client-side checks are a convenience, not a control.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name.')
    .max(80, 'That name is a little too long.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  company: z.string().trim().max(120).optional().or(z.literal('')),
  phone: z
    .string()
    .trim()
    .max(24)
    .optional()
    .or(z.literal(''))
    .refine(
      (value) => !value || /^[\d\s+()-]{7,}$/.test(value),
      'Please enter a valid phone number.',
    ),
  service: z.string().min(1, 'Please choose what you need help with.'),
  budget: z.string().optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(20, 'A couple of sentences helps us reply usefully.')
    .max(2000, 'Please keep this under 2000 characters.'),
  /**
   * Honeypot. Real users never see this field, so any value in it means a bot
   * filled the form blindly. Cheaper and less hostile than a CAPTCHA.
   *
   * Deliberately NOT constrained to an empty string: a `.max(0)` here would
   * fail schema validation before the route's honeypot branch runs, returning
   * a 400 whose error body names this field — telling the bot exactly where
   * the trap is. The route inspects the value after a successful parse and
   * answers 200 so the bot records a win and stops retrying.
   */
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const budgetOptions = [
  'Under ₹1,00,000',
  '₹1,00,000 – ₹3,00,000',
  '₹3,00,000 – ₹6,00,000',
  'Over ₹6,00,000',
  'Not sure yet',
] as const;

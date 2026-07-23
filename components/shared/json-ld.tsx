type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Renders structured data.
 *
 * The payload is built entirely from our own typed content, never from user
 * input, so serialising it directly is safe. `<` is still escaped because a
 * stray one inside a string would close the script tag early.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

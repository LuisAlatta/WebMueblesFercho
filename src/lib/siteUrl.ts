/**
 * Returns the site base URL, ensuring it always has a protocol.
 * Prevents `new URL()` from throwing ERR_INVALID_URL when the env var
 * is set without "https://" (e.g. on Vercel: "web-muebles-fercho.vercel.app").
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `https://${raw}`;
}

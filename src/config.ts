/**
 * Site-wide configuration. The product name lives here and nowhere else:
 * every component, page title and meta tag reads it from BRAND.
 */
export const BRAND = "Spitch";

/** The wordmark is the brand name in lowercase, followed by an orange dot. */
export const WORDMARK = BRAND.toLowerCase();

/**
 * Public address of the site, used for Open Graph and canonical tags.
 * TODO before launch: replace with the real domain (see README).
 */
export const SITE_URL = "https://spitch.example";

/**
 * Supabase keys come from the environment. Both naming styles work: VITE_ (this project's own) and
 * NEXT_PUBLIC_ (what Supabase's Vercel integration creates). Only these public values reach the browser.
 */
const env = (import.meta.env ?? {}) as Record<string, string | undefined>;
export const SUPABASE_URL = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY =
  env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

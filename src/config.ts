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

/** Supabase keys come from the environment (Vite exposes only VITE_ variables to the browser). */
export const SUPABASE_URL = (import.meta.env?.VITE_SUPABASE_URL as string | undefined) ?? "";
export const SUPABASE_ANON_KEY = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined) ?? "";

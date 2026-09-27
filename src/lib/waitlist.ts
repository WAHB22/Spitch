import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/config";
import type { Role } from "@/content";

export type WaitlistInput = {
  email: string;
  role: Role | "";
  organization: string;
  inRegion: "yes" | "no" | "";
  consent: boolean;
  /** Honeypot. People never see it; bots fill it in. */
  website: string;
};

export type FieldError = "emailRequired" | "emailInvalid" | "roleRequired" | "organizationTooLong" | "regionRequired" | "consentRequired";
export type FieldErrors = Partial<Record<"email" | "role" | "organization" | "inRegion" | "consent", FieldError>>;
export type SubmitResult = "added" | "duplicate";

export const ORGANIZATION_MAX = 100;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normalizeEmail = (raw: string) => raw.trim().toLowerCase();

export function validate(input: WaitlistInput): FieldErrors {
  const errors: FieldErrors = {};
  const email = normalizeEmail(input.email);
  if (!email) errors.email = "emailRequired";
  else if (email.length > 254 || !EMAIL.test(email)) errors.email = "emailInvalid";
  if (!input.role) errors.role = "roleRequired";
  if (input.organization.trim().length > ORGANIZATION_MAX) errors.organization = "organizationTooLong";
  if (!input.inRegion) errors.inRegion = "regionRequired";
  if (!input.consent) errors.consent = "consentRequired";
  return errors;
}

/** Mock mode: no Supabase keys configured. The form still works, nothing is stored. */
export const isMockMode = () => !SUPABASE_URL || !SUPABASE_ANON_KEY;
const mockEmails = new Set<string>();

/**
 * Adds someone to the waitlist. Insert only: the table's row level security allows
 * anonymous inserts with consent and nothing else, so no row is read back.
 * A unique violation (23505) means the email is already there, which counts as success.
 */
export async function joinWaitlist(input: WaitlistInput): Promise<SubmitResult> {
  // Honeypot filled: act as if it worked, send nothing.
  if (input.website.trim()) {
    await wait(600);
    return "added";
  }

  const row = {
    email: normalizeEmail(input.email),
    role: input.role as Role,
    organization: input.organization.trim() || null,
    in_region: input.inRegion === "yes",
    consent: input.consent,
  };

  if (isMockMode()) {
    console.warn("[waitlist] Mock mode: the Supabase URL or key is missing, so nothing was saved.", row);
    await wait(700);
    if (mockEmails.has(row.email)) return "duplicate";
    mockEmails.add(row.email);
    return "added";
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { error } = await supabase.from("waitlist").insert(row);
  if (!error) return "added";
  if (error.code === "23505") return "duplicate";
  throw new Error(error.message);
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

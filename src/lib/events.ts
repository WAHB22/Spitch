import type { Role } from "@/content";

/** The "Join the waitlist" buttons on the pitcher and builder cards pre-select that role in the form. */
const EVENT = "spitch:choose-role";

export function chooseRole(role: Role) {
  window.dispatchEvent(new CustomEvent<Role>(EVENT, { detail: role }));
}

export function onChooseRole(fn: (role: Role) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<Role>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

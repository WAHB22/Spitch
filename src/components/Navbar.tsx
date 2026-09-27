import { ListIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { content } from "@/content";
import { cn } from "@/lib/utils";
import { Wordmark } from "./Wordmark";

const nav = content.nav;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  // Escape closes the menu and gives focus back to the button that opened it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className="on-dark sticky top-0 z-40 border-b border-line-dark bg-ink/90 text-white backdrop-blur-md supports-[not(backdrop-filter:blur(1px))]:bg-ink">
      <div className="container-x flex h-16 items-center justify-between gap-3 md:h-[72px]">
        <a href="#top" className="text-[1.6rem] leading-none" aria-label={content.a11y.home}>
          <Wordmark />
        </a>

        <nav aria-label={content.a11y.mainNav} className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-4 py-2 text-[15px] font-medium text-white/80 transition-colors hover:text-white">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href="#waitlist" className="btn btn-primary min-h-10 px-4 text-[15px] md:min-h-11 md:px-5">{nav.cta}</a>
          <button
            ref={toggle}
            type="button"
            className="grid size-11 place-items-center rounded-full text-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? content.a11y.closeMenu : content.a11y.openMenu}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <XIcon size={24} aria-hidden="true" /> : <ListIcon size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label={content.a11y.mainNav}
        hidden={!open}
        className={cn("border-t border-line-dark md:hidden")}
      >
        <ul className="container-x flex flex-col py-3">
          {nav.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-2 py-3.5 font-display text-2xl font-semibold tracking-tight text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

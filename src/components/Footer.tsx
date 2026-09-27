import { Link } from "react-router-dom";
import { content } from "@/content";
import { Wordmark } from "./Wordmark";

export function Footer() {
  const f = content.footer;
  const email = content.placeholders.contactEmail;
  return (
    <footer className="border-t border-line bg-paper text-ink">
      <div className="container-x flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <Link to="/" className="self-start text-3xl leading-none" aria-label={content.a11y.home}><Wordmark /></Link>
          <p className="text-ink/75">{f.madeIn}</p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-medium">
            <li><a href={`mailto:${email}`} className="underline decoration-line decoration-2 underline-offset-4 hover:decoration-ink">{email}</a></li>
            <li><Link to="/privacy" className="underline decoration-line decoration-2 underline-offset-4 hover:decoration-ink">{f.privacy}</Link></li>
            <li><Link to="/terms" className="underline decoration-line decoration-2 underline-offset-4 hover:decoration-ink">{f.terms}</Link></li>
          </ul>
          <p className="text-sm text-muted">{f.rights(new Date().getFullYear())}</p>
        </div>
      </div>
    </footer>
  );
}

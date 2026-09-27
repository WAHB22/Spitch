import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Wordmark } from "@/components/Wordmark";
import { content } from "@/content";

type Doc = (typeof content.legal)["privacy" | "terms"];

/** The draft privacy policy and terms share one layout. Both are clearly marked as drafts. */
export default function LegalPage({ doc }: { doc: Doc }) {
  const l = content.legal;
  const email = content.placeholders.contactEmail;
  useEffect(() => { document.title = l.pageTitle(doc.title); }, [doc.title, l]);
  return (
    <>
      <header className="on-dark bg-ink text-white">
        <div className="container-x flex h-16 items-center justify-between md:h-[72px]">
          <Link to="/" className="text-[1.6rem] leading-none" aria-label={content.a11y.home}><Wordmark /></Link>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[15px] font-medium text-white/85 hover:text-white">
            <ArrowLeftIcon size={18} aria-hidden="true" />
            {l.back}
          </Link>
        </div>
      </header>
      <main id="main" className="bg-paper py-14 md:py-20">
        <div className="container-x max-w-[760px]">
          <p className="rounded-[12px] border-2 border-ink bg-brand px-4 py-3 font-display font-bold tracking-tight text-ink">{l.draftBanner}</p>
          <h1 className="mt-8 text-[clamp(2.5rem,7vw,4.5rem)] font-bold">{doc.title}</h1>
          <p className="mt-3 text-muted">{l.updated}</p>
          {doc.sections.map((s) => (
            <section key={s.heading} className="mt-10">
              <h2 className="text-2xl font-bold">{s.heading}</h2>
              {s.body.map((p) => <p key={p} className="mt-3 text-lg leading-relaxed text-ink/80">{p}</p>)}
            </section>
          ))}
          <p className="mt-12 border-t border-line pt-6 text-lg">
            {doc.contact}{" "}
            <a href={`mailto:${email}`} className="font-semibold underline decoration-2 underline-offset-4">{email}</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Wordmark } from "@/components/Wordmark";
import { content } from "@/content";

export default function NotFound() {
  const n = content.notFound;
  useEffect(() => { document.title = n.pageTitle; }, [n.pageTitle]);
  return (
    <main id="main" className="on-dark grid min-h-[100dvh] place-items-center bg-ink px-4 text-center text-white">
      <div>
        <Wordmark className="text-4xl" />
        <h1 className="mt-8 text-5xl font-bold">{n.title}</h1>
        <p className="mt-3 text-muted-dark">{n.body}</p>
        <Link to="/" className="btn btn-primary mt-8">{n.back}</Link>
      </div>
    </main>
  );
}

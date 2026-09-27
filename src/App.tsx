import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { content } from "@/content";
import Landing from "@/pages/Landing";

// The legal pages and 404 are small, rarely visited, and kept out of the landing bundle.
const LegalPage = lazy(() => import("@/pages/LegalPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

/** New pages start at the top; in-page anchors keep their normal behaviour. */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (!hash) window.scrollTo(0, 0); }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-[100dvh] bg-paper" />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/privacy" element={<LegalPage doc={content.legal.privacy} />} />
          <Route path="/terms" element={<LegalPage doc={content.legal.terms} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

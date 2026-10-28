import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { AnnouncementBar, PageLoader, ScrollProgress } from "./Extras";
import { useSite } from "../lib/site";

// Scroll to the hash target if there is one, otherwise to the top, on every route change.
function ScrollManager({ ready }) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!ready) return;
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) return el.scrollIntoView({ behavior: "smooth" });
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, ready]);
  return null;
}

export default function Layout() {
  const { content, loading, error } = useSite();
  const { pathname } = useLocation();

  if (loading) return <PageLoader />;
  if (!content) return <div className="container section center"><h2 className="h3">Couldn't load the site</h2><p className="muted">{error}</p></div>;

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollManager ready />
      <ScrollProgress />
      <AnnouncementBar />
      <Header />
      <main id="main" key={pathname} className="page-fade"><Outlet /></main>
      <Footer />
    </>
  );
}

import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

// Scroll to the hash target if there is one, otherwise to the top, on every route change.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) return el.scrollIntoView({ behavior: "smooth" });
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function Layout() {
  return (
    <>
      <ScrollManager />
      <Header />
      <main><Outlet /></main>
      <Footer />
    </>
  );
}

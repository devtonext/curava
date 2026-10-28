import { useEffect, useState } from "react";
import SmartLink from "./SmartLink";
import { useSite } from "../lib/site";

export function AnnouncementBar() {
  const { content } = useSite();
  const g = content.general;
  const [hidden, setHidden] = useState(() => {
    try { return sessionStorage.getItem("announcement_closed") === g.announcement_text; } catch { return false; }
  });
  if (!g.announcement_enabled || !g.announcement_text || hidden) return null;
  const close = () => {
    try { sessionStorage.setItem("announcement_closed", g.announcement_text); } catch { /* ignore */ }
    setHidden(true);
  };
  return (
    <div className="announcement">
      <div className="container announcement-inner">
        <span className="pulse" />
        {g.announcement_link
          ? <SmartLink to={g.announcement_link}>{g.announcement_text} <u>Learn more</u></SmartLink>
          : <span>{g.announcement_text}</span>}
        <button onClick={close} aria-label="Dismiss announcement">×</button>
      </div>
    </div>
  );
}

export function ScrollProgress() {
  const [p, setP] = useState(0);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setP(max > 0 ? scrollY / max : 0);
      setShowTop(scrollY > 800);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${p})` }} />
      <button className={`back-to-top${showTop ? " show" : ""}`} onClick={() => scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">↑</button>
    </>
  );
}

export function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="Loading">
      <span className="logo-mark spin-soft" />
    </div>
  );
}

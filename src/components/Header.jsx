import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LogoIcon } from "./Icons";
import { useSite } from "../lib/site";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/programs", label: "Programs" },
  { to: "/specialists", label: "Specialists" },
  { to: "/insights", label: "Insights" },
  { to: "/about", label: "About" },
];

export default function Header() {
  const { content } = useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, search } = useLocation();

  useEffect(() => setOpen(false), [pathname, search]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}${open ? " nav-open" : ""}`}>
      <div className="container nav">
        <Link to="/" className="logo" aria-label={`${content.general.brand_name} home`}>
          <span className="logo-mark"><LogoIcon /></span>{content.general.brand_name}.
        </Link>
        <ul className="nav-links">
          {NAV.map(n => (
            <li key={n.to}><NavLink to={n.to} end={n.to === "/"}>{n.label}</NavLink></li>
          ))}
        </ul>
        <div className="nav-cta">
          <Link to="/contact?tab=book">Book visit</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <button className="menu-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          <span />
        </button>
      </div>
    </header>
  );
}

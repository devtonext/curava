import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowIcon } from "./Icons";
import { isEmail } from "../utils";

const COLS = [
  { title: "Programs", links: [["Preventive screening", "/programs"], ["Genomic insights", "/programs"], ["Chronic care", "/programs"], ["Virtual follow-ups", "/programs"]] },
  { title: "Company", links: [["Our story", "/about"], ["Specialists", "/specialists"], ["Insights", "/insights"], ["Careers", "/about#careers"]] },
  { title: "Support", links: [["Patient desk", "/contact"], ["Book a visit", "/contact?tab=book"], ["FAQ", "/programs#faq"], ["Press", "/contact"]] },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const subscribe = e => {
    e.preventDefault();
    if (!isEmail(email)) return setMsg("Please enter a valid email address.");
    setMsg("You're in — watch your inbox for our next health notes.");
    setEmail("");
  };

  return (
    <footer className="site-footer" id="newsletter">
      <div className="container">
        <div className="footer-card">
          <div className="footer-brand">
            <div className="wordmark">curava.</div>
            <div>
              <form className="newsletter" onSubmit={subscribe} noValidate>
                <input type="email" placeholder="Your email for health notes" aria-label="Email address"
                  value={email} onChange={e => { setEmail(e.target.value); setMsg(""); }} />
                <button type="submit" aria-label="Subscribe"><ArrowIcon /></button>
              </form>
              <p className="newsletter-msg" aria-live="polite" style={{ marginTop: 12 }}>{msg}</p>
            </div>
          </div>
          {COLS.map(col => (
            <div className="footer-col" key={col.title}>
              <h6>{col.title}</h6>
              <ul>{col.links.map(([label, to]) => <li key={label}><Link to={to}>{label}</Link></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Curava Health. All rights reserved.</span>
          <span>Privacy · Terms · Accessibility</span>
        </div>
      </div>
    </footer>
  );
}

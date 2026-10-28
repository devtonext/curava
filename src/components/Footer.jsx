import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowIcon } from "./Icons";
import { api } from "../lib/api";
import { useSite } from "../lib/site";
import { isEmail } from "../utils";

const COLS = [
  { title: "Programs", links: [["All programs", "/programs"], ["Membership plans", "/programs#pricing"], ["How it works", "/programs#steps"], ["FAQ", "/programs#faq"]] },
  { title: "Company", links: [["Our story", "/about"], ["Specialists", "/specialists"], ["Insights", "/insights"], ["Careers", "/about#careers"]] },
];

export default function Footer() {
  const { content } = useSite();
  const { general, contact } = content;
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const subscribe = async e => {
    e.preventDefault();
    if (!isEmail(email)) return setMsg("Please enter a valid email address.");
    setBusy(true);
    try {
      await api.submit("subscribers", { email: email.trim().toLowerCase() });
      setMsg("You're in — watch your inbox for our next health notes.");
      setEmail("");
    } catch {
      setMsg("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const socials = [["Instagram", contact.instagram], ["LinkedIn", contact.linkedin], ["X", contact.x], ["Facebook", contact.facebook]].filter(([, url]) => url);

  return (
    <footer className="site-footer" id="newsletter">
      <div className="container">
        <div className="footer-card">
          <div className="footer-brand">
            <div className="wordmark">{general.brand_name.toLowerCase()}.</div>
            <div>
              <form className="newsletter" onSubmit={subscribe} noValidate>
                <input type="email" placeholder="Your email for health notes" aria-label="Email address"
                  value={email} onChange={e => { setEmail(e.target.value); setMsg(""); }} />
                <button type="submit" aria-label="Subscribe" disabled={busy}><ArrowIcon /></button>
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
          <div className="footer-col">
            <h6>Contact</h6>
            <ul>
              <li><a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>{contact.phone}</a></li>
              <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
              <li><Link to="/contact?tab=book">Book a visit</Link></li>
              {socials.map(([label, url]) => <li key={label}><a href={url} target="_blank" rel="noreferrer">{label}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {general.footer_note}</span>
          <span>Privacy · Terms · Accessibility</span>
        </div>
      </div>
    </footer>
  );
}

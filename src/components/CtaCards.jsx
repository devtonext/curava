import { Link } from "react-router-dom";
import { ArrowIcon } from "./Icons";
import Lines from "./Lines";
import Reveal from "./Reveal";
import { useSite } from "../lib/site";

export default function CtaCards({ title }) {
  const { contact } = useSite().content;
  return (
    <section className="section">
      <div className="container">
        <Reveal as="h2" className="h2 center" style={{ marginBottom: 56 }}><Lines text={title} /></Reveal>
        <div className="cta-cards">
          <Reveal><a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="cta-card">
            <span className="icon-circle"><ArrowIcon /></span><span className="label">Call the care desk</span>
          </a></Reveal>
          <Reveal><Link to="/contact?tab=book" className="cta-card">
            <span className="icon-circle"><ArrowIcon /></span><span className="label">Book a visit</span>
          </Link></Reveal>
          <Reveal><Link to="/contact" className="cta-card">
            <span className="icon-circle"><ArrowIcon /></span><span className="label">Send a message</span>
          </Link></Reveal>
        </div>
      </div>
    </section>
  );
}

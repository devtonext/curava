import { Link } from "react-router-dom";
import { ArrowIcon } from "./Icons";
import Reveal from "./Reveal";
import { contact } from "../data";

export default function CtaCards({ title }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal as="h2" className="h2 center" style={{ marginBottom: 56 }}>{title}</Reveal>
        <div className="cta-cards">
          <Reveal as="a" href={contact.phoneHref} className="cta-card">
            <span className="icon-circle"><ArrowIcon /></span><span className="label">Call the care desk</span>
          </Reveal>
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

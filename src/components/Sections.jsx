import { Link } from "react-router-dom";
import Button from "./Button";
import Lines from "./Lines";
import Reveal from "./Reveal";

export function Partners({ title, partners }) {
  if (!partners.length) return null;
  return (
    <section className="partners">
      <div className="container">
        <p className="partners-title">{title}</p>
        <div className="partners-row">
          {partners.map(p => (
            <div className="partner" key={p.id}>
              {p.logo_url ? <img src={p.logo_url} alt={p.name} /> : <span><i />{p.name}</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pricing({ title, text, plans }) {
  if (!plans.length) return null;
  return (
    <section className="section" id="pricing">
      <div className="container">
        <Reveal className="section-head">
          <h2 className="h2"><Lines text={title} /></h2>
          <p className="lead">{text}</p>
        </Reveal>
        <div className="pricing-grid">
          {plans.map(p => (
            <Reveal as="article" key={p.id} className={`plan${p.highlighted ? " plan--featured" : ""}`}>
              {p.highlighted && <span className="plan-badge">Most popular</span>}
              <h3>{p.name}</h3>
              <p className="plan-desc">{p.description}</p>
              <div className="plan-price"><strong>{p.price}</strong><span>{p.period}</span></div>
              <ul>{(p.features || []).map(f => <li key={f}>{f}</li>)}</ul>
              <Button to={`/contact?tab=book&plan=${encodeURIComponent(p.name)}`} variant={p.highlighted ? "yellow" : "purple"}>{p.cta_label || "Get started"}</Button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ArticleCard({ article }) {
  return (
    <Reveal as="article" className="article-card">
      <Link to={`/insights/${article.slug}`}>
        <div className="thumb"><img src={article.image_url} alt="" loading="lazy" /></div>
        <div className="article-meta"><span className="tag">{article.category}</span> {article.read_minutes} min read</div>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
      </Link>
    </Reveal>
  );
}

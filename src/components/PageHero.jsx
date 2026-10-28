import { Link } from "react-router-dom";
import Lines from "./Lines";
import Reveal from "./Reveal";
import Counter from "./Counter";

export default function PageHero({ crumb, title, children, banner, style }) {
  return (
    <section className="page-hero" style={style}>
      <div className="container">
        <div className="breadcrumb"><Link to="/">Home</Link> / <span>{crumb}</span></div>
        <div className="page-hero-grid">
          <Reveal as="h1"><Lines text={title} /></Reveal>
          {children && <Reveal>{children}</Reveal>}
        </div>
        {banner?.img && (
          <Reveal className="page-banner">
            <img src={banner.img} alt={banner.alt || ""} />
            <div className="badge">
              <Counter value={Number(banner.value) || 0} suffix={banner.suffix} />
              <span>{banner.caption}</span>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

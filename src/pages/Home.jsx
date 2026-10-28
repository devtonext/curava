import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Counter from "../components/Counter";
import CtaCards from "../components/CtaCards";
import DoctorCard from "../components/DoctorCard";
import Marquee from "../components/Marquee";
import Reveal from "../components/Reveal";
import ReviewSlider from "../components/ReviewSlider";
import { ArrowIcon } from "../components/Icons";
import { doctors, features, images, reviews, stats } from "../data";

export default function Home() {
  const [active, setActive] = useState(1);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <Reveal className="hero-copy">
            <h1 className="display"><span>Care That</span><br /><span>Thinks Ahead.</span></h1>
            <p className="lead">Data-led diagnostics and specialists who actually listen — so every decision about your health starts with the full picture.</p>
            <Button to="/contact">Talk to us</Button>
          </Reveal>

          <Reveal className="hero-visual">
            <img className="hero-person" src={images.hero} alt="Smiling doctor in a white coat with a stethoscope" />
          </Reveal>

          <Reveal className="hero-side">
            <Link to="/programs" className="start-program"><ArrowIcon />Explore Programs</Link>
            <div className="stat-card">
              <img src={images.dnaCard} alt="Illustration of a DNA double helix" />
              <div className="stat">
                <Counter value={94.7} prefix="+" suffix="%" />
                <span>Early-detection accuracy across our screening panels</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container"><hr className="rule" /></div>

      {/* FEATURES */}
      <section className="section">
        <div className="container features">
          <Reveal as="ul" className="feature-list">
            {features.map((f, i) => (
              <li key={f.title} className={`feature-item${i === active ? " active" : ""}`}
                  onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
                <Link to="/programs">
                  <span className="dots"><i /><i /></span>
                  <div><h3>{f.title}</h3><p>{f.text}</p></div>
                  <ArrowIcon className="arrow-ico go" />
                </Link>
              </li>
            ))}
          </Reveal>

          <Reveal className="feature-media">
            <img key={active} src={features[active].img} alt={features[active].title} style={{ animation: "fadeUp .5s ease" }} />
          </Reveal>

          <Reveal className="feature-text">
            <div className="tags"><span className="tag">Genomics</span><span className="tag">Specialists</span></div>
            <h2 className="h3" style={{ fontSize: "clamp(28px,2.8vw,38px)" }}>The quiet signals your body sends — finally decoded.</h2>
            <p className="muted" style={{ margin: "18px 0 26px", fontSize: 15 }}>We translate lab results into plain language and a clear next step, reviewed by a specialist within 48 hours.</p>
            <Button to="/programs">See how it works</Button>
          </Reveal>
        </div>
      </section>

      <Marquee items={["Smarter diagnostics", "Human-first care"]} />

      {/* STATS */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="h2">Numbers that<br />keep us honest.</h2>
            <p className="lead">Every metric below is tracked quarterly and shared openly with our patient community.</p>
          </Reveal>
          <div className="stats">
            {stats.map(s => (
              <Reveal key={s.label} className={`stat-box${s.tone ? ` is-${s.tone}` : ""}`}>
                <Counter value={s.value} suffix={s.suffix} />
                <p>{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALISTS */}
      <section className="section section--soft">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="h2">Meet the people<br />behind your care.</h2>
            <Button to="/specialists">All specialists</Button>
          </Reveal>
          <div className="doctor-grid">
            {doctors.slice(0, 4).map(d => <DoctorCard key={d.name} doctor={d} />)}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section reviews">
        <div className="container">
          <Reveal as="h2" className="h2 center" style={{ marginBottom: 56 }}>What our patients<br />tell their friends</Reveal>
          <Reveal><ReviewSlider reviews={reviews} /></Reveal>
        </div>
      </section>

      <CtaCards title={<>Reach out,<br />we'll take it from here</>} />
    </>
  );
}

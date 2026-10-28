import { useState } from "react";
import Button from "../components/Button";
import Counter from "../components/Counter";
import CtaCards from "../components/CtaCards";
import DoctorCard, { DoctorModal } from "../components/DoctorCard";
import Lines from "../components/Lines";
import Marquee from "../components/Marquee";
import Reveal from "../components/Reveal";
import ReviewSlider from "../components/ReviewSlider";
import SmartLink from "../components/SmartLink";
import { ArticleCard, Partners } from "../components/Sections";
import { ArrowIcon } from "../components/Icons";
import { usePageTitle, useSite } from "../lib/site";

export default function Home() {
  usePageTitle();
  const { content, collections } = useSite();
  const hero = content.home_hero, feat = content.home_features, s = content.home_sections;
  const { features, stats, doctors, reviews, partners, articles } = collections;
  const [active, setActive] = useState(Math.min(1, features.length - 1));
  const [profile, setProfile] = useState(null);
  const featured = doctors.filter(d => d.featured);
  const homeDoctors = (featured.length ? featured : doctors).slice(0, 4);
  const [line1, ...rest] = hero.title.split("\n");

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <Reveal className="hero-copy">
            <h1 className="display"><span>{line1}</span>{rest.map(l => <span key={l}><br />{l}</span>)}</h1>
            <p className="lead">{hero.subtitle}</p>
            <Button to={hero.cta_link}>{hero.cta_label}</Button>
          </Reveal>

          <Reveal className="hero-visual">
            <img className="hero-person" src={hero.image_url} alt="" fetchpriority="high" />
          </Reveal>

          <Reveal className="hero-side">
            <SmartLink to={hero.circle_link} className="start-program"><ArrowIcon />{hero.circle_label}</SmartLink>
            <div className="stat-card">
              <img src={hero.stat_image_url} alt="" />
              <div className="stat">
                <Counter value={Number(hero.stat_value) || 0} prefix={hero.stat_prefix} suffix={hero.stat_suffix} />
                <span>{hero.stat_caption}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Partners title={s.partners_title} partners={partners} />

      {/* FEATURES */}
      {features.length > 0 && (
        <section className="section">
          <div className="container features">
            <Reveal as="ul" className="feature-list">
              {features.map((f, i) => (
                <li key={f.id} className={`feature-item${i === active ? " active" : ""}`}
                    onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
                  <SmartLink to="/programs">
                    <span className="dots"><i /><i /></span>
                    <div><h3>{f.title}</h3><p>{f.text}</p></div>
                    <ArrowIcon className="arrow-ico go" />
                  </SmartLink>
                </li>
              ))}
            </Reveal>

            <Reveal className="feature-media">
              <img key={active} src={features[active]?.image_url} alt={features[active]?.title} style={{ animation: "fadeUp .5s ease" }} />
            </Reveal>

            <Reveal className="feature-text">
              <div className="tags">{(feat.tags || []).map(t => <span className="tag" key={t}>{t}</span>)}</div>
              <h2 className="h3" style={{ fontSize: "clamp(28px,2.8vw,38px)" }}>{feat.title}</h2>
              <p className="muted" style={{ margin: "18px 0 26px", fontSize: 15 }}>{feat.text}</p>
              <Button to={feat.cta_link}>{feat.cta_label}</Button>
            </Reveal>
          </div>
        </section>
      )}

      <Marquee items={s.marquee} />

      {/* STATS */}
      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="h2"><Lines text={s.stats_title} /></h2>
            <p className="lead">{s.stats_text}</p>
          </Reveal>
          <div className="stats">
            {stats.map(st => (
              <Reveal key={st.id} className={`stat-box${st.tone && st.tone !== "default" ? ` is-${st.tone}` : ""}`}>
                <Counter value={Number(st.value)} prefix={st.prefix} suffix={st.suffix} />
                <p>{st.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALISTS */}
      <section className="section section--soft">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="h2"><Lines text={s.specialists_title} /></h2>
            <Button to="/specialists">{s.specialists_cta}</Button>
          </Reveal>
          <div className="doctor-grid">
            {homeDoctors.map(d => <DoctorCard key={d.id} doctor={d} onOpen={setProfile} />)}
          </div>
        </div>
      </section>
      <DoctorModal doctor={profile} onClose={() => setProfile(null)} />

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <section className="section reviews">
          <div className="container">
            <Reveal as="h2" className="h2 center" style={{ marginBottom: 56 }}><Lines text={s.reviews_title} /></Reveal>
            <Reveal><ReviewSlider reviews={reviews} /></Reveal>
          </div>
        </section>
      )}

      {/* INSIGHTS */}
      {articles.length > 0 && (
        <section className="section">
          <div className="container">
            <Reveal className="section-head">
              <h2 className="h2"><Lines text={s.insights_title} /></h2>
              <Button to="/insights">All insights</Button>
            </Reveal>
            <div className="grid-3">
              {articles.slice(0, 3).map(a => <ArticleCard key={a.id} article={a} />)}
            </div>
          </div>
        </section>
      )}

      <div className="section--soft"><CtaCards title={s.cta_title} /></div>
      <div style={{ height: 30 }} />
    </>
  );
}

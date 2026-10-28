import Button from "../components/Button";
import InfoCard from "../components/InfoCard";
import Lines from "../components/Lines";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { usePageTitle, useSite } from "../lib/site";

export default function About() {
  usePageTitle("About");
  const { content, collections } = useSite();
  const p = content.about_page;
  const { company_values: values, milestones } = collections;

  return (
    <>
      <PageHero
        crumb="About"
        title={p.title}
        banner={{ img: p.banner_image, value: p.banner_value, suffix: p.banner_suffix, caption: p.banner_caption }}
      >
        <p className="lead">{p.intro}</p>
      </PageHero>

      <section className="section">
        <div className="container grid-2">
          <Reveal>
            <span className="eyebrow">{p.mission_eyebrow}</span>
            <h2 className="h2" style={{ marginTop: 20 }}><Lines text={p.mission_title} /></h2>
          </Reveal>
          <Reveal>
            <p className="lead" style={{ maxWidth: "none" }}>{p.mission_text}</p>
            {p.mission_text_2 && <p className="muted" style={{ marginTop: 20 }}>{p.mission_text_2}</p>}
          </Reveal>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="h2"><Lines text={p.values_title} /></h2>
            <p className="lead">{p.values_text}</p>
          </Reveal>
          <div className="grid-3">
            {values.map((v, i) => <InfoCard key={v.id} index={i} title={v.title} text={v.text} tone={v.tone !== "default" && v.tone} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head"><h2 className="h2"><Lines text={p.timeline_title} /></h2></Reveal>
          <Reveal className="timeline">
            {milestones.map(t => (
              <div className="timeline-row" key={t.id}><strong>{t.year}</strong><h4>{t.title}</h4><p>{t.text}</p></div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--soft" id="careers">
        <div className="container grid-2">
          <Reveal className="media-rounded"><img src={p.careers_image} alt="" /></Reveal>
          <Reveal>
            <span className="eyebrow">{p.careers_eyebrow}</span>
            <h2 className="h2" style={{ marginTop: 20 }}><Lines text={p.careers_title} /></h2>
            <ul className="check-list">{(p.careers_points || []).map(t => <li key={t}>{t}</li>)}</ul>
            <Button to="/contact" variant="purple">Get in touch</Button>
          </Reveal>
        </div>
      </section>
      <div style={{ height: 30 }} />
    </>
  );
}

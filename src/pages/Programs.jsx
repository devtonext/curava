import Button from "../components/Button";
import Faq from "../components/Faq";
import InfoCard from "../components/InfoCard";
import Lines from "../components/Lines";
import Marquee from "../components/Marquee";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { Pricing } from "../components/Sections";
import { usePageTitle, useSite } from "../lib/site";

export default function Programs() {
  usePageTitle("Programs");
  const { content, collections } = useSite();
  const p = content.programs_page;
  const { programs, steps, faqs, plans } = collections;

  return (
    <>
      <PageHero
        crumb="Programs"
        title={p.title}
        banner={{ img: p.banner_image, value: p.banner_value, suffix: p.banner_suffix, caption: p.banner_caption }}
      >
        <p className="lead" style={{ marginBottom: 26 }}>{p.intro}</p>
        <Button to="/contact?tab=book" variant="purple">{p.cta_label}</Button>
      </PageHero>

      <section className="section section--soft" id="programs">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="h2"><Lines text={p.grid_title} /></h2>
            <p className="lead">{p.grid_text}</p>
          </Reveal>
          <div className="grid-3">
            {programs.map((pr, i) => <InfoCard key={pr.id} index={i} title={pr.title} text={pr.text} tone={pr.tone !== "default" && pr.tone} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <Reveal className="media-rounded"><img src={p.why_image} alt="" /></Reveal>
          <Reveal>
            <span className="eyebrow">{p.why_eyebrow}</span>
            <h2 className="h2" style={{ marginTop: 20 }}><Lines text={p.why_title} /></h2>
            <ul className="check-list">{(p.why_points || []).map(t => <li key={t}>{t}</li>)}</ul>
            <Button to="/specialists">Meet the specialists</Button>
          </Reveal>
        </div>
      </section>

      <Marquee items={p.marquee} />

      <section className="section" id="steps">
        <div className="container">
          <Reveal className="section-head"><h2 className="h2"><Lines text={p.steps_title} /></h2></Reveal>
          <Reveal className="steps">
            {steps.map((s, i) => (
              <div className="step" key={s.id}>
                <span>Step {String(i + 1).padStart(2, "0")}</span><h4>{s.title}</h4><p>{s.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <div className="section--soft"><Pricing title={p.pricing_title} text={p.pricing_text} plans={plans} /></div>

      <section className="section" id="faq">
        <div className="container">
          <Reveal as="h2" className="h2 center" style={{ marginBottom: 50 }}><Lines text={p.faq_title} /></Reveal>
          <Reveal><Faq items={faqs} /></Reveal>
        </div>
      </section>
    </>
  );
}

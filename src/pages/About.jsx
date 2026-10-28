import Button from "../components/Button";
import InfoCard from "../components/InfoCard";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { images, timeline, values } from "../data";

export default function About() {
  return (
    <>
      <PageHero
        crumb="About"
        title={<>Healthcare that<br />explains itself.</>}
        banner={{ img: images.aboutBanner, alt: "Curava team celebrating together", value: 4, caption: "Clinics, 60+ clinicians and one shared promise" }}
      >
        <p className="lead">Curava started with a simple frustration: people were getting tested more than ever, yet understanding less. We set out to close that gap.</p>
      </PageHero>

      <section className="section">
        <div className="container grid-2">
          <Reveal>
            <span className="eyebrow">Our mission</span>
            <h2 className="h2" style={{ marginTop: 20 }}>Turn every result into a next step.</h2>
          </Reveal>
          <Reveal>
            <p className="lead" style={{ maxWidth: "none" }}>We combine modern diagnostics with clinicians who have the time to talk. The goal isn't more data — it's clarity: what's happening in your body, what it means, and what to do about it.</p>
            <p className="muted" style={{ marginTop: 20 }}>That means smaller patient lists, reports written for humans, and a care team you can actually message. It also means saying no to tests you don't need.</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="h2">What we<br />stand for.</h2>
            <p className="lead">Three principles guide every hire, every program and every conversation.</p>
          </Reveal>
          <div className="grid-3">
            {values.map((v, i) => <InfoCard key={v.title} index={i} {...v} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head"><h2 className="h2">How we got here.</h2></Reveal>
          <Reveal className="timeline">
            {timeline.map(t => (
              <div className="timeline-row" key={t.year}><strong>{t.year}</strong><h4>{t.title}</h4><p>{t.text}</p></div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--soft" id="careers">
        <div className="container grid-2">
          <Reveal className="media-rounded"><img src={images.aboutTeam} alt="Doctor talking with a patient" /></Reveal>
          <Reveal>
            <span className="eyebrow">Careers</span>
            <h2 className="h2" style={{ marginTop: 20 }}>Build the clinic you'd want to visit.</h2>
            <ul className="check-list">
              <li>Patient lists capped so you can practise properly.</li>
              <li>Four-day clinical weeks with protected research time.</li>
              <li>Equity for every full-time team member.</li>
            </ul>
            <Button to="/contact" variant="purple">Get in touch</Button>
          </Reveal>
        </div>
      </section>
      <div style={{ height: 30 }} />
    </>
  );
}

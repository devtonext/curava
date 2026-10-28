import Button from "../components/Button";
import Faq from "../components/Faq";
import InfoCard from "../components/InfoCard";
import Marquee from "../components/Marquee";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { faqs, images, programs, steps } from "../data";

export default function Programs() {
  return (
    <>
      <PageHero
        crumb="Programs"
        title={<>Programs built<br />around your life.</>}
        banner={{ img: images.servicesBanner, alt: "Modern diagnostic laboratory", value: 120, suffix: "+", caption: "Biomarkers reviewed in a single core screening" }}
      >
        <p className="lead" style={{ marginBottom: 26 }}>Pick a starting point. Every program includes a specialist review, a plain-language report and follow-ups that fit your calendar.</p>
        <Button to="/contact?tab=book" variant="purple">Start a program</Button>
      </PageHero>

      <section className="section section--soft" id="programs">
        <div className="container">
          <Reveal className="section-head">
            <h2 className="h2">Six ways<br />to get started.</h2>
            <p className="lead">Each program can be combined or upgraded at any point — your plan grows with you.</p>
          </Reveal>
          <div className="grid-3">
            {programs.map((p, i) => <InfoCard key={p.title} index={i} {...p} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <Reveal className="media-rounded"><img src={images.servicesDetail} alt="Clinician checking a patient's blood pressure" /></Reveal>
          <Reveal>
            <span className="eyebrow">Why it works</span>
            <h2 className="h2" style={{ marginTop: 20 }}>Data you can read.<br />People you can reach.</h2>
            <ul className="check-list">
              <li>Results explained in everyday language — no jargon walls.</li>
              <li>A named specialist who follows your case from start to finish.</li>
              <li>Secure patient portal with every report in one place.</li>
              <li>Transparent pricing, agreed before any test is run.</li>
            </ul>
            <Button to="/specialists">Meet the specialists</Button>
          </Reveal>
        </div>
      </section>

      <Marquee items={["Screen", "Understand", "Plan", "Thrive"]} />

      <section className="section">
        <div className="container">
          <Reveal className="section-head"><h2 className="h2">From first call<br />to clear plan.</h2></Reveal>
          <Reveal className="steps">
            {steps.map((s, i) => (
              <div className="step" key={s.title}>
                <span>Step {String(i + 1).padStart(2, "0")}</span><h4>{s.title}</h4><p>{s.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--soft" id="faq">
        <div className="container">
          <Reveal as="h2" className="h2 center" style={{ marginBottom: 50 }}>Questions,<br />answered.</Reveal>
          <Reveal><Faq items={faqs} /></Reveal>
        </div>
      </section>
    </>
  );
}

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Reveal from "../components/Reveal";
import { useToast } from "../components/Toast";
import { contact, doctors, programs } from "../data";
import { isEmail, isPhone } from "../utils";

const TOPICS = ["Programs & pricing", "My results", "Billing", "Press & partnerships", "Something else"];
const TIMES = ["Morning (7–11am)", "Midday (11am–2pm)", "Afternoon (2–5pm)", "Evening (5–9pm)"];
const today = () => new Date().toISOString().split("T")[0];

const FORMS = {
  message: {
    storageKey: "curava_messages",
    initial: { name: "", email: "", topic: "", message: "" },
    validate: v => ({
      name: !v.name.trim() && "Please enter your name.",
      email: !isEmail(v.email) && "Enter a valid email.",
      topic: !v.topic && "Please choose a topic.",
      message: !v.message.trim() && "Please add a short message.",
    }),
  },
  book: {
    storageKey: "curava_appointments",
    initial: { name: "", phone: "", email: "", program: "", specialist: "", date: "", time: "", notes: "" },
    validate: v => ({
      name: !v.name.trim() && "Please enter your name.",
      phone: !isPhone(v.phone) && "Enter a valid phone number.",
      email: !isEmail(v.email) && "Enter a valid email.",
      program: !v.program && "Please choose a program.",
      date: (!v.date || v.date < today()) && "Please pick a date from today onwards.",
      time: !v.time && "Please choose a time.",
    }),
  },
};

function Field({ id, label, error, full, children }) {
  return (
    <div className={`field${full ? " full" : ""}${error ? " invalid" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="err">{error}</span>}
    </div>
  );
}

export default function Contact() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "book" ? "book" : "message";
  const notify = useToast();

  const [values, setValues] = useState(FORMS[tab].initial);
  const [errors, setErrors] = useState({});
  const [sentName, setSentName] = useState(null);

  // Reset the form when switching tabs; prefill the specialist when arriving from a doctor card.
  useEffect(() => {
    setValues({ ...FORMS[tab].initial, ...(tab === "book" && params.get("doctor") ? { specialist: params.get("doctor") } : {}) });
    setErrors({});
    setSentName(null);
  }, [tab, params.get("doctor")]);

  const switchTab = t => setParams(t === "book" ? { tab: "book" } : {}, { replace: true });

  const bind = name => ({
    id: `${tab}-${name}`,
    name,
    value: values[name],
    onChange: e => {
      setValues(v => ({ ...v, [name]: e.target.value }));
      setErrors(er => ({ ...er, [name]: false }));
    },
  });

  const submit = e => {
    e.preventDefault();
    const errs = FORMS[tab].validate(values);
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return notify("Please check the highlighted fields.");

    // No backend yet: keep submissions in this browser so the flow works end to end.
    try {
      const key = FORMS[tab].storageKey;
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(key, JSON.stringify([...list, { ...values, at: new Date().toISOString() }]));
    } catch { /* storage unavailable */ }

    setSentName(values.name.trim().split(" ")[0] || "there");
    setValues(FORMS[tab].initial);
  };

  return (
    <>
      <section className="page-hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> / <span>Contact</span></div>
          <Reveal as="h1">Contact<br />for health.</Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container grid-2" style={{ alignItems: "start" }}>
          <Reveal>
            <p className="lead">Questions about a program, a result, or just not sure where to start? Our care desk answers every message within one working day.</p>
            <div className="info-list">
              <a href={contact.phoneHref} className="info-item"><span className="icon-circle">☎</span><div><small>Care desk</small><strong>{contact.phone}</strong></div></a>
              <a href={`mailto:${contact.email}`} className="info-item"><span className="icon-circle">@</span><div><small>Email</small><strong>{contact.email}</strong></div></a>
              <div className="info-item"><span className="icon-circle">⌖</span><div><small>Flagship clinic</small><strong>{contact.address}</strong></div></div>
              <div className="info-item"><span className="icon-circle">◷</span><div><small>Hours</small><strong>{contact.hours}</strong></div></div>
            </div>
          </Reveal>

          <Reveal className={`form-card${sentName ? " sent" : ""}`}>
            {!sentName && (
              <div className="tabs" role="tablist">
                <button role="tab" aria-selected={tab === "message"} className={`tab-btn${tab === "message" ? " active" : ""}`} onClick={() => switchTab("message")}>Send a message</button>
                <button role="tab" aria-selected={tab === "book"} className={`tab-btn${tab === "book" ? " active" : ""}`} onClick={() => switchTab("book")}>Book a visit</button>
              </div>
            )}

            <form onSubmit={submit} noValidate key={tab} className="tab-panel active">
              {tab === "message" ? (
                <div className="form-grid">
                  <Field id="message-name" label="Full name" error={errors.name}><input {...bind("name")} placeholder="Jordan Lee" /></Field>
                  <Field id="message-email" label="Email" error={errors.email}><input type="email" {...bind("email")} placeholder="you@email.com" /></Field>
                  <Field id="message-topic" label="Topic" error={errors.topic} full>
                    <select {...bind("topic")}><option value="">Choose a topic</option>{TOPICS.map(t => <option key={t}>{t}</option>)}</select>
                  </Field>
                  <Field id="message-message" label="Message" error={errors.message} full><textarea {...bind("message")} placeholder="How can we help?" /></Field>
                  <div className="full"><Button type="submit" variant="purple">Send message</Button></div>
                </div>
              ) : (
                <div className="form-grid">
                  <Field id="book-name" label="Full name" error={errors.name}><input {...bind("name")} placeholder="Jordan Lee" /></Field>
                  <Field id="book-phone" label="Phone" error={errors.phone}><input type="tel" {...bind("phone")} placeholder="+1 555 000 0000" /></Field>
                  <Field id="book-email" label="Email" error={errors.email} full><input type="email" {...bind("email")} placeholder="you@email.com" /></Field>
                  <Field id="book-program" label="Program" error={errors.program}>
                    <select {...bind("program")}><option value="">Choose a program</option>{programs.map(p => <option key={p.title}>{p.title}</option>)}</select>
                  </Field>
                  <Field id="book-specialist" label="Specialist">
                    <select {...bind("specialist")}><option value="">No preference</option>{doctors.map(d => <option key={d.name}>{d.name}</option>)}</select>
                  </Field>
                  <Field id="book-date" label="Preferred date" error={errors.date}><input type="date" min={today()} {...bind("date")} /></Field>
                  <Field id="book-time" label="Preferred time" error={errors.time}>
                    <select {...bind("time")}><option value="">Choose a time</option>{TIMES.map(t => <option key={t}>{t}</option>)}</select>
                  </Field>
                  <Field id="book-notes" label="Anything we should know? (optional)" full><textarea {...bind("notes")} placeholder="Symptoms, questions, accessibility needs…" /></Field>
                  <div className="full"><Button type="submit" variant="purple">Request appointment</Button></div>
                </div>
              )}
            </form>

            <div className="form-success">
              <span className="icon-circle">✓</span>
              <h3>Thanks, {sentName}!</h3>
              <p className="muted" style={{ marginBottom: 26 }}>
                {tab === "book"
                  ? "Your appointment request is in. We'll call you within one working day to confirm the time."
                  : "We've received your message. A member of the care desk will reply within one working day."}
              </p>
              <button className="btn btn--plain" onClick={() => setSentName(null)}>Send another</button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="map">
            <iframe title="Clinic location map" loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-97.76%2C30.25%2C-97.72%2C30.28&layer=mapnik" />
          </Reveal>
        </div>
      </section>
    </>
  );
}

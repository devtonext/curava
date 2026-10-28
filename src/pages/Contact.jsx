import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Lines from "../components/Lines";
import Reveal from "../components/Reveal";
import { useToast } from "../components/Toast";
import { api } from "../lib/api";
import { usePageTitle, useSite } from "../lib/site";
import { isEmail, isPhone } from "../utils";

const today = () => new Date().toISOString().split("T")[0];

const FORMS = {
  message: {
    table: "messages",
    initial: { name: "", email: "", topic: "", message: "" },
    validate: v => ({
      name: !v.name.trim() && "Please enter your name.",
      email: !isEmail(v.email) && "Enter a valid email.",
      topic: !v.topic && "Please choose a topic.",
      message: !v.message.trim() && "Please add a short message.",
    }),
  },
  book: {
    table: "appointments",
    initial: { name: "", phone: "", email: "", program: "", specialist: "", preferred_date: "", preferred_time: "", notes: "" },
    validate: v => ({
      name: !v.name.trim() && "Please enter your name.",
      phone: !isPhone(v.phone) && "Enter a valid phone number.",
      email: !isEmail(v.email) && "Enter a valid email.",
      program: !v.program && "Please choose a program.",
      preferred_date: (!v.preferred_date || v.preferred_date < today()) && "Please pick a date from today onwards.",
      preferred_time: !v.preferred_time && "Please choose a time.",
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

const ContactIcon = ({ d }) => (
  <span className="icon-circle">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
  </span>
);
const ICONS = {
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm18 2-10 7L2 6",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
};

export default function Contact() {
  usePageTitle("Contact");
  const { content, collections } = useSite();
  const p = content.contact_page, c = content.contact;
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "book" ? "book" : "message";
  const notify = useToast();

  const [values, setValues] = useState(FORMS[tab].initial);
  const [errors, setErrors] = useState({});
  const [sentName, setSentName] = useState(null);
  const [busy, setBusy] = useState(false);

  // Reset the form when switching tabs; prefill from ?doctor= or ?plan= links.
  useEffect(() => {
    const prefill = {};
    if (tab === "book" && params.get("doctor")) prefill.specialist = params.get("doctor");
    if (tab === "book" && params.get("plan")) prefill.notes = `Interested in the ${params.get("plan")} membership.`;
    setValues({ ...FORMS[tab].initial, ...prefill });
    setErrors({});
    setSentName(null);
  }, [tab, params.get("doctor"), params.get("plan")]);

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

  const submit = async e => {
    e.preventDefault();
    const errs = FORMS[tab].validate(values);
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return notify("Please check the highlighted fields.");

    setBusy(true);
    try {
      const row = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, typeof v === "string" ? v.trim() : v]));
      if (!row.preferred_date) delete row.preferred_date;
      await api.submit(FORMS[tab].table, row);
      setSentName(values.name.trim().split(" ")[0] || "there");
      setValues(FORMS[tab].initial);
    } catch (err) {
      notify(`Couldn't send: ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="page-hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> / <span>Contact</span></div>
          <Reveal as="h1"><Lines text={p.title} /></Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container grid-2" style={{ alignItems: "start" }}>
          <Reveal>
            <p className="lead">{p.intro}</p>
            <div className="info-list">
              <a href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} className="info-item"><ContactIcon d={ICONS.phone} /><div><small>Care desk</small><strong>{c.phone}</strong></div></a>
              <a href={`mailto:${c.email}`} className="info-item"><ContactIcon d={ICONS.mail} /><div><small>Email</small><strong>{c.email}</strong></div></a>
              <div className="info-item"><ContactIcon d={ICONS.pin} /><div><small>Flagship clinic</small><strong>{c.address}</strong></div></div>
              <div className="info-item"><ContactIcon d={ICONS.clock} /><div><small>Hours</small><strong>{c.hours}</strong></div></div>
            </div>
          </Reveal>

          <Reveal className={`form-card${sentName ? " sent" : ""}`} id="book">
            {!sentName && (
              <div className="tabs" role="tablist">
                <button role="tab" aria-selected={tab === "message"} className={`tab-btn${tab === "message" ? " active" : ""}`} onClick={() => switchTab("message")}>Send a message</button>
                <button role="tab" aria-selected={tab === "book"} className={`tab-btn${tab === "book" ? " active" : ""}`} onClick={() => switchTab("book")}>Book a visit</button>
              </div>
            )}

            <form onSubmit={submit} noValidate key={tab} className="tab-panel active">
              {tab === "message" ? (
                <div className="form-grid">
                  <Field id="message-name" label="Full name" error={errors.name}><input {...bind("name")} placeholder="Jordan Lee" autoComplete="name" /></Field>
                  <Field id="message-email" label="Email" error={errors.email}><input type="email" {...bind("email")} placeholder="you@email.com" autoComplete="email" /></Field>
                  <Field id="message-topic" label="Topic" error={errors.topic} full>
                    <select {...bind("topic")}><option value="">Choose a topic</option>{(p.topics || []).map(t => <option key={t}>{t}</option>)}</select>
                  </Field>
                  <Field id="message-message" label="Message" error={errors.message} full><textarea {...bind("message")} placeholder="How can we help?" maxLength={5000} /></Field>
                  <div className="full"><Button type="submit" variant="purple" disabled={busy}>{busy ? "Sending…" : "Send message"}</Button></div>
                </div>
              ) : (
                <div className="form-grid">
                  <Field id="book-name" label="Full name" error={errors.name}><input {...bind("name")} placeholder="Jordan Lee" autoComplete="name" /></Field>
                  <Field id="book-phone" label="Phone" error={errors.phone}><input type="tel" {...bind("phone")} placeholder="+1 555 000 0000" autoComplete="tel" /></Field>
                  <Field id="book-email" label="Email" error={errors.email} full><input type="email" {...bind("email")} placeholder="you@email.com" autoComplete="email" /></Field>
                  <Field id="book-program" label="Program" error={errors.program}>
                    <select {...bind("program")}><option value="">Choose a program</option>{collections.programs.map(pr => <option key={pr.id}>{pr.title}</option>)}</select>
                  </Field>
                  <Field id="book-specialist" label="Specialist">
                    <select {...bind("specialist")}><option value="">No preference</option>{collections.doctors.map(d => <option key={d.id}>{d.name}</option>)}</select>
                  </Field>
                  <Field id="book-preferred_date" label="Preferred date" error={errors.preferred_date}><input type="date" min={today()} {...bind("preferred_date")} /></Field>
                  <Field id="book-preferred_time" label="Preferred time" error={errors.preferred_time}>
                    <select {...bind("preferred_time")}><option value="">Choose a time</option>{(p.time_slots || []).map(t => <option key={t}>{t}</option>)}</select>
                  </Field>
                  <Field id="book-notes" label="Anything we should know? (optional)" full><textarea {...bind("notes")} placeholder="Symptoms, questions, accessibility needs…" maxLength={3000} /></Field>
                  <div className="full"><Button type="submit" variant="purple" disabled={busy}>{busy ? "Sending…" : "Request appointment"}</Button></div>
                </div>
              )}
            </form>

            <div className="form-success">
              <span className="icon-circle">✓</span>
              <h3>Thanks, {sentName}!</h3>
              <p className="muted" style={{ marginBottom: 26 }}>{tab === "book" ? p.booking_success : p.message_success}</p>
              <button className="btn btn--plain" onClick={() => setSentName(null)}>Send another</button>
            </div>
          </Reveal>
        </div>
      </section>

      {c.map_embed_url && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <Reveal className="map"><iframe title="Clinic location map" loading="lazy" src={c.map_embed_url} /></Reveal>
          </div>
        </section>
      )}
    </>
  );
}

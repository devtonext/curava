import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, isSupabase } from "../../lib/api";
import { useSite } from "../../lib/site";
import { useAuth } from "../AdminApp";
import { PAGES } from "../schema";

export const fmtDate = v => (v ? new Date(v).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "");

export default function Overview() {
  const { session } = useAuth();
  const { collections } = useSite();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all(["appointments", "messages", "subscribers"].map(t => api.list(t, { admin: true })))
      .then(([appointments, messages, subscribers]) => setData({ appointments, messages, subscribers }))
      .catch(e => setError(e.message));
  }, []);

  const name = (session.user?.email || "").split("@")[0];
  const cards = data && [
    { label: "Pending appointments", value: data.appointments.filter(a => a.status === "pending").length, to: "/admin/inbox/appointments", tone: "primary" },
    { label: "New messages", value: data.messages.filter(m => m.status === "new").length, to: "/admin/inbox/messages", tone: "accent" },
    { label: "Subscribers", value: data.subscribers.length, to: "/admin/inbox/subscribers" },
    { label: "Published articles", value: collections.articles.length, to: "/admin/collections/articles" },
  ];

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Welcome back{name && `, ${name}`} 👋</h1>
          <p className="adm-muted">Here's what's happening on your website.</p>
        </div>
        <a className="adm-btn adm-btn--primary" href="/" target="_blank" rel="noreferrer">Open website ↗</a>
      </div>

      {!isSupabase && (
        <div className="adm-note adm-note--row">
          <div><strong>You're in demo mode.</strong> Edits are stored in this browser only. Connect Supabase to go live — it takes about 5 minutes.</div>
          <Link to="/admin/setup" className="adm-btn">Setup guide</Link>
        </div>
      )}
      {error && <p className="adm-error">{error}</p>}

      <div className="adm-stats">
        {(cards || Array(4).fill(null)).map((c, i) => c ? (
          <Link key={c.label} to={c.to} className={`adm-stat${c.tone ? ` adm-stat--${c.tone}` : ""}`}>
            <span>{c.label}</span><strong>{c.value}</strong>
          </Link>
        ) : <div key={i} className="adm-stat adm-skeleton" />)}
      </div>

      <div className="adm-grid-2">
        <section className="adm-card">
          <div className="adm-card-head"><h2>Latest appointment requests</h2><Link to="/admin/inbox/appointments">View all</Link></div>
          {data && !data.appointments.length && <p className="adm-muted">No requests yet.</p>}
          <ul className="adm-feed">
            {data?.appointments.slice(0, 5).map(a => (
              <li key={a.id}>
                <div><strong>{a.name}</strong><span>{a.program}{a.preferred_date && ` · ${a.preferred_date}`}</span></div>
                <span className={`adm-badge adm-badge--${a.status}`}>{a.status}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="adm-card">
          <div className="adm-card-head"><h2>Latest messages</h2><Link to="/admin/inbox/messages">View all</Link></div>
          {data && !data.messages.length && <p className="adm-muted">No messages yet.</p>}
          <ul className="adm-feed">
            {data?.messages.slice(0, 5).map(m => (
              <li key={m.id}>
                <div><strong>{m.name}</strong><span>{m.topic} · {fmtDate(m.created_at)}</span></div>
                <span className={`adm-badge adm-badge--${m.status}`}>{m.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="adm-card">
        <div className="adm-card-head"><h2>Edit your pages</h2></div>
        <div className="adm-quick">
          {PAGES.map(p => (
            <Link key={p.id} to={`/admin/pages/${p.id}`} className="adm-quick-item">
              <strong>{p.label}</strong>
              <span>{p.sections.length} section{p.sections.length > 1 ? "s" : ""}{p.collections ? ` · ${p.collections.length} lists` : ""}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

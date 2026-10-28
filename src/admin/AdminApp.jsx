import { createContext, useContext, useEffect, useState } from "react";
import { Link, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { api, isSupabase, DEMO_ADMIN } from "../lib/api";
import { useSite } from "../lib/site";
import { COLLECTIONS, PAGES } from "./schema";
import Overview from "./pages/Overview";
import PageEditor from "./pages/PageEditor";
import CollectionManager from "./pages/CollectionManager";
import Inbox from "./pages/Inbox";
import Media from "./pages/Media";
import Setup from "./pages/Setup";
import "./admin.css";

/* ---------------- Auth ---------------- */
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [state, setState] = useState({ session: null, admin: false, loading: true });

  useEffect(() => {
    let alive = true;
    const resolve = async session => {
      const admin = await api.isAdmin(session).catch(() => false);
      if (alive) setState({ session, admin, loading: false });
    };
    api.getSession().then(resolve);
    const off = api.onAuthChange(s => resolve(s));
    return () => { alive = false; off(); };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

function RequireAdmin() {
  const { session, admin, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="adm-center"><span className="adm-spinner" /></div>;
  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  if (!admin) return <NotAdmin email={session.user?.email} />;
  return <AdminLayout />;
}

function NotAdmin({ email }) {
  return (
    <div className="adm-auth">
      <div className="adm-auth-card">
        <h1>No admin access</h1>
        <p className="adm-muted">{email} is signed in but isn't listed in <code>admin_users</code>. Ask an existing admin to add you, or see the setup guide (README → "Add more admins").</p>
        <button className="adm-btn adm-btn--primary adm-btn--block" onClick={() => api.signOut()}>Sign out</button>
      </div>
    </div>
  );
}

/* ---------------- Login ---------------- */
function Login() {
  const { session, admin } = useAuth();
  const { content } = useSite();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState(isSupabase ? "" : DEMO_ADMIN.email);
  const [password, setPassword] = useState(isSupabase ? "" : DEMO_ADMIN.password);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isSupabase) api.adminExists().then(exists => !exists && setMode("setup"));
  }, []);

  if (session && admin) return <Navigate to={location.state?.from || "/admin"} replace />;

  const submit = async e => {
    e.preventDefault();
    setError(""); setInfo(""); setBusy(true);
    try {
      if (mode === "setup") {
        if (password.length < 8) throw new Error("Use at least 8 characters for the password.");
        const s = await api.signUp(email.trim(), password);
        if (!s) setInfo("Account created. Check your inbox to confirm your email, then sign in here.");
        setMode("signin");
      } else {
        await api.signIn(email.trim(), password);
        navigate(location.state?.from || "/admin", { replace: true });
      }
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <div className="adm-auth">
      <form className="adm-auth-card" onSubmit={submit}>
        <Link to="/" className="adm-brand"><span className="adm-logo" />{content?.general.brand_name || "Admin"}</Link>
        <h1>{mode === "setup" ? "Create the admin account" : "Sign in to the dashboard"}</h1>
        <p className="adm-muted">
          {mode === "setup"
            ? "No admin exists yet. The first account created here becomes the site owner."
            : "Manage pages, specialists, articles, bookings and more."}
        </p>
        {!isSupabase && (
          <div className="adm-note">
            <strong>Demo mode.</strong> Changes are saved in this browser only. Sign in with <code>{DEMO_ADMIN.email}</code> / <code>{DEMO_ADMIN.password}</code>.
          </div>
        )}
        <label className="adm-field"><span>Email</span><input className="adm-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></label>
        <label className="adm-field"><span>Password</span><input className="adm-input" type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === "setup" ? "new-password" : "current-password"} /></label>
        {error && <p className="adm-error">{error}</p>}
        {info && <p className="adm-success">{info}</p>}
        <button className="adm-btn adm-btn--primary adm-btn--block" disabled={busy}>{busy ? "Please wait…" : mode === "setup" ? "Create account" : "Sign in"}</button>
        <Link to="/" className="adm-back">← Back to website</Link>
      </form>
    </div>
  );
}

/* ---------------- Layout ---------------- */
const I = {
  home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z",
  page: "M6 2h9l5 5v15H6zM14 2v6h6",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13L22 12v7H2v-7z",
  image: "M3 3h18v18H3zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M21 15l-5-5L5 21",
  cog: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  bolt: "M13 2 3 14h9l-1 8 10-12h-9z",
};
export const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

function AdminLayout() {
  const { session } = useAuth();
  const { content } = useSite();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  const nav = [
    { title: null, items: [{ to: "/admin", label: "Overview", icon: I.home, end: true }] },
    { title: "Pages", items: PAGES.map(p => ({ to: `/admin/pages/${p.id}`, label: p.label, icon: p.id === "site" ? I.cog : I.page })) },
    { title: "Collections", items: Object.entries(COLLECTIONS).map(([t, c]) => ({ to: `/admin/collections/${t}`, label: c.label, icon: I.list })) },
    { title: "Inbox", items: [
      { to: "/admin/inbox/appointments", label: "Appointments", icon: I.inbox },
      { to: "/admin/inbox/messages", label: "Messages", icon: I.inbox },
      { to: "/admin/inbox/subscribers", label: "Subscribers", icon: I.inbox },
    ] },
    { title: "System", items: [
      { to: "/admin/media", label: "Media library", icon: I.image },
      { to: "/admin/setup", label: "Setup & database", icon: I.bolt },
    ] },
  ];

  return (
    <div className={`adm${open ? " adm--nav-open" : ""}`}>
      <aside className="adm-side">
        <Link to="/admin" className="adm-brand"><span className="adm-logo" />{content.general.brand_name}<em>Admin</em></Link>
        <nav>
          {nav.map((g, i) => (
            <div key={i} className="adm-nav-group">
              {g.title && <p>{g.title}</p>}
              {g.items.map(it => (
                <NavLink key={it.to} to={it.to} end={it.end}><Icon d={it.icon} />{it.label}</NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className={`adm-mode ${isSupabase ? "is-live" : ""}`}>
          <span />{isSupabase ? "Connected to Supabase" : "Demo mode (local)"}
        </div>
      </aside>
      <div className="adm-backdrop" onClick={() => setOpen(false)} />
      <div className="adm-main">
        <header className="adm-top">
          <button className="adm-burger" onClick={() => setOpen(o => !o)} aria-label="Toggle navigation">☰</button>
          <div className="adm-top-right">
            <a className="adm-btn" href="/" target="_blank" rel="noreferrer">View site ↗</a>
            <span className="adm-user" title={session.user?.email}>{(session.user?.email || "?")[0].toUpperCase()}</span>
            <button className="adm-btn adm-btn--ghost" onClick={() => api.signOut()}>Sign out</button>
          </div>
        </header>
        <div className="adm-content"><Outlet /></div>
      </div>
    </div>
  );
}

export default function AdminApp() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Dashboard";
    return () => { document.title = prev; };
  }, []);
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<RequireAdmin />}>
          <Route index element={<Overview />} />
          <Route path="pages/:pageId" element={<PageEditor />} />
          <Route path="collections/:table" element={<CollectionManager />} />
          <Route path="inbox/:table" element={<Inbox />} />
          <Route path="media" element={<Media />} />
          <Route path="setup" element={<Setup />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

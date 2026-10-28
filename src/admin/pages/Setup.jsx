import { useState } from "react";
import { useToast } from "../../components/Toast";
import { api, isSupabase } from "../../lib/api";
import { useSite } from "../../lib/site";

const ENV = `VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_SUPABASE_BUCKET=media`;

export default function Setup() {
  const notify = useToast();
  const { reload } = useSite();
  const [copied, setCopied] = useState(false);

  const copyEnv = async () => {
    try { await navigator.clipboard.writeText(ENV); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  };
  const reset = async () => {
    if (!confirm("Reset all demo content and submissions in this browser?")) return;
    await api.resetDemo();
    await reload();
    notify("Demo data restored");
  };

  const steps = [
    ["Create a Supabase project", <>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">supabase.com/dashboard</a> → <b>New project</b>. Pick a name, password and region.</>],
    ["Run the setup SQL", <>Open <b>SQL Editor</b> → <b>New query</b>, paste the whole of <code>supabase/setup.sql</code> and click <b>Run</b>. This creates every table, security rule, the image bucket and the demo content.</>],
    ["Add your keys", <>In <b>Project Settings → API</b> copy the <b>Project URL</b> and the <b>anon public</b> key. Copy <code>.env.example</code> to <code>.env</code> and paste them in. On Vercel, add the same variables under <b>Settings → Environment Variables</b> and redeploy.</>],
    ["Create your admin account", <>Restart <code>npm run dev</code> (or redeploy) and open <code>/admin/login</code>. The first account you create becomes the admin. If email confirmation is on, confirm your email first.</>],
    ["Lock down sign-ups (recommended)", <>In <b>Authentication → Sign In / Providers</b>, turn off <b>Allow new users to sign up</b>. Add teammates as admins with the SQL in the README.</>],
  ];

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Setup & database</h1>
          <p className="adm-muted">Connect your own Supabase project to store content, bookings and images for real.</p>
        </div>
      </div>

      <section className={`adm-status-card ${isSupabase ? "is-live" : ""}`}>
        <span className="adm-dot" />
        <div>
          <strong>{isSupabase ? "Connected to Supabase" : "Running in demo mode"}</strong>
          <p>{isSupabase
            ? "Content, submissions and media are stored in your Supabase project."
            : "No Supabase keys found in the environment. All edits are saved in this browser only — perfect for trying things out."}</p>
        </div>
        {!isSupabase && <button className="adm-btn" onClick={reset}>Reset demo data</button>}
      </section>

      <section className="adm-card">
        <div className="adm-card-head"><h2>Go live in 5 steps</h2></div>
        <ol className="adm-steps">
          {steps.map(([t, d], i) => <li key={t}><span>{i + 1}</span><div><strong>{t}</strong><p>{d}</p></div></li>)}
        </ol>
      </section>

      <section className="adm-card">
        <div className="adm-card-head"><h2>.env</h2><button className="adm-btn adm-btn--sm" onClick={copyEnv}>{copied ? "Copied ✓" : "Copy"}</button></div>
        <pre className="adm-code">{ENV}</pre>
        <p className="adm-muted">Only the <b>anon</b> key goes in the frontend. Never put the <code>service_role</code> key in this file.</p>
      </section>

      <section className="adm-card">
        <div className="adm-card-head"><h2>Database tables</h2></div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Table</th><th>Used for</th><th>Who can read</th><th>Who can write</th></tr></thead>
            <tbody>
              <tr><td><code>site_content</code></td><td>Every page section (text, images, colours, SEO)</td><td>Everyone</td><td>Admins</td></tr>
              <tr><td><code>doctors, articles, reviews, features, stats, programs, plans, steps, faqs, company_values, milestones, partners</code></td><td>Lists managed under Collections</td><td>Everyone (published rows)</td><td>Admins</td></tr>
              <tr><td><code>appointments, messages, subscribers</code></td><td>Website form submissions</td><td>Admins</td><td>Visitors can insert</td></tr>
              <tr><td><code>admin_users</code></td><td>Who can access this dashboard</td><td>Admins</td><td>Admins</td></tr>
              <tr><td><code>storage: media</code></td><td>Uploaded images</td><td>Everyone</td><td>Admins</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

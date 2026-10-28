import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../../components/Modal";
import { useToast } from "../../components/Toast";
import { api } from "../../lib/api";
import { INBOX } from "../schema";
import { fmtDate } from "./Overview";

function toCsv(rows, cols) {
  const esc = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = [...cols.map(c => c[1]), "Status", "Received"];
  const body = rows.map(r => [...cols.map(c => r[c[0]]), r.status ?? "", r.created_at].map(esc).join(","));
  return [head.map(esc).join(","), ...body].join("\n");
}

export default function Inbox() {
  const { table } = useParams();
  const cfg = INBOX[table];
  const notify = useToast();
  const [rows, setRows] = useState(null);
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(null);

  const load = () => api.list(table, { admin: true }).then(setRows).catch(e => { notify(e.message); setRows([]); });
  useEffect(() => { setRows(null); setStatus("all"); setQuery(""); load(); }, [table]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows || [])
      .filter(r => status === "all" || r.status === status)
      .filter(r => !q || cfg.columns.some(([k]) => String(r[k] ?? "").toLowerCase().includes(q)));
  }, [rows, status, query, cfg]);

  if (!cfg) return <p>Unknown inbox.</p>;

  const setRowStatus = async (row, s) => {
    try { await api.update(table, row.id, { status: s }); setRows(rs => rs.map(r => (r.id === row.id ? { ...r, status: s } : r))); }
    catch (e) { notify(e.message); }
  };
  const remove = async row => {
    if (!confirm("Delete this entry permanently?")) return;
    try { await api.remove(table, row.id); setRows(rs => rs.filter(r => r.id !== row.id)); setOpen(null); notify("Deleted"); }
    catch (e) { notify(e.message); }
  };
  const view = row => {
    setOpen(row);
    if (table === "messages" && row.status === "new") setRowStatus(row, "read");
  };
  const exportCsv = () => {
    const blob = new Blob([toCsv(filtered, cfg.columns)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${table}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const shown = cfg.columns.slice(0, table === "appointments" ? 6 : 4);

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>{cfg.label}</h1>
          <p className="adm-muted">Submitted from the website. {rows ? `${rows.length} total.` : ""}</p>
        </div>
        <button className="adm-btn" onClick={exportCsv} disabled={!filtered.length}>Export CSV</button>
      </div>

      <section className="adm-card adm-card--flush">
        <div className="adm-toolbar">
          <input className="adm-input adm-search" type="search" placeholder="Search…" value={query} onChange={e => setQuery(e.target.value)} />
          {cfg.statuses && (
            <div className="adm-seg">
              {["all", ...cfg.statuses].map(s => (
                <button key={s} className={status === s ? "active" : ""} onClick={() => setStatus(s)}>
                  {s}{s !== "all" && rows ? ` (${rows.filter(r => r.status === s).length})` : ""}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr>{shown.map(([, l]) => <th key={l}>{l}</th>)}{cfg.statuses && <th>Status</th>}<th>Received</th><th /></tr></thead>
            <tbody>
              {rows === null && <tr><td colSpan={9}><div className="adm-skeleton" style={{ height: 40 }} /></td></tr>}
              {filtered.map(r => (
                <tr key={r.id} className={r.status === "new" ? "is-new" : ""}>
                  {shown.map(([k]) => <td key={k} onClick={() => view(r)} className="adm-clip">{r[k]}</td>)}
                  {cfg.statuses && (
                    <td>
                      <select className={`adm-status adm-badge--${r.status}`} value={r.status} onChange={e => setRowStatus(r, e.target.value)}>
                        {cfg.statuses.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  )}
                  <td className="adm-nowrap">{fmtDate(r.created_at)}</td>
                  <td className="adm-nowrap">
                    <button className="adm-btn adm-btn--sm" onClick={() => view(r)}>Open</button>
                    <button className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => remove(r)}>Delete</button>
                  </td>
                </tr>
              ))}
              {rows && !filtered.length && <tr><td colSpan={9} className="adm-empty">Nothing to show.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} className="adm-modal" label="Details">
        {open && (
          <>
            <div className="adm-modal-head"><h3>{open.name || open.email}</h3></div>
            <dl className="adm-detail">
              {cfg.columns.map(([k, l]) => open[k] ? <div key={k}><dt>{l}</dt><dd>{k === "email" ? <a href={`mailto:${open.email}`}>{open.email}</a> : k === "phone" ? <a href={`tel:${open.phone}`}>{open.phone}</a> : open[k]}</dd></div> : null)}
              <div><dt>Received</dt><dd>{fmtDate(open.created_at)}</dd></div>
            </dl>
            <div className="adm-card-foot">
              <button className="adm-btn adm-btn--danger" onClick={() => remove(open)}>Delete</button>
              {open.email && <a className="adm-btn adm-btn--primary" href={`mailto:${open.email}`}>Reply by email</a>}
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../../components/Modal";
import { useToast } from "../../components/Toast";
import { api } from "../../lib/api";
import { useSite } from "../../lib/site";
import { FieldInput } from "../fields";
import { COLLECTIONS, emptyRow } from "../schema";

export default function CollectionManager() {
  const { table } = useParams();
  const cfg = COLLECTIONS[table];
  const { reload } = useSite();
  const notify = useToast();
  const [rows, setRows] = useState(null);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null); // row being edited (no id = new)
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try { setRows(await api.list(table, { admin: true })); setError(""); }
    catch (e) { setError(e.message); setRows([]); }
  };
  useEffect(() => { setRows(null); setQuery(""); load(); }, [table]);

  // Keep the public site in sync after every change.
  const done = async msg => { await load(); await reload(); if (msg) notify(msg); };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return !q ? rows || [] : (rows || []).filter(r => cfg.fields.some(f => String(r[f.name] ?? "").toLowerCase().includes(q)));
  }, [rows, query, cfg]);

  if (!cfg) return <p>Unknown collection.</p>;

  const save = async () => {
    const missing = cfg.fields.filter(f => f.required && (editing[f.name] === "" || editing[f.name] == null));
    if (missing.length) return notify(`Please fill in: ${missing.map(f => f.label).join(", ")}`);
    setSaving(true);
    try {
      if (editing.id) await api.update(table, editing.id, editing);
      else await api.insert(table, editing);
      setEditing(null);
      await done(`${cfg.singular[0].toUpperCase() + cfg.singular.slice(1)} saved`);
    } catch (e) { notify(`Save failed: ${e.message}`); } finally { setSaving(false); }
  };

  const remove = async row => {
    if (!confirm(`Delete “${row[cfg.titleField]}”? This can't be undone.`)) return;
    try { await api.remove(table, row.id); await done("Deleted"); } catch (e) { notify(e.message); }
  };

  const togglePublished = async row => {
    try { await api.update(table, row.id, { published: !row.published }); await done(row.published ? "Hidden from website" : "Published"); }
    catch (e) { notify(e.message); }
  };

  const duplicate = row => {
    const { id, created_at, updated_at, sort_order, ...rest } = row;
    setEditing({ ...rest, [cfg.titleField]: `${row[cfg.titleField]} (copy)`, ...(rest.slug ? { slug: `${rest.slug}-copy` } : {}), published: false });
  };

  const move = async (index, dir) => {
    const list = [...rows];
    const j = index + dir;
    if (j < 0 || j >= list.length) return;
    [list[index], list[j]] = [list[j], list[index]];
    setRows(list);
    try {
      await Promise.all(list.map((r, i) => (r.sort_order !== i + 1 ? api.update(table, r.id, { sort_order: i + 1 }) : null)));
      await done();
    } catch (e) { notify(e.message); load(); }
  };

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>{cfg.label}</h1>
          <p className="adm-muted">{cfg.description}</p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => setEditing({ ...emptyRow(cfg.fields), published: true })}>+ Add {cfg.singular}</button>
      </div>

      <section className="adm-card adm-card--flush">
        <div className="adm-toolbar">
          <input className="adm-input adm-search" type="search" placeholder={`Search ${cfg.label.toLowerCase()}…`} value={query} onChange={e => setQuery(e.target.value)} />
          <span className="adm-muted">{rows ? `${rows.length} item${rows.length === 1 ? "" : "s"}` : ""}</span>
        </div>
        {error && <p className="adm-error" style={{ margin: 20 }}>{error}</p>}
        {rows === null ? <div className="adm-list-skeleton">{Array(4).fill(0).map((_, i) => <div key={i} className="adm-skeleton" />)}</div> : (
          <ul className="adm-list">
            {filtered.map(r => {
              const i = rows.indexOf(r);
              return (
                <li key={r.id} className={r.published === false ? "is-hidden" : ""}>
                  {!query && (
                    <div className="adm-order">
                      <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">▲</button>
                      <button onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label="Move down">▼</button>
                    </div>
                  )}
                  {cfg.imageField && <div className="adm-thumb">{r[cfg.imageField] ? <img src={r[cfg.imageField]} alt="" /> : <span>{String(r[cfg.titleField] || "?")[0]}</span>}</div>}
                  <button className="adm-list-main" onClick={() => setEditing({ ...r })}>
                    <strong>{r[cfg.titleField] || "Untitled"}</strong>
                    {cfg.subtitleField && <span>{Array.isArray(r[cfg.subtitleField]) ? r[cfg.subtitleField].join(", ") : r[cfg.subtitleField]}</span>}
                  </button>
                  <div className="adm-list-flags">
                    {(r.featured || r.highlighted) && <span className="adm-badge adm-badge--confirmed">Featured</span>}
                    <button className={`adm-badge ${r.published === false ? "adm-badge--archived" : "adm-badge--live"}`} onClick={() => togglePublished(r)} title="Toggle visibility">
                      {r.published === false ? "Hidden" : "Live"}
                    </button>
                  </div>
                  <div className="adm-list-actions">
                    <button className="adm-btn adm-btn--sm" onClick={() => setEditing({ ...r })}>Edit</button>
                    <button className="adm-btn adm-btn--sm adm-btn--ghost" onClick={() => duplicate(r)}>Duplicate</button>
                    <button className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => remove(r)}>Delete</button>
                  </div>
                </li>
              );
            })}
            {!filtered.length && <li className="adm-empty">Nothing here yet.</li>}
          </ul>
        )}
      </section>

      <Modal open={Boolean(editing)} onClose={() => !saving && setEditing(null)} className="adm-modal adm-modal--wide" label={`Edit ${cfg.singular}`}>
        {editing && (
          <>
            <div className="adm-modal-head"><h3>{editing.id ? `Edit ${cfg.singular}` : `New ${cfg.singular}`}</h3></div>
            <div className="adm-form-grid">
              {cfg.fields.map(f => (
                <FieldInput key={f.name} field={f} value={editing[f.name]} row={editing} onChange={v => setEditing(e => ({ ...e, [f.name]: v }))} />
              ))}
              <FieldInput field={{ name: "published", label: "Visible on website", type: "boolean" }} value={editing.published !== false} onChange={v => setEditing(e => ({ ...e, published: v }))} />
            </div>
            <div className="adm-card-foot">
              <button className="adm-btn adm-btn--ghost" onClick={() => setEditing(null)} disabled={saving}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

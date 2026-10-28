import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useSite } from "../../lib/site";
import { useToast } from "../../components/Toast";
import { FieldInput } from "../fields";
import { COLLECTIONS, PAGES } from "../schema";

function SectionCard({ section }) {
  const { content, reload } = useSite();
  const notify = useToast();
  const pick = () => Object.fromEntries(section.fields.map(f => [f.name, content[section.key]?.[f.name]]));
  const [draft, setDraft] = useState(pick);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(pick());

  useEffect(() => setDraft(pick()), [section]);

  const save = async () => {
    setSaving(true);
    try {
      // Merge with the latest stored section so cards sharing a key don't overwrite each other.
      await api.saveContent(section.key, { ...content[section.key], ...draft });
      await reload();
      notify(`“${section.title}” saved`);
    } catch (e) { notify(`Save failed: ${e.message}`); } finally { setSaving(false); }
  };

  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <h2>{section.title}</h2>
        {dirty && <span className="adm-badge adm-badge--new">Unsaved</span>}
      </div>
      <div className="adm-form-grid">
        {section.fields.map(f => (
          <FieldInput key={f.name} field={f} value={draft[f.name]} row={draft} onChange={v => setDraft(d => ({ ...d, [f.name]: v }))} />
        ))}
      </div>
      <div className="adm-card-foot">
        <button className="adm-btn adm-btn--ghost" disabled={!dirty || saving} onClick={() => setDraft(pick())}>Discard</button>
        <button className="adm-btn adm-btn--primary" disabled={!dirty || saving} onClick={save}>{saving ? "Saving…" : "Save changes"}</button>
      </div>
    </section>
  );
}

export default function PageEditor() {
  const { pageId } = useParams();
  const page = PAGES.find(p => p.id === pageId);
  if (!page) return <p>Unknown page.</p>;

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>{page.label}</h1>
          <p className="adm-muted">{page.description || `Edit the text and images on the ${page.label} page.`}</p>
        </div>
        {page.path && <a className="adm-btn" href={page.path} target="_blank" rel="noreferrer">Preview page ↗</a>}
      </div>

      {page.collections && (
        <div className="adm-chips">
          <span className="adm-muted">Lists on this page:</span>
          {page.collections.map(t => <Link key={t} to={`/admin/collections/${t}`} className="adm-chip">{COLLECTIONS[t].label} →</Link>)}
        </div>
      )}

      {page.sections.map((s, i) => <SectionCard key={`${pageId}-${i}`} section={s} />)}
    </>
  );
}

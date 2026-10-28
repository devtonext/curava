import { useEffect, useRef, useState } from "react";
import { useToast } from "../../components/Toast";
import { api } from "../../lib/api";

const size = b => (b == null ? "" : b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`);

export default function Media() {
  const notify = useToast();
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const input = useRef();

  const load = () => api.listMedia().then(setItems).catch(e => { notify(e.message); setItems([]); });
  useEffect(() => { load(); }, []);

  const upload = async files => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const f of files) await api.uploadMedia(f);
      notify(`${files.length} file${files.length > 1 ? "s" : ""} uploaded`);
      load();
    } catch (e) { notify(e.message); } finally { setBusy(false); }
  };
  const copy = async url => {
    try { await navigator.clipboard.writeText(url); notify("URL copied"); } catch { prompt("Copy this URL:", url); }
  };
  const remove = async m => {
    if (!confirm(`Delete ${m.name}? Pages still using it will show a broken image.`)) return;
    try { await api.deleteMedia(m.name); load(); } catch (e) { notify(e.message); }
  };

  return (
    <>
      <div className="adm-page-head">
        <div>
          <h1>Media library</h1>
          <p className="adm-muted">Images uploaded here can be picked from any image field.</p>
        </div>
        <button className="adm-btn adm-btn--primary" onClick={() => input.current.click()} disabled={busy}>{busy ? "Uploading…" : "Upload images"}</button>
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={e => upload([...e.target.files])} />
      </div>

      <div className={`adm-drop${drag ? " is-over" : ""}`}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); upload([...e.dataTransfer.files]); }}>
        Drop images here to upload
      </div>

      {items === null ? <p className="adm-muted">Loading…</p> : !items.length ? <p className="adm-muted">No uploads yet.</p> : (
        <div className="adm-media-grid adm-media-grid--page">
          {items.map(m => (
            <figure key={m.name} className="adm-media-card">
              <img src={m.url} alt={m.name} loading="lazy" />
              <figcaption>
                <span title={m.name}>{m.name}</span><small>{size(m.size)}</small>
                <div className="adm-row">
                  <button className="adm-btn adm-btn--sm" onClick={() => copy(m.url)}>Copy URL</button>
                  <button className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => remove(m)}>Delete</button>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import Modal from "../components/Modal";
import { api } from "../lib/api";

export const slugify = s => String(s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

/** Media library inside a modal: upload or pick an existing file. */
export function MediaPicker({ open, onClose, onPick }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef();

  useEffect(() => {
    if (!open) return;
    setError("");
    api.listMedia().then(setItems).catch(e => { setItems([]); setError(e.message); });
  }, [open]);

  const upload = async file => {
    if (!file) return;
    setBusy(true); setError("");
    try {
      const item = await api.uploadMedia(file);
      onPick(item.url);
      onClose();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };

  return (
    <Modal open={open} onClose={onClose} className="adm-modal adm-modal--wide" label="Media library">
      <div className="adm-modal-head">
        <h3>Media library</h3>
        <button className="adm-btn adm-btn--primary" onClick={() => input.current.click()} disabled={busy}>{busy ? "Uploading…" : "Upload new"}</button>
        <input ref={input} type="file" accept="image/*" hidden onChange={e => upload(e.target.files[0])} />
      </div>
      {error && <p className="adm-error">{error}</p>}
      {items === null ? <p className="adm-muted">Loading…</p> : items.length === 0 ? (
        <p className="adm-muted">No uploads yet. Upload an image or paste an image URL into the field instead.</p>
      ) : (
        <div className="adm-media-grid">
          {items.map(m => (
            <button key={m.name} className="adm-media-item" onClick={() => { onPick(m.url); onClose(); }}>
              <img src={m.url} alt={m.name} loading="lazy" />
              <span>{m.name}</span>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}

function ImageInput({ value, onChange, id }) {
  const [picker, setPicker] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const input = useRef();

  const upload = async file => {
    if (!file) return;
    setBusy(true); setErr("");
    try { onChange((await api.uploadMedia(file)).url); } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="adm-image"
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); upload(e.dataTransfer.files[0]); }}>
      <div className="adm-image-preview">
        {value ? <img src={value} alt="" /> : <span>No image</span>}
      </div>
      <div className="adm-image-actions">
        <input id={id} className="adm-input" value={value || ""} onChange={e => onChange(e.target.value)} placeholder="https://… or upload" />
        <div className="adm-row">
          <button type="button" className="adm-btn" onClick={() => input.current.click()} disabled={busy}>{busy ? "Uploading…" : "Upload"}</button>
          <button type="button" className="adm-btn" onClick={() => setPicker(true)}>Library</button>
          {value && <button type="button" className="adm-btn adm-btn--ghost" onClick={() => onChange("")}>Remove</button>}
        </div>
        <small className="adm-muted">Drag & drop an image here, upload, or paste a URL.</small>
        {err && <small className="adm-error">{err}</small>}
        <input ref={input} type="file" accept="image/*" hidden onChange={e => upload(e.target.files[0])} />
      </div>
      <MediaPicker open={picker} onClose={() => setPicker(false)} onPick={onChange} />
    </div>
  );
}

/** Renders one field from a schema definition. `row` is the whole record (for slug-from-title). */
export function FieldInput({ field, value, onChange, row }) {
  const id = `f-${field.name}`;
  const f = field;
  let control;

  switch (f.type) {
    case "textarea":
      control = <textarea id={id} className="adm-input" rows={3} value={value ?? ""} onChange={e => onChange(e.target.value)} />;
      break;
    case "markdown":
      control = <textarea id={id} className="adm-input adm-mono" rows={12} value={value ?? ""} onChange={e => onChange(e.target.value)} />;
      break;
    case "title":
      control = <textarea id={id} className="adm-input" rows={2} value={value ?? ""} onChange={e => onChange(e.target.value)} />;
      break;
    case "list":
      control = (
        <textarea id={id} className="adm-input" rows={Math.max(3, (value || []).length + 1)}
          value={(value || []).join("\n")}
          onChange={e => onChange(e.target.value.split("\n"))}
          onBlur={e => onChange(e.target.value.split("\n").map(s => s.trim()).filter(Boolean))} />
      );
      break;
    case "tags":
      control = (
        <input id={id} className="adm-input" value={Array.isArray(value) ? value.join(", ") : value ?? ""}
          onChange={e => onChange(e.target.value.split(",").map(s => s.trimStart()))}
          onBlur={e => onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))} />
      );
      break;
    case "number":
      control = <input id={id} type="number" step="any" className="adm-input" value={value ?? ""} onChange={e => onChange(e.target.value === "" ? null : Number(e.target.value))} />;
      break;
    case "boolean":
      control = (
        <label className="adm-switch">
          <input id={id} type="checkbox" checked={Boolean(value)} onChange={e => onChange(e.target.checked)} />
          <span /> {value ? "On" : "Off"}
        </label>
      );
      break;
    case "select":
      control = (
        <select id={id} className="adm-input" value={value ?? ""} onChange={e => {
          const opt = f.options.find(o => String(o.value) === e.target.value);
          onChange(opt ? opt.value : e.target.value);
        }}>
          {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
      break;
    case "color":
      control = (
        <div className="adm-color">
          <input type="color" value={value || "#000000"} onChange={e => onChange(e.target.value)} aria-label={f.label} />
          <input id={id} className="adm-input" value={value || ""} onChange={e => onChange(e.target.value)} />
        </div>
      );
      break;
    case "date":
      control = <input id={id} type="date" className="adm-input" value={value ? String(value).slice(0, 10) : ""} onChange={e => onChange(e.target.value || null)} />;
      break;
    case "image":
      control = <ImageInput id={id} value={value} onChange={onChange} />;
      break;
    case "slug":
      control = (
        <div className="adm-color">
          <input id={id} className="adm-input" value={value ?? ""} onChange={e => onChange(slugify(e.target.value))} />
          <button type="button" className="adm-btn" onClick={() => onChange(slugify(row?.[f.from]))}>Generate</button>
        </div>
      );
      break;
    default:
      control = <input id={id} type={f.type === "url" ? "text" : "text"} className="adm-input" value={value ?? ""} onChange={e => onChange(e.target.value)} />;
  }

  return (
    <div className={`adm-field${f.full || ["image", "markdown"].includes(f.type) ? " adm-field--full" : ""}`}>
      <label htmlFor={id}>{f.label}{f.required && <span className="adm-req">*</span>}</label>
      {control}
      {f.help && <small className="adm-muted">{f.help}</small>}
      {f.type === "title" && <small className="adm-muted">Press Enter for a line break in the heading.</small>}
    </div>
  );
}

import { defaultCollections, defaultContent, defaultSubmissions } from "./defaults";

/*
  Single data API used by both the website and the admin dashboard.

  - If VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY are set, everything is read/written in Supabase.
  - Otherwise the template runs in DEMO MODE: data lives in this browser's localStorage,
    seeded from src/lib/defaults.js. Great for previews; nothing is shared between visitors.
*/

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || "media";

export const isSupabase = Boolean(SB_URL && KEY);
// Loaded on demand so demo-mode builds don't download the Supabase SDK.
let clientPromise = null;
export const getSupabase = () => {
  if (!isSupabase) return null;
  clientPromise ??= import("@supabase/supabase-js").then(m => m.createClient(SB_URL, KEY));
  return clientPromise;
};

export const CONTENT_TABLES = Object.keys(defaultCollections);
export const SUBMISSION_TABLES = ["messages", "appointments", "subscribers"];
export const DEMO_ADMIN = { email: "admin@demo.com", password: "demo1234" };

const clone = v => JSON.parse(JSON.stringify(v));
const READONLY = ["id", "created_at", "updated_at"];
const writable = row => Object.fromEntries(Object.entries(row).filter(([k]) => !READONLY.includes(k)));
const bySort = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);
const byNewest = (a, b) => new Date(b.created_at) - new Date(a.created_at);

// Merge saved content over defaults so newly added fields always have a value.
const mergeContent = saved => {
  const out = clone(defaultContent);
  for (const [k, v] of Object.entries(saved || {})) out[k] = { ...(out[k] || {}), ...v };
  return out;
};

/* ------------------------------------------------------------------ */
/* Demo (localStorage) driver                                          */
/* ------------------------------------------------------------------ */
const LS_KEY = "curava_demo_db_v1";
const SESSION_KEY = "curava_demo_session";
let memoryDb = null;

function loadDb() {
  if (memoryDb) return memoryDb;
  try { memoryDb = JSON.parse(localStorage.getItem(LS_KEY)); } catch { memoryDb = null; }
  if (!memoryDb) memoryDb = { content: {}, collections: clone(defaultCollections), submissions: clone(defaultSubmissions), media: [] };
  return memoryDb;
}
function saveDb() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(memoryDb)); }
  catch { throw new Error("Browser storage is full. Use smaller images or reset the demo data."); }
}
const bucketOf = table => (SUBMISSION_TABLES.includes(table) ? loadDb().submissions : loadDb().collections);
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
const authListeners = new Set();
const emitAuth = s => authListeners.forEach(fn => fn(s));

const demo = {
  async getContent() { return mergeContent(loadDb().content); },
  async saveContent(key, data) { loadDb().content[key] = data; saveDb(); },

  async list(table, { admin } = {}) {
    let rows = clone(bucketOf(table)[table] || []);
    if (!admin && !SUBMISSION_TABLES.includes(table)) rows = rows.filter(r => r.published !== false);
    return rows.sort(SUBMISSION_TABLES.includes(table) ? byNewest : bySort);
  },
  async insert(table, row) {
    const b = bucketOf(table);
    b[table] = b[table] || [];
    const rec = { ...writable(row), id: uid(), created_at: new Date().toISOString() };
    if (!SUBMISSION_TABLES.includes(table) && rec.sort_order == null) rec.sort_order = b[table].length + 1;
    b[table].push(rec);
    saveDb();
    return rec;
  },
  async update(table, id, patch) {
    const list = bucketOf(table)[table];
    const i = list.findIndex(r => r.id === id);
    list[i] = { ...list[i], ...writable(patch), updated_at: new Date().toISOString() };
    saveDb();
    return list[i];
  },
  async remove(table, id) {
    const b = bucketOf(table);
    b[table] = b[table].filter(r => r.id !== id);
    saveDb();
  },
  async submit(table, row) {
    if (table === "subscribers" && loadDb().submissions.subscribers.some(s => s.email === row.email)) return;
    await demo.insert(table, { ...row, ...(table === "messages" ? { status: "new" } : table === "appointments" ? { status: "pending" } : {}) });
  },

  async getSession() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch { return null; } },
  async signIn(email, password) {
    if (email.trim().toLowerCase() !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password)
      throw new Error(`Demo mode: sign in with ${DEMO_ADMIN.email} / ${DEMO_ADMIN.password}`);
    const s = { user: { email: DEMO_ADMIN.email } };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    emitAuth(s);
    return s;
  },
  async signUp() { throw new Error("Sign-up is only available when Supabase is connected."); },
  async signOut() { sessionStorage.removeItem(SESSION_KEY); emitAuth(null); },
  onAuthChange(fn) { authListeners.add(fn); return () => authListeners.delete(fn); },
  async isAdmin(session) { return Boolean(session); },
  async adminExists() { return true; },

  async listMedia() { return clone(loadDb().media).sort(byNewest); },
  async uploadMedia(file) {
    if (file.size > 1.5 * 1024 * 1024) throw new Error("Demo mode stores images in your browser — please use files under 1.5 MB.");
    const url = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
    const item = { name: `${Date.now()}-${file.name}`, url, size: file.size, created_at: new Date().toISOString() };
    loadDb().media.push(item);
    saveDb();
    return item;
  },
  async deleteMedia(name) { const db = loadDb(); db.media = db.media.filter(m => m.name !== name); saveDb(); },

  async resetDemo() { memoryDb = null; localStorage.removeItem(LS_KEY); },
};

/* ------------------------------------------------------------------ */
/* Supabase driver                                                     */
/* ------------------------------------------------------------------ */
const check = ({ data, error }) => { if (error) throw new Error(error.message); return data; };

const remote = {
  async getContent() {
    const supabase = await getSupabase();
    const rows = check(await supabase.from("site_content").select("key, data"));
    return mergeContent(Object.fromEntries(rows.map(r => [r.key, r.data])));
  },
  async saveContent(key, data) {
    const supabase = await getSupabase();
    check(await supabase.from("site_content").upsert({ key, data }, { onConflict: "key" }));
  },

  async list(table, { admin } = {}) {
    const supabase = await getSupabase();
    const isSub = SUBMISSION_TABLES.includes(table);
    let q = supabase.from(table).select("*");
    if (!admin && !isSub) q = q.eq("published", true);
    q = isSub ? q.order("created_at", { ascending: false }) : q.order("sort_order", { ascending: true });
    return check(await q);
  },
  async insert(table, row) {
    const supabase = await getSupabase();
    const rec = writable(row);
    if (!SUBMISSION_TABLES.includes(table) && rec.sort_order == null) {
      const last = check(await supabase.from(table).select("sort_order").order("sort_order", { ascending: false }).limit(1));
      rec.sort_order = (last[0]?.sort_order ?? 0) + 1;
    }
    return check(await supabase.from(table).insert(rec).select().single());
  },
  async update(table, id, patch) {
    const supabase = await getSupabase();
    return check(await supabase.from(table).update(writable(patch)).eq("id", id).select().single());
  },
  async remove(table, id) {
    const supabase = await getSupabase();
    check(await supabase.from(table).delete().eq("id", id));
  },
  async submit(table, row) {
    const supabase = await getSupabase();
    // Visitors can insert but not read back, so no .select() here.
    const { error } = await supabase.from(table).insert(row);
    if (error && !(table === "subscribers" && error.code === "23505")) throw new Error(error.message);
  },

  async getSession() {
    const supabase = await getSupabase();
    return (await supabase.auth.getSession()).data.session;
  },
  async signIn(email, password) {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data.session;
  },
  async signUp(email, password) {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw new Error(error.message);
    return data.session;
  },
  async signOut() {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
  },
  onAuthChange(fn) {
    let unsubscribe = () => {}, stopped = false;
    getSupabase().then(supabase => {
      if (stopped) return;
      const { data } = supabase.auth.onAuthStateChange((_e, session) => fn(session));
      unsubscribe = () => data.subscription.unsubscribe();
    });
    return () => { stopped = true; unsubscribe(); };
  },
  async isAdmin(session) {
    const supabase = await getSupabase();
    if (!session) return false;
    const { data } = await supabase.rpc("is_admin");
    return Boolean(data);
  },
  async adminExists() {
    const supabase = await getSupabase();
    const { data, error } = await supabase.rpc("admin_exists");
    return error ? true : Boolean(data);
  },

  async listMedia() {
    const supabase = await getSupabase();
    const files = check(await supabase.storage.from(BUCKET).list("", { limit: 500, sortBy: { column: "created_at", order: "desc" } }));
    return files
      .filter(f => f.id && !f.name.startsWith("."))
      .map(f => ({ name: f.name, size: f.metadata?.size, created_at: f.created_at, url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl }));
  },
  async uploadMedia(file) {
    const supabase = await getSupabase();
    const name = `${Date.now()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")}`;
    check(await supabase.storage.from(BUCKET).upload(name, file, { cacheControl: "31536000", upsert: false }));
    return { name, size: file.size, created_at: new Date().toISOString(), url: supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl };
  },
  async deleteMedia(name) {
    const supabase = await getSupabase();
    check(await supabase.storage.from(BUCKET).remove([name]));
  },

  async resetDemo() {},
};

export const api = isSupabase ? remote : demo;

/** Loads everything the public website needs in one go. */
export async function loadSite() {
  const [content, ...lists] = await Promise.all([api.getContent(), ...CONTENT_TABLES.map(t => api.list(t))]);
  return { content, collections: Object.fromEntries(CONTENT_TABLES.map((t, i) => [t, lists[i]])) };
}

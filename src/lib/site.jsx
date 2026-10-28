import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { loadSite } from "./api";

const SiteContext = createContext(null);
export const useSite = () => useContext(SiteContext);

function setMeta(selector, attr, value) {
  if (!value) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const [, key, name] = selector.match(/\[(\w+)="([^"]+)"\]/);
    el.setAttribute(key, name);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function SiteProvider({ children }) {
  const [state, setState] = useState({ content: null, collections: null, loading: true, error: null });

  const reload = useCallback(async () => {
    try {
      const data = await loadSite();
      setState({ ...data, loading: false, error: null });
    } catch (e) {
      setState(s => ({ ...s, loading: false, error: e.message }));
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  // Theme colours + default SEO tags come from the dashboard.
  useEffect(() => {
    const c = state.content;
    if (!c) return;
    const root = document.documentElement.style;
    if (c.general.primary_color) root.setProperty("--purple", c.general.primary_color);
    if (c.general.accent_color) root.setProperty("--yellow", c.general.accent_color);
    setMeta('meta[name="description"]', "content", c.seo.meta_description);
    setMeta('meta[property="og:title"]', "content", c.seo.meta_title);
    setMeta('meta[property="og:description"]', "content", c.seo.meta_description);
    setMeta('meta[property="og:image"]', "content", c.seo.og_image);
    setMeta('meta[name="theme-color"]', "content", c.general.primary_color);
  }, [state.content]);

  return <SiteContext.Provider value={{ ...state, reload }}>{children}</SiteContext.Provider>;
}

/** Sets the document title for a page, e.g. "Programs — Curava". */
export function usePageTitle(title) {
  const { content } = useSite();
  useEffect(() => {
    if (!content) return;
    document.title = title ? `${title} — ${content.general.brand_name}` : content.seo.meta_title;
  }, [title, content]);
}

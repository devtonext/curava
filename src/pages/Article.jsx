import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Reveal from "../components/Reveal";
import { ArticleCard } from "../components/Sections";
import NotFound from "./NotFound";
import { usePageTitle, useSite } from "../lib/site";

// Minimal formatting: blank line = new paragraph, "## " = heading.
function Body({ text = "" }) {
  return text.split(/\n{2,}|\n(?=## )/).map((block, i) => {
    const b = block.trim();
    if (!b) return null;
    if (b.startsWith("## ")) {
      const [head, ...rest] = b.split("\n");
      return <div key={i}><h2>{head.slice(3)}</h2>{rest.length > 0 && <p>{rest.join(" ")}</p>}</div>;
    }
    return <p key={i}>{b}</p>;
  });
}

export default function Article() {
  const { slug } = useParams();
  const { collections } = useSite();
  const article = collections.articles.find(a => a.slug === slug);
  usePageTitle(article?.title || "Not found");
  const [copied, setCopied] = useState(false);

  if (!article) return <NotFound />;
  const related = collections.articles.filter(a => a.id !== article.id && a.category === article.category).concat(collections.articles.filter(a => a.id !== article.id && a.category !== article.category)).slice(0, 3);
  const date = article.published_at ? new Date(article.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";

  const share = async () => {
    try { await navigator.clipboard.writeText(location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* ignore */ }
  };

  return (
    <>
      <section className="page-hero article-hero">
        <div className="container article-container">
          <div className="breadcrumb"><Link to="/">Home</Link> / <Link to="/insights">Insights</Link> / <span>{article.category}</span></div>
          <Reveal>
            <div className="tags"><span className="tag">{article.category}</span><span className="tag">{article.read_minutes} min read</span></div>
            <h1 className="article-title">{article.title}</h1>
            <p className="lead" style={{ maxWidth: "none" }}>{article.excerpt}</p>
            <div className="article-byline">
              <span>By <strong>{article.author}</strong>{date && ` · ${date}`}</span>
              <button className="btn btn--plain" onClick={share}>{copied ? "Link copied ✓" : "Share article"}</button>
            </div>
          </Reveal>
        </div>
        <div className="container">
          <Reveal className="page-banner article-banner"><img src={article.image_url} alt="" /></Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container article-container article-body"><Body text={article.body} /></div>
      </section>

      {related.length > 0 && (
        <section className="section section--soft">
          <div className="container">
            <div className="section-head"><h2 className="h2">Keep reading.</h2></div>
            <div className="grid-3">{related.map(a => <ArticleCard key={a.id} article={a} />)}</div>
          </div>
        </section>
      )}
      <div style={{ height: 30 }} />
    </>
  );
}

import { useMemo, useState } from "react";
import Button from "../components/Button";
import Filters from "../components/Filters";
import Lines from "../components/Lines";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { ArticleCard } from "../components/Sections";
import { usePageTitle, useSite } from "../lib/site";

export default function Insights() {
  usePageTitle("Insights");
  const { content, collections } = useSite();
  const p = content.insights_page;
  const { articles } = collections;
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const featured = articles.find(a => a.featured) || articles[0];
  const options = useMemo(() => [{ id: "all", label: "All" }, ...[...new Set(articles.map(a => a.category).filter(Boolean))].map(c => ({ id: c, label: c }))], [articles]);
  const q = query.trim().toLowerCase();
  const list = articles
    .filter(a => a !== featured)
    .filter(a => filter === "all" || a.category === filter)
    .filter(a => !q || `${a.title} ${a.excerpt}`.toLowerCase().includes(q));

  return (
    <>
      <PageHero crumb="Insights" title={p.title} style={{ paddingBottom: 50 }}>
        <p className="lead">{p.intro}</p>
      </PageHero>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {featured && (
            <Reveal as="article" className="featured-article">
              <div className="thumb"><img src={featured.image_url} alt="" /></div>
              <div className="body">
                <div className="tags"><span className="tag">{featured.category}</span><span className="tag">Featured</span></div>
                <h2 className="h3" style={{ fontSize: "clamp(28px,3vw,42px)" }}>{featured.title}</h2>
                <p className="muted" style={{ margin: "18px 0 26px" }}>{featured.excerpt}</p>
                <Button to={`/insights/${featured.slug}`}>Read the story</Button>
              </div>
            </Reveal>
          )}

          <div className="list-toolbar">
            <Filters options={options} value={filter} onChange={setFilter} />
            <input className="search-input" type="search" placeholder="Search articles…" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search articles" />
          </div>

          <div className="grid-3 articles" style={{ rowGap: 50 }}>
            {list.map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
          {!list.length && <p className="muted center" style={{ padding: "40px 0" }}>No articles match your search.</p>}
        </div>
      </section>

      <section className="section section--soft">
        <div className="container center">
          <Reveal as="h2" className="h2"><Lines text={p.newsletter_title} /></Reveal>
          <Reveal as="p" className="lead" style={{ margin: "20px auto 34px" }}>{p.newsletter_text}</Reveal>
          <Reveal style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="purple" onClick={() => document.getElementById("newsletter").scrollIntoView({ behavior: "smooth" })}>Subscribe below</Button>
          </Reveal>
        </div>
      </section>
      <div style={{ height: 30 }} />
    </>
  );
}

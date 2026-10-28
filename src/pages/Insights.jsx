import { useState } from "react";
import Button from "../components/Button";
import Filters from "../components/Filters";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { articleFilters, articles, featuredArticle } from "../data";

export default function Insights() {
  const [filter, setFilter] = useState("all");
  const list = filter === "all" ? articles : articles.filter(a => a.cat === filter);

  return (
    <>
      <PageHero crumb="Insights" title={<>Insights &amp;<br />field notes.</>} style={{ paddingBottom: 50 }}>
        <p className="lead">Research explained simply, stories from our patients, and updates from the Curava team.</p>
      </PageHero>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal as="article" className="featured-article">
            <div className="thumb"><img src={featuredArticle.img} alt="Scientist pipetting samples in a lab" /></div>
            <div className="body">
              <div className="tags"><span className="tag">Research</span><span className="tag">Featured</span></div>
              <h2 className="h3" style={{ fontSize: "clamp(28px,3vw,42px)" }}>{featuredArticle.title}</h2>
              <p className="muted" style={{ margin: "18px 0 26px" }}>{featuredArticle.text}</p>
              <Button to="/insights">Read the story</Button>
            </div>
          </Reveal>

          <Filters options={articleFilters} value={filter} onChange={setFilter} />

          <div className="grid-3 articles" style={{ rowGap: 50 }}>
            {list.map(a => (
              <Reveal as="article" className="article-card" key={a.title}>
                <div className="thumb"><img src={a.img} alt="" loading="lazy" /></div>
                <div className="article-meta"><span className="tag">{a.tag}</span> {a.read} min read</div>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container center">
          <Reveal as="h2" className="h2">Health notes,<br />twice a month.</Reveal>
          <Reveal as="p" className="lead" style={{ margin: "20px auto 34px" }}>No spam, no miracle cures — just useful research and reminders, in under five minutes.</Reveal>
          <Reveal style={{ display: "flex", justifyContent: "center" }}>
            <Button href="#newsletter" variant="purple"
              onClick={e => { e.preventDefault(); document.getElementById("newsletter").scrollIntoView({ behavior: "smooth" }); }}>
              Subscribe below
            </Button>
          </Reveal>
        </div>
      </section>
      <div style={{ height: 30 }} />
    </>
  );
}

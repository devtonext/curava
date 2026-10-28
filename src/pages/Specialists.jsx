import { useMemo, useState } from "react";
import CtaCards from "../components/CtaCards";
import DoctorCard, { DoctorModal } from "../components/DoctorCard";
import Filters from "../components/Filters";
import Marquee from "../components/Marquee";
import PageHero from "../components/PageHero";
import { usePageTitle, useSite } from "../lib/site";

export default function Specialists() {
  usePageTitle("Specialists");
  const { content, collections } = useSite();
  const p = content.specialists_page;
  const { doctors } = collections;
  const [filter, setFilter] = useState("all");
  const [profile, setProfile] = useState(null);

  // Filter chips are built from whatever specialties the doctors have.
  const options = useMemo(() => {
    const cats = [...new Set(doctors.flatMap(d => d.categories || []))];
    return [{ id: "all", label: "All" }, ...cats.map(c => ({ id: c, label: c }))];
  }, [doctors]);
  const list = filter === "all" ? doctors : doctors.filter(d => (d.categories || []).includes(filter));

  return (
    <>
      <PageHero crumb="Specialists" title={p.title}>
        <p className="lead">{p.intro}</p>
      </PageHero>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Filters options={options} value={filter} onChange={setFilter} />
          <div className="doctor-grid">
            {list.map(d => <DoctorCard key={d.id} doctor={d} showYears onOpen={setProfile} />)}
          </div>
        </div>
      </section>
      <DoctorModal doctor={profile} onClose={() => setProfile(null)} />

      <Marquee items={p.marquee} />
      <CtaCards title={p.cta_title} />
    </>
  );
}

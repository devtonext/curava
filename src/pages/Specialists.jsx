import { useState } from "react";
import CtaCards from "../components/CtaCards";
import DoctorCard from "../components/DoctorCard";
import Filters from "../components/Filters";
import Marquee from "../components/Marquee";
import PageHero from "../components/PageHero";
import { doctorFilters, doctors } from "../data";

export default function Specialists() {
  const [filter, setFilter] = useState("all");
  const list = filter === "all" ? doctors : doctors.filter(d => d.cat.includes(filter));

  return (
    <>
      <PageHero crumb="Specialists" title={<>Experts who<br />make time.</>}>
        <p className="lead">Every Curava specialist is board-certified, sees fewer patients per day than the industry average, and is reachable after your visit.</p>
      </PageHero>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Filters options={doctorFilters} value={filter} onChange={setFilter} />
          <div className="doctor-grid">
            {list.map(d => <DoctorCard key={d.name} doctor={d} showYears />)}
          </div>
        </div>
      </section>

      <Marquee items={["Board-certified", "Never rushed", "Always reachable"]} />
      <CtaCards title={<>Not sure who<br />to see first?</>} />
    </>
  );
}

import { Link } from "react-router-dom";
import Reveal from "./Reveal";

export default function DoctorCard({ doctor, showYears }) {
  return (
    <Reveal as="article" className="doctor-card">
      <div className="photo">
        <img src={doctor.img} alt={`Portrait of ${doctor.name}`} loading="lazy" />
        <Link className="btn btn--yellow book" to={`/contact?tab=book&doctor=${encodeURIComponent(doctor.name)}`}>
          Book <span className="arrow">→</span>
        </Link>
      </div>
      <h4>{doctor.name}</h4>
      <p>{doctor.role}{showYears && ` · ${doctor.years} yrs`}</p>
    </Reveal>
  );
}

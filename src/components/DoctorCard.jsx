import { Link } from "react-router-dom";
import Modal from "./Modal";
import Reveal from "./Reveal";
import Button from "./Button";

const bookUrl = name => `/contact?tab=book&doctor=${encodeURIComponent(name)}`;

export default function DoctorCard({ doctor, showYears, onOpen }) {
  return (
    <Reveal as="article" className="doctor-card">
      <button className="photo" onClick={() => onOpen?.(doctor)} aria-label={`View profile of ${doctor.name}`}>
        <img src={doctor.image_url} alt={`Portrait of ${doctor.name}`} loading="lazy" />
        <span className="view-chip">View profile</span>
      </button>
      <div className="doctor-meta">
        <div>
          <h4>{doctor.name}</h4>
          <p>{doctor.role}{showYears && doctor.years ? ` · ${doctor.years} yrs` : ""}</p>
        </div>
        <Link className="mini-book" to={bookUrl(doctor.name)} aria-label={`Book with ${doctor.name}`}>Book</Link>
      </div>
    </Reveal>
  );
}

export function DoctorModal({ doctor, onClose }) {
  return (
    <Modal open={Boolean(doctor)} onClose={onClose} className="doctor-modal" label={doctor?.name}>
      {doctor && (
        <div className="doctor-modal-grid">
          <img src={doctor.image_url} alt={`Portrait of ${doctor.name}`} />
          <div>
            <div className="tags">{(doctor.categories || []).map(c => <span className="tag" key={c}>{c}</span>)}</div>
            <h3 className="h3">{doctor.name}</h3>
            <p className="muted" style={{ margin: "6px 0 20px" }}>{doctor.role}{doctor.years ? ` · ${doctor.years} years of experience` : ""}</p>
            <p style={{ marginBottom: 28 }}>{doctor.bio}</p>
            <Button to={bookUrl(doctor.name)} variant="purple" onClick={onClose}>Book with {doctor.name.split(" ").slice(-1)}</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

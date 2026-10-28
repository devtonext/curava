import { ArrowIcon } from "./Icons";
import Reveal from "./Reveal";

// Numbered card used for programs and values.
export default function InfoCard({ index, title, text, tone }) {
  return (
    <Reveal as="article" className={`card${tone ? ` card--${tone}` : ""}`}>
      <div className="card-top">
        <span className="num">{String(index + 1).padStart(2, "0")}</span>
        <span className="icon-circle"><ArrowIcon /></span>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </Reveal>
  );
}

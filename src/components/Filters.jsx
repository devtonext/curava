import Reveal from "./Reveal";

export default function Filters({ options, value, onChange }) {
  return (
    <Reveal className="filters" role="group" aria-label="Filter">
      {options.map(o => (
        <button
          key={o.id}
          className={`filter-btn${value === o.id ? " active" : ""}`}
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </Reveal>
  );
}

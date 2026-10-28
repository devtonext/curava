export default function Marquee({ items }) {
  // Content is doubled so the -50% translate loops seamlessly.
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {loop.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

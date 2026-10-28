import { useRef, useState } from "react";

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  const body = useRef(null);
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button className="faq-q" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        {question}<span className="plus">+</span>
      </button>
      <div className="faq-a" ref={body} style={{ maxHeight: open ? body.current?.scrollHeight : 0 }}>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default function Faq({ items }) {
  return <div className="faq">{items.map(f => <FaqItem key={f.id} {...f} />)}</div>;
}

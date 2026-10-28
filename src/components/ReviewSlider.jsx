import { useEffect, useState } from "react";
import { ChevronIcon } from "./Icons";

export default function ReviewSlider({ reviews, interval = 6500 }) {
  const [idx, setIdx] = useState(0);
  const go = i => setIdx((i + reviews.length) % reviews.length);

  // Restarts whenever idx changes, so manual navigation resets the timer.
  useEffect(() => {
    const t = setTimeout(() => go(idx + 1), interval);
    return () => clearTimeout(t);
  }, [idx]);

  const r = reviews[idx];
  return (
    <div className="review-wrap">
      <div className="review-card">
        <div className="review-slide active" key={idx}>
          <div className="review-avatar"><img src={r.img} alt={r.name} /></div>
          <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
          <blockquote>“{r.quote}”</blockquote>
          <h5>{r.name}</h5><span>{r.meta}</span>
        </div>
      </div>
      <button className="review-nav prev" aria-label="Previous review" onClick={() => go(idx - 1)}><ChevronIcon dir="left" /></button>
      <button className="review-nav next" aria-label="Next review" onClick={() => go(idx + 1)}><ChevronIcon /></button>
      <div className="review-dots">
        {reviews.map((_, i) => (
          <button key={i} className={i === idx ? "active" : ""} aria-label={`Show review ${i + 1}`} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { ChevronIcon } from "./Icons";

export default function ReviewSlider({ reviews, interval = 6500 }) {
  const [idx, setIdx] = useState(0);
  const go = i => setIdx((i + reviews.length) % reviews.length);

  // Restarts whenever idx changes, so manual navigation resets the timer.
  useEffect(() => {
    if (reviews.length < 2) return;
    const t = setTimeout(() => go(idx + 1), interval);
    return () => clearTimeout(t);
  }, [idx, reviews.length]);

  if (!reviews.length) return null;
  const r = reviews[Math.min(idx, reviews.length - 1)];
  const rating = Math.max(1, Math.min(5, r.rating || 5));
  return (
    <div className="review-wrap">
      <div className="review-card">
        <div className="review-slide active" key={r.id}>
          {r.avatar_url && <div className="review-avatar"><img src={r.avatar_url} alt={r.name} /></div>}
          <div className="stars" aria-label={`${rating} out of 5 stars`}>{"★".repeat(rating)}{"☆".repeat(5 - rating)}</div>
          <blockquote>“{r.quote}”</blockquote>
          <h5>{r.name}</h5><span>{r.meta}</span>
        </div>
      </div>
      {reviews.length > 1 && (
        <>
          <button className="review-nav prev" aria-label="Previous review" onClick={() => go(idx - 1)}><ChevronIcon dir="left" /></button>
          <button className="review-nav next" aria-label="Next review" onClick={() => go(idx + 1)}><ChevronIcon /></button>
          <div className="review-dots">
            {reviews.map((_, i) => (
              <button key={i} className={i === idx ? "active" : ""} aria-label={`Show review ${i + 1}`} onClick={() => go(i)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

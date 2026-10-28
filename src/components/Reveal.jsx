import { useEffect, useRef, useState } from "react";

export function useInView(options = { threshold: 0.12 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.disconnect(); }
    }, options);
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

// Fades children up when they scroll into view.
export default function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`reveal${inView ? " in" : ""} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

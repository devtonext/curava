import { useEffect, useState } from "react";
import { useInView } from "./Reveal";

export default function Counter({ value, prefix = "", suffix = "", duration = 1600 }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [n, setN] = useState(0);
  const decimals = (String(value).split(".")[1] || "").length;

  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return <strong ref={ref}>{prefix}{n.toFixed(decimals)}{suffix}</strong>;
}

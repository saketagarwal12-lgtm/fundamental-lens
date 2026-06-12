import { useEffect, useRef, useState } from 'react';

// Count up to `target` on mount. Respects prefers-reduced-motion.
export const useCountUp = (target: number, durationMs = 900): number => {
  const [value, setValue] = useState(0);
  const raf = useRef<number>();
  useEffect(() => {
    const reduce = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setValue(target); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, durationMs]);
  return value;
};

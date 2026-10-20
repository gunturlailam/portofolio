"use client";
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Count-up number animation.
 * value: target angka (mis. 15)
 * suffix: tambahan di belakang (mis. "+")
 */
export default function CountUp({
  value,
  suffix = "",
  className,
  duration = 1400,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || started.current) return;
    started.current = true;

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const current = Math.round(value * eased);
      el.textContent = `${current}${suffix}`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, suffix, duration]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {`0${suffix}`}
    </motion.span>
  );
}

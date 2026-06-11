"use client";

import { useEffect, useRef } from "react";

/* Thin gradient scroll-progress bar pinned to the very top of the page. */
export function ScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    let raf;
    const tick = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={ref} className="scroll-progress-bar" />
    </div>
  );
}

/* Magnetic hover for every .btn — they gently drift toward the cursor. */
export function Magnetic({ selector = ".btn, [data-magnetic]", strength = 0.28 }) {
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
    const els = Array.from(document.querySelectorAll(selector));
    const handlers = els.map((el) => {
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      };
      const onLeave = () => {
        el.style.transform = "translate(0px, 0px)";
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    });
    return () => handlers.forEach((h) => h());
  }, [selector, strength]);
  return null;
}

/* Subtle animated film grain over the whole page. */
export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}

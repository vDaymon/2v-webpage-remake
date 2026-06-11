"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Three.js / WebGL must only run in the browser.
const Scene3D = dynamic(() => import("./hero3d/Scene3D"), { ssr: false });

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ss = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
// fade in over [ia,ib], hold, fade out over [oa,ob]
const fade = (p, ia, ib, oa, ob) => Math.min(ss(ia, ib, p), 1 - ss(oa, ob, p));

export function Hero3D({ t }) {
  const sectionRef = useRef(null);
  const progress = useRef(0); // shared with the 3D scene (no re-render)
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const hintRef = useRef(null);

  // Drive the overlay copy directly from scroll each frame (no re-render) so it
  // stays perfectly in sync with the 3D animation. Works with Lenis too.
  useEffect(() => {
    let raf;
    const setEl = (el, o, rise = 18) => {
      if (!el) return;
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translateY(${(1 - o) * rise}px)`;
    };
    const tick = () => {
      const el = sectionRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const scrolled = Math.max(0, -rect.top);
        const p = total > 0 ? clamp01(scrolled / total) : 0;
        progress.current = p;

        // Wide hold windows so each line stays on screen long enough to read.
        const headlineO = 1 - ss(0.28, 0.38, p);           // holds from the start, fades ~0.28→0.38
        const subO = fade(p, 0.4, 0.47, 0.66, 0.74);       // holds ~0.47→0.66 while the web builds
        const ctaO = ss(0.82, 0.9, p);                     // appears with the logo reveal and stays
        const hintO = (1 - ss(0.0, 0.05, p)) * (1 - ss(0.9, 1, p));

        setEl(headlineRef.current, headlineO);
        setEl(subRef.current, subO);
        setEl(ctaRef.current, ctaO);
        if (ctaRef.current) ctaRef.current.style.pointerEvents = ctaO > 0.5 ? "auto" : "none";
        if (hintRef.current) hintRef.current.style.opacity = hintO.toFixed(3);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const sub = (t?.hero?.sub ?? "").split(/\*\*(.+?)\*\*/g);

  return (
    <section ref={sectionRef} id="top" className="hero3d">
      <div className="hero3d-sticky">
        <Scene3D progress={progress} />

        <div className="hero3d-overlay">
          {/* Title — part of the entrance animation */}
          <div ref={headlineRef} className="hero3d-headline" style={{ opacity: 1 }}>
            <span className="hero3d-eyebrow">
              <span className="dot" /> {t?.hero?.eyebrow}
            </span>
            <h1 className="hero3d-title">
              {t?.hero?.l1}
              <br />
              {t?.hero?.l2} <span className="accent">{t?.hero?.l3a}</span>
              <br />
              {t?.hero?.l3b}
            </h1>
          </div>

          {/* Subtitle — appears as the websites build */}
          <p ref={subRef} className="hero3d-sub" style={{ opacity: 0 }}>
            {sub.map((part, i) =>
              i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
            )}
          </p>

          {/* CTAs — appear with the logo reveal */}
          <div ref={ctaRef} className="hero3d-cta-row" style={{ opacity: 0, pointerEvents: "none" }}>
            <a
              href="https://wa.me/5491100000000"
              target="_blank"
              rel="noreferrer"
              className="btn btn-pink"
              data-cursor-hover
            >
              {t?.hero?.cta1}
            </a>
            <a href="#work" className="btn btn-ghost" data-cursor-hover>
              {t?.hero?.cta2}
            </a>
          </div>

          <div ref={hintRef} className="hero3d-scrollhint">
            <span>{t?.hero?.scroll ?? "Scroll"}</span>
            <span className="hero3d-scrollhint-line" />
          </div>
        </div>
      </div>
    </section>
  );
}

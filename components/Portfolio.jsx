"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal, WordReveal } from "./hooks";
import { MockBrowser, MockPhone } from "./primitives";

export function Portfolio({ t }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current || !trackRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = sectionRef.current.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
      const trackW = trackRef.current.scrollWidth;
      const viewportW = window.innerWidth;
      const distance = Math.max(0, trackW - viewportW + 64);
      trackRef.current.style.transform = `translateX(${-distance * p}px)`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="work" ref={sectionRef} className="portfolio-sticky">
      <div className="portfolio-pin">
        <div className="container" style={{ marginBottom: 40 }}>
          <div className="sec-head" style={{ marginBottom: 20 }}>
            <Reveal className="sec-num">{t.portfolio.num}</Reveal>
            <h2>
              <WordReveal text={t.portfolio.title1} />{" "}
              <span className="accent"><WordReveal text={t.portfolio.title2} delayBase={0.1} /></span>
              <WordReveal text={t.portfolio.title3} delayBase={0.2} />
            </h2>
          </div>
        </div>
        <div className="portfolio-track-head">
          <span className="lbl">{t.portfolio.head}</span>
          <span className="lbl">{String(Math.round(progress * (t.portfolio.cards.length - 1)) + 1).padStart(2, "0")} / 0{t.portfolio.cards.length}</span>
        </div>
        <div ref={trackRef} className="portfolio-track">
          {t.portfolio.cards.map((c, i) => (
            <div key={i} className="portfolio-card" data-cursor-hover>
              <div className="preview">
                {c.kind === "phone" ? <MockPhone title={c.t} /> : <MockBrowser title={c.t} />}
              </div>
              <div className="meta">
                <div>
                  <div className="tag">{c.tag}</div>
                  <h4>{c.t}</h4>
                </div>
                <div className="num">{c.num}</div>
              </div>
            </div>
          ))}
          <div style={{ flex: "0 0 var(--pad)" }}></div>
        </div>
        <div className="portfolio-progress">
          <div ref={barRef} className="bar" style={{ transform: `scaleX(${progress})` }}></div>
        </div>
      </div>
    </section>
  );
}

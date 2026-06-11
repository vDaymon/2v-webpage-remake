"use client";

import { useEffect, useRef } from "react";
import { Reveal, WordReveal } from "./hooks";
import { Icon } from "./primitives";

export function Hero({ t }) {
  const heroRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current || !imgRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const h = heroRef.current.offsetHeight;
      // progress: 0 at top, 1 when fully scrolled past
      const p = Math.max(0, Math.min(1, -rect.top / (h * 0.85)));
      const blur = p * 32;
      const op = 1 - p * 0.85;
      const scale = 1 - p * 0.08;
      imgRef.current.style.setProperty("--img-blur", `${blur}px`);
      imgRef.current.style.setProperty("--img-op", op);
      imgRef.current.style.setProperty("--img-scale", scale);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sub = t.hero.sub.split(/\*\*(.+?)\*\*/g);

  return (
    <section ref={heroRef} className="hero" id="top">
      <div ref={imgRef} className="hero-image">
        <div className="hero-image-inner">
          <img src="/logo-2v.png" alt="2V" />
        </div>
      </div>

      <div className="hero-content">
        <Reveal className="hero-eyebrow">
          <span className="dot"></span>
          <span>{t.hero.eyebrow}</span>
        </Reveal>

        <h1 className="hero-title">
          <WordReveal text={t.hero.l1} /><br />
          <WordReveal text={t.hero.l2} delayBase={0.1} />{" "}
          <span className="accent"><WordReveal text={t.hero.l3a} delayBase={0.2} /></span>
          <br />
          <WordReveal text={t.hero.l3b} delayBase={0.3} />
        </h1>

        <Reveal delay={0.4} className="hero-sub">
          <p>
            {sub.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>)}
          </p>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="hero-cta-row">
            <a href="https://wa.me/5491100000000" target="_blank" rel="noreferrer" data-cursor-hover className="btn btn-pink">
              <Icon name="wa" /> <span>{t.hero.cta1}</span>
            </a>
            <a href="#work" data-cursor-hover className="btn btn-ghost">
              <span>{t.hero.cta2}</span> <Icon name="arrow" className="arrow" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

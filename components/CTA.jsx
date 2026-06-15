"use client";

import { Reveal, WordReveal } from "./hooks";
import { Icon } from "./primitives";
import { SITE } from "@/lib/site";

export function CTA({ t }) {
  return (
    <section id="contact" className="cta-section">
      <div className="container">
        <Reveal className="hero-eyebrow cta-eyebrow">
          <span className="dot"></span>
          <span>{t.cta.eyebrow}</span>
        </Reveal>
        <h2 className="cta-title">
          <WordReveal text={t.cta.l1} />{" "}
          <span className="accent"><WordReveal text={t.cta.l2} delayBase={0.1} /></span>{" "}
          <WordReveal text={t.cta.l3} delayBase={0.2} />
        </h2>
        <Reveal delay={0.3}>
          <div className="cta-row">
            <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="btn btn-pink" data-cursor-hover>
              <Icon name="wa" /> <span>{t.cta.btn1}</span>
            </a>
            <a href="mailto:hola@2v.studio" className="btn btn-ghost" data-cursor-hover>
              <span>{t.cta.btn2}</span> <Icon name="arrow" className="arrow" />
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.4}><div className="cta-meta">{t.cta.meta}</div></Reveal>
      </div>
    </section>
  );
}

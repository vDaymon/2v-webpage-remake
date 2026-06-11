"use client";

import { Reveal, WordReveal, TiltCard, useReveal } from "./hooks";

export function Process({ t }) {
  const [gridRef, gridVisible] = useReveal();
  return (
    <section id="process" className="sec-pad">
      <div className="container">
        <div className="sec-head">
          <Reveal className="sec-num">{t.process.num}</Reveal>
          <h2>
            <WordReveal text={t.process.title1} />{" "}
            <span className="accent"><WordReveal text={t.process.title2} delayBase={0.1} /></span>
          </h2>
          <Reveal delay={0.2}><p className="sec-desc">{t.process.desc}</p></Reveal>
        </div>
        <div className="process-grid" ref={gridRef}>
          <div className={`process-line ${gridVisible ? "is-on" : ""}`} aria-hidden="true" />
          {t.process.steps.map((s, i) => (
            <TiltCard key={i} delay={i * 0.08} max={6} className="process-step">
              <div className="num">{s.n}</div>
              <h4>{s.t}</h4>
              <p>{s.d}</p>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Reveal, WordReveal, useCountUp } from "./hooks";

function MetricItem({ m, idx }) {
  const [ref, val] = useCountUp(m.n, { duration: 2200 });
  return (
    <div ref={ref} className="metric reveal is-visible" style={{ transitionDelay: `${idx * 0.1}s` }}>
      <div className="metric-num">
        <span>{Math.round(val)}</span>
        <span className="suffix">{m.suffix}</span>
      </div>
      <div className="metric-label">{m.l}</div>
    </div>
  );
}

export function Metrics({ t }) {
  return (
    <section className="sec-pad">
      <div className="container">
        <div className="sec-head">
          <Reveal className="sec-num">{t.metrics.num}</Reveal>
          <h2>
            <WordReveal text={t.metrics.title1} />{" "}
            <span className="accent"><WordReveal text={t.metrics.title2} delayBase={0.1} /></span>{" "}
            <WordReveal text={t.metrics.title3} delayBase={0.2} />
          </h2>
          <Reveal delay={0.2}><p className="sec-desc">{t.metrics.desc}</p></Reveal>
        </div>
        <div className="metrics">
          {t.metrics.list.map((m, i) => <MetricItem key={i} m={m} idx={i} />)}
        </div>
      </div>
    </section>
  );
}

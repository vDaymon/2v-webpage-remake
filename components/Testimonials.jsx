"use client";

import { Reveal, WordReveal, TiltCard } from "./hooks";
import { TESTIMONIALS } from "@/lib/i18n";

export function Testimonials({ t, lang }) {
  const items = TESTIMONIALS[lang];
  return (
    <section className="sec-pad">
      <div className="container">
        <div className="sec-head">
          <Reveal className="sec-num">{t.test.num}</Reveal>
          <h2>
            <WordReveal text={t.test.title1} />{" "}
            <span className="accent"><WordReveal text={t.test.title2} delayBase={0.1} /></span>{" "}
            <WordReveal text={t.test.title3} delayBase={0.2} />
          </h2>
          <Reveal delay={0.2}><p className="sec-desc">{t.test.desc}</p></Reveal>
        </div>
        <div className="test-grid">
          {items.map((it, i) => (
            <TiltCard key={i} delay={i * 0.06} max={5} className={`test-card span-${it.span}`}>
              {it.q ? (
                <>
                  <div className="test-quote">&quot;{it.q}&quot;</div>
                  <div className="test-meta">
                    <div className="test-avatar">{it.initial}</div>
                    <div>
                      <div className="who">{it.who}</div>
                      <div className="role">{it.role}</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="case-stat">
                    <div className="big">
                      {it.stat.includes("x") || it.stat.includes("%") || it.stat.includes("+") ? (
                        <>
                          <span>{it.stat.replace(/[x%+]/g, "")}</span>
                          <span className="it">{it.stat.match(/[x%+]/)?.[0]}</span>
                        </>
                      ) : it.stat}
                    </div>
                    <div className="lbl">{it.lbl}</div>
                  </div>
                  <div className="test-meta" style={{ marginTop: "auto" }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-dim)" }}>
                      {it.caption}
                    </div>
                  </div>
                </>
              )}
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

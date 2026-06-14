"use client";

import { Reveal, WordReveal, useTilt } from "./hooks";
import { Icon } from "./primitives";
import { useLang } from "./LangProvider";
import { SERVICE_MENU } from "@/lib/services";

// Cada tarjeta de la home enlaza a sus páginas de servicio.
const CARD_LINKS = [
  ["diseno-de-paginas-web", "seo"],
  ["manejo-de-redes-sociales", "publicidad-en-redes-sociales"],
  ["software-a-medida"],
];

function labelFor(slug, lang) {
  const m = SERVICE_MENU.find((x) => x.slug === slug);
  return m ? m.label[lang] : slug;
}

function ServiceCard({ c, idx, iconName }) {
  const tilt = useTilt(7);
  const { lang } = useLang();
  const links = CARD_LINKS[idx] || [];
  return (
    <Reveal delay={idx * 0.08} className="service-card-reveal">
      <article ref={tilt} className="service-card tilt-card" data-cursor-hover>
        <div className="service-num">{c.n}</div>
        <div className="service-icon"><Icon name={iconName} /></div>
        <h3 className="service-title">
          {c.t1}
          <span className="accent">{c.t2}</span>
        </h3>
        <p className="service-desc">{c.d}</p>
        <ul className="service-list">
          {c.list.map((x, i) => <li key={i}>{x}</li>)}
        </ul>
        <div className="service-foot">
          <span className="price">{c.price}</span>
          <div className="service-links">
            {links.map((sl) => (
              <a key={sl} href={`/servicios/${sl}`} className="arrow-link" data-cursor-hover>
                {labelFor(sl, lang)} <Icon name="arrow" />
              </a>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function Services({ t }) {
  const icons = ["web", "spark", "code"];
  return (
    <section id="services" className="sec-pad">
      <div className="container">
        <div className="sec-head">
          <Reveal className="sec-num">{t.services.num}</Reveal>
          <h2>
            <WordReveal text={t.services.title1} />{" "}
            <span className="accent"><WordReveal text={t.services.title2} delayBase={0.1} /></span>{" "}
            <WordReveal text={t.services.title3} delayBase={0.2} />
          </h2>
          <Reveal delay={0.2}><p className="sec-desc">{t.services.desc}</p></Reveal>
        </div>
        <div className="services-grid">
          {t.services.cards.map((c, i) => (
            <ServiceCard key={i} c={c} idx={i} iconName={icons[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}

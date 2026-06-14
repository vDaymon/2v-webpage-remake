"use client";

import Link from "next/link";
import { I18N } from "@/lib/i18n";
import { PROCESO, UI } from "@/lib/services";
import { SITE } from "@/lib/site";
import { useLang } from "./LangProvider";
import { ArcNav } from "./Nav";
import { Footer } from "./Footer";
import { Icon } from "./primitives";
import { CustomCursor } from "./hooks";
import { SmoothScroll } from "./SmoothScroll";
import { ScrollProgress, Grain, Magnetic } from "./Fx";

export function ServicePageClient({ service, related = [] }) {
  const { lang } = useLang();
  const c = service[lang] || service.es;
  const ui = UI[lang] || UI.es;
  const proceso = PROCESO[lang] || PROCESO.es;

  return (
    <div className="svc-page" style={{ "--pink-h": "340" }}>
      <SmoothScroll />
      <ScrollProgress />
      <Grain />
      <Magnetic />
      <CustomCursor enabled />
      <ArcNav />

      <main className="svc">
        <section className="svc-hero">
          <div className="container">
            <nav className="svc-crumbs" aria-label="breadcrumb">
              <Link href="/">{ui.breadHome}</Link>
              <span>/</span>
              <Link href="/#services">{ui.breadServices}</Link>
              <span>/</span>
              <span aria-current="page">{c.nav}</span>
            </nav>
            <span className="svc-eyebrow"><span className="dot" /> {c.eyebrow}</span>
            <h1 className="svc-h1">{c.h1}</h1>
            {c.intro.map((p, i) => (
              <p key={i} className="svc-intro">{p}</p>
            ))}
            <div className="svc-cta-row">
              <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="btn btn-pink" data-cursor-hover>
                <Icon name="wa" /> <span>{ui.ctaQuote}</span>
              </a>
              <Link href="/#work" className="btn btn-ghost" data-cursor-hover>
                <span>{ui.ctaWork}</span> <Icon name="arrow" className="arrow" />
              </Link>
            </div>
          </div>
        </section>

        <section className="svc-block">
          <div className="container">
            <h2 className="svc-h2">{ui.incluye}</h2>
            <div className="svc-grid">
              {c.incluye.map((it, i) => (
                <div key={i} className="svc-card">
                  <h3>{it.t}</h3>
                  <p>{it.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="svc-block">
          <div className="container">
            <h2 className="svc-h2">{ui.beneficios}</h2>
            <div className="svc-grid svc-grid-3">
              {c.beneficios.map((it, i) => (
                <div key={i} className="svc-card">
                  <h3>{it.t}</h3>
                  <p>{it.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="svc-block">
          <div className="container">
            <h2 className="svc-h2">{ui.proceso}</h2>
            <div className="svc-grid svc-grid-4">
              {proceso.map((st, i) => (
                <div key={i} className="svc-step">
                  <div className="num">{st.n}</div>
                  <h3>{st.t}</h3>
                  <p>{st.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="svc-block">
          <div className="container svc-faq-wrap">
            <h2 className="svc-h2">{ui.faq}</h2>
            <div className="svc-faq">
              {c.faqs.map((f, i) => (
                <details key={i} className="svc-faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="svc-block">
            <div className="container">
              <h2 className="svc-h2">{ui.otros}</h2>
              <div className="svc-grid svc-grid-3">
                {related.map((r) => (
                  <Link key={r.slug} href={`/servicios/${r.slug}`} className="svc-card svc-card-link" data-cursor-hover>
                    <h3>{(r[lang] || r.es).nav}</h3>
                    <span className="svc-arrow">{ui.verServicio}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="svc-final-cta">
          <div className="container">
            <h2>{ui.finalTitle}</h2>
            <p>{ui.finalText}</p>
            <a href={SITE.whatsapp} target="_blank" rel="noreferrer" className="btn btn-pink" data-cursor-hover>
              <Icon name="wa" /> <span>{ui.ctaFree}</span>
            </a>
          </div>
        </section>
      </main>

      <Footer t={I18N[lang] || I18N.es} />
    </div>
  );
}

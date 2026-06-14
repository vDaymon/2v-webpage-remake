"use client";

// Rounded minimal nav — works on the homepage (scroll to sections) and on
// secondary pages (navigate back to a homepage section). "Servicios" has a
// submenu linking to each service page.

import { Fragment, useState, useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "./primitives";
import { useLang } from "./LangProvider";
import { SERVICE_MENU } from "@/lib/services";

// Layout effect on the client (avoids the 2V curtain flashing on arrival).
const useIsoEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Module-level guard: each home arrival is a full page load (resets this),
// so it survives React StrictMode's double-invoked effects within a load.
let curtainArrivalHandled = false;

export const SECTIONS = [
  { id: "top",       label: { es: "Inicio", en: "Home" },        paint: "#2f0954",  light: false, sub: false },
  { id: "services",  label: { es: "Servicios", en: "Services" }, paint: "#2F184B",  light: false, sub: true  },
  { id: "work",      label: { es: "Trabajos", en: "Work" },      paint: "#F4EFFA",  light: true,  sub: false },
  { id: "process",   label: { es: "Proceso", en: "Process" },    paint: "#532B88",  light: false, sub: false },
  { id: "contact",   label: { es: "Contacto", en: "Contact" },   paint: "#1a0e2e",  light: false, sub: false }
];

const WA = "https://wa.me/5491100000000";

export function PetalNav() {
  const { lang, setLang } = useLang();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [active, setActive] = useState("top");
  const [curtain, setCurtain] = useState({ on: false, color: "transparent", phase: "idle" });

  useEffect(() => {
    const opts = { rootMargin: "-30% 0px -50% 0px", threshold: 0 };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, opts);
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [pathname]);

  useEffect(() => {
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) {
        if (s.id !== "top") el.style.background = s.paint;
        el.dataset.light = s.light ? "true" : "false";
      }
    });
  }, [pathname]);

  const toggleOpen = () => {
    if (open) {
      setClosing(true);
      setTimeout(() => { setOpen(false); setClosing(false); }, 800);
    } else {
      setOpen(true);
    }
  };

  const goTo = (id, paint) => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 600);
    setCurtain({ on: true, color: paint, phase: "in" });
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY;
        if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true });
        else window.scrollTo({ top: y, behavior: "instant" });
      }
      setCurtain({ on: true, color: paint, phase: "out" });
      setTimeout(() => setCurtain({ on: false, color: "transparent", phase: "idle" }), 700);
    }, 700);
  };

  // From the homepage → smooth-scroll to the section. From a secondary page →
  // play the 2V curtain, then land on the homepage already at that section.
  const onSection = (s) => {
    if (isHome) {
      goTo(s.id, s.paint);
      return;
    }
    setOpen(false);
    try { sessionStorage.setItem("__nav2v", JSON.stringify({ color: s.paint, id: s.id })); } catch {}
    setCurtain({ on: true, color: s.paint, phase: "in" });
    setTimeout(() => { window.location.href = "/"; }, 720);
  };

  // Arriving on the homepage from a secondary page: finish the 2V curtain
  // (wipe it away) with the page already scrolled to the target section.
  useIsoEffect(() => {
    if (!isHome || curtainArrivalHandled) return;
    let raw = null;
    try { raw = sessionStorage.getItem("__nav2v"); } catch {}
    if (!raw) return;
    curtainArrivalHandled = true;
    try { sessionStorage.removeItem("__nav2v"); } catch {}
    let data = null;
    try { data = JSON.parse(raw); } catch {}
    if (!data) return;
    setCurtain({ on: true, color: data.color, phase: "out" });
    const id = data.id;
    // The page keeps growing as the 3D hero + images load, so a single early
    // scroll lands short. Poll: re-assert the scroll until the target section
    // is aligned, then reveal (wipe the curtain away).
    let tries = 0;
    const reveal = () => setCurtain({ on: false, color: "transparent", phase: "idle" });
    const tick = () => {
      tries += 1;
      const el = id && id !== "top" ? document.getElementById(id) : null;
      const top = el ? el.getBoundingClientRect().top : 0;
      const y = el ? top + window.scrollY : 0;
      if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
      if (Math.abs(top) < 6 || tries > 36) {
        clearInterval(poll);
        setTimeout(reveal, 80);
      }
    };
    const poll = setInterval(tick, 45);
  }, [isHome]);

  const activeIdx = SECTIONS.findIndex(s => s.id === active);
  const activeSec = SECTIONS[activeIdx] || SECTIONS[0];
  const stateClass = closing ? "is-closing" : (open ? "is-open" : "");

  return (
    <>
      <div
        className={`curtain ${curtain.on ? `curtain--${curtain.phase}` : ""}`}
        style={{ background: curtain.color }}
        aria-hidden="true"
      >
        <div className="curtain-mark">2V</div>
      </div>

      <div className={`petal-nav ${stateClass}`}>
        <div className="soft-panel" aria-hidden="true">
          <div className="soft-panel-label">
            <span className="dot"></span>
            <span>{lang === "es" ? "Navegación" : "Navigation"}</span>
          </div>
          <div className="soft-panel-foot">
            <span>2V Digital</span>
            <span>{lang.toUpperCase()}</span>
          </div>
        </div>

        <button
          className="soft-trigger"
          onClick={toggleOpen}
          aria-label={open ? "Close menu" : "Open menu"}
          data-cursor-hover
          data-light={activeSec.light ? "true" : "false"}
        >
          <span className="soft-trigger-bg"></span>
          <span className="soft-trigger-inner">
            <span className={`soft-icon ${open ? "is-x" : ""}`}>
              <span className="soft-bar"></span>
              <span className="soft-bar"></span>
            </span>
            <span className="soft-trigger-label">
              {open ? (lang === "es" ? "Cerrar" : "Close") : (lang === "es" ? "Menú" : "Menu")}
            </span>
          </span>
          <span className="soft-trigger-dots" aria-hidden="true">
            {SECTIONS.map((s) => (
              <span
                key={s.id}
                className={`soft-trigger-dot ${s.id === active ? "is-active" : ""}`}
                style={{ background: s.paint }}
              ></span>
            ))}
          </span>
        </button>

        <div className="soft-stack">
          <div className="soft-stack-eyebrow" style={{ "--in-delay": "0.15s" }}>
            {lang === "es" ? "Ir a sección" : "Jump to section"}
          </div>

          {SECTIONS.map((s, i) => {
            const isActive = s.id === active;
            return (
              <Fragment key={s.id}>
                <button
                  className={`soft-item ${isActive ? "is-active" : ""}`}
                  style={{
                    "--paint": s.paint,
                    "--in-delay": `${0.22 + i * 0.07}s`,
                    "--out-delay": `${(SECTIONS.length - 1 - i) * 0.05}s`
                  }}
                  data-light={s.light ? "true" : "false"}
                  onClick={() => onSection(s)}
                  data-cursor-hover
                >
                  <span className="soft-item-num">0{i + 1}</span>
                  <span className="soft-item-label">{s.label[lang]}</span>
                  <span className="soft-item-swatch" style={{ background: s.paint }}></span>
                  <span className="soft-item-arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path d="M5 12 L19 12 M13 6 L19 12 L13 18" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>

                {s.sub && (
                  <div className="soft-submenu" style={{ "--in-delay": `${0.26 + i * 0.07}s` }}>
                    {SERVICE_MENU.map((sv) => (
                      <a key={sv.slug} href={`/servicios/${sv.slug}`} className="soft-subitem" data-cursor-hover>
                        <span className="soft-subitem-dot"></span>
                        <span className="soft-subitem-label">{sv.label[lang]}</span>
                        <span className="soft-subitem-arrow" aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </Fragment>
            );
          })}

          <div
            className="soft-extras"
            style={{ "--in-delay": `${0.22 + SECTIONS.length * 0.07}s`, "--out-delay": "0s" }}
          >
            <div className="lang-switch soft-lang">
              <button className={lang === "es" ? "active" : ""} onClick={() => setLang("es")} data-cursor-hover>ES</button>
              <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} data-cursor-hover>EN</button>
            </div>
            <a href={WA} target="_blank" rel="noreferrer" className="soft-cta" data-cursor-hover>
              <Icon name="wa" />
              <span>{lang === "es" ? "Cotizar" : "Quote"}</span>
            </a>
          </div>
        </div>
      </div>

      <a href={WA} target="_blank" rel="noreferrer" className="wa-orb" data-cursor-hover aria-label="WhatsApp">
        <span className="wa-orb-inner">
          <Icon name="wa" />
          <span className="wa-orb-label">{lang === "es" ? "Cotizá gratis" : "Get a quote"}</span>
        </span>
      </a>

      <button
        className={`lang-fixed ${lang === "en" ? "is-en" : "is-es"}`}
        data-light={activeSec.light ? "true" : "false"}
        onClick={() => setLang(lang === "es" ? "en" : "es")}
        data-cursor-hover
        aria-label="Toggle language"
      >
        <span className="lang-thumb"></span>
        <span className="lang-opt" data-opt="es">ES</span>
        <span className="lang-opt" data-opt="en">EN</span>
      </button>

      <div className="brand-mini" data-light={activeSec.light ? "true" : "false"}>
        <span className="brand-mini-dot" style={{ background: activeSec.paint }}></span>
        <span>2V Digital</span>
        <span className="brand-mini-section">/ {activeSec.label[lang]}</span>
      </div>
    </>
  );
}

export const ArcNav = PetalNav;

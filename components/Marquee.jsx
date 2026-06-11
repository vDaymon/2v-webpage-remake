"use client";

import { Fragment, useEffect, useRef } from "react";
import { Icon } from "./primitives";

export function Ticker({ items }) {
  const repeat = [...items, ...items, ...items, ...items];
  const tickerRef = useRef(null);
  const rowRef = useRef(null);

  // React to scroll velocity (Lenis): skew the strip + speed up the marquee.
  useEffect(() => {
    let raf;
    const tick = () => {
      const v = (typeof window !== "undefined" && window.__lenis && window.__lenis.velocity) || 0;
      const c = Math.max(-60, Math.min(60, v));
      if (tickerRef.current) tickerRef.current.style.setProperty("--skew", `${c * 0.1}deg`);
      if (rowRef.current) {
        const d = Math.max(8, 40 - Math.abs(c) * 0.5);
        rowRef.current.style.animationDuration = `${d}s`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="ticker" ref={tickerRef}>
      <div className="ticker-row" ref={rowRef}>
        {repeat.map((it, i) => (
          <Fragment key={i}>
            <span>{it}</span>
            <Icon name="star" className="star" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

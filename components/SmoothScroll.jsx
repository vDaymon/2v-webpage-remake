"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Smooth (inertial) scrolling for the whole page. Exposes the instance on
// window.__lenis so the nav can use it for section jumps.
export function SmoothScroll() {
  useEffect(() => {
    // On touch devices, native scrolling is smoother than Lenis (and avoids
    // jank fighting the 3D). Only smooth-scroll on desktop / pointer devices.
    const isTouch =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__lenis = lenis;

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return null;
}

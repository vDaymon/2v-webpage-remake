"use client";

import { useEffect } from "react";
import { I18N } from "@/lib/i18n";
import { useLang } from "@/components/LangProvider";
import { CustomCursor } from "@/components/hooks";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress, Magnetic, Grain } from "@/components/Fx";
import { ArcNav } from "@/components/Nav";
import { Hero3D } from "@/components/Hero3D";
import { Ticker } from "@/components/Marquee";
import { Services } from "@/components/Services";
import { Metrics } from "@/components/Metrics";
import { Portfolio } from "@/components/Portfolio";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRadio,
  TweakSlider,
  TweakToggle,
} from "@/components/TweaksPanel";

const TWEAK_DEFAULTS = {
  lang: "es",
  purpleHue: 285,
  purpleSat: 60,
  pinkHue: 340,
  darkMode: true,
  animSpeed: 1,
  showCursor: true,
};

export default function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const { lang, setLang } = useLang();

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--hue", tweaks.purpleHue);
    r.style.setProperty("--sat", tweaks.purpleSat + "%");
    r.style.setProperty("--pink-h", tweaks.pinkHue);
    r.style.setProperty("--speed", tweaks.animSpeed);
    r.dataset.theme = tweaks.darkMode ? "dark" : "light";
    r.dataset.cursor = tweaks.showCursor ? "on" : "off";
  }, [tweaks]);

  const t = I18N[lang] || I18N.es;

  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <Grain />
      <Magnetic />
      <CustomCursor enabled={tweaks.showCursor} />
      <ArcNav />
      <Hero3D t={t} />
      <Ticker items={t.ticker} />
      <Services t={t} />
      <Metrics t={t} />
      <Portfolio t={t} />
      <Process t={t} />
      <Testimonials t={t} lang={lang} />
      <CTA t={t} />
      <Footer t={t} />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Idioma / Language">
          <TweakRadio label="Lang" value={lang} options={[{value:"es",label:"ES"},{value:"en",label:"EN"}]} onChange={setLang} />
        </TweakSection>
        <TweakSection title="Color">
          <TweakSlider label="Tono morado oscuro" value={tweaks.purpleHue} min={260} max={310} step={1} onChange={(v) => setTweak("purpleHue", v)} />
          <TweakSlider label="Tono rosa pastel" value={tweaks.pinkHue} min={300} max={20} step={1} onChange={(v) => setTweak("pinkHue", v)} />
          <TweakSlider label="Saturación morado" value={tweaks.purpleSat} min={20} max={100} step={1} onChange={(v) => setTweak("purpleSat", v)} />
          <TweakToggle label="Modo oscuro" value={tweaks.darkMode} onChange={(v) => setTweak("darkMode", v)} />
        </TweakSection>
        <TweakSection title="Interacción">
          <TweakSlider label="Velocidad animaciones" value={tweaks.animSpeed} min={0.5} max={2} step={0.1} onChange={(v) => setTweak("animSpeed", v)} />
          <TweakToggle label="Cursor personalizado" value={tweaks.showCursor} onChange={(v) => setTweak("showCursor", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LangContext = createContext({ lang: "es", setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState("es");

  // Restore the saved language on mount (shared across all pages).
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "es" || saved === "en") {
        setLangState(saved);
        document.documentElement.lang = saved;
      }
    } catch {}
  }, []);

  const setLang = (l) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

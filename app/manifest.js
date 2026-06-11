import { SITE } from "@/lib/site";

export default function manifest() {
  return {
    name: "2V Digital — Diseño web, SEO y software a medida",
    short_name: "2V Digital",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#1a0e2e",
    theme_color: "#1a0e2e",
    lang: "es-AR",
    categories: ["business", "technology", "design"],
    icons: [
      { src: "/logo-2v.png", sizes: "any", type: "image/png", purpose: "any" },
    ],
  };
}

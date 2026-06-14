import { SITE } from "@/lib/site";
import { SERVICES } from "@/lib/services";

export default function sitemap() {
  const lastModified = new Date();
  return [
    {
      url: SITE.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...SERVICES.map((s) => ({
      url: `${SITE.url}/servicios/${s.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];
}

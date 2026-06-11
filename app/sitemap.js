import { SITE } from "@/lib/site";

export default function sitemap() {
  const lastModified = new Date();
  return [
    {
      url: SITE.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

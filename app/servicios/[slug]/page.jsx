import { notFound } from "next/navigation";
import { SERVICES, getService } from "@/lib/services";
import { SITE } from "@/lib/site";
import { ServicePageClient } from "@/components/ServicePageClient";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }) {
  const s = getService(params.slug);
  if (!s) return {};
  const path = `/servicios/${s.slug}`;
  return {
    title: { absolute: s.es.title },
    description: s.es.metaDescription,
    keywords: s.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: SITE.url + path,
      title: s.es.title,
      description: s.es.metaDescription,
      siteName: SITE.name,
      locale: SITE.locale,
    },
    twitter: { card: "summary_large_image", title: s.es.title, description: s.es.metaDescription },
  };
}

export default function ServicePage({ params }) {
  const s = getService(params.slug);
  if (!s) notFound();

  const path = `/servicios/${s.slug}`;
  const url = SITE.url + path;
  const related = (s.related || [])
    .map(getService)
    .filter(Boolean)
    .map((r) => ({ slug: r.slug, es: { nav: r.es.nav }, en: { nav: r.en.nav } }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: s.es.h1,
        serviceType: s.es.nav,
        description: s.es.metaDescription,
        provider: { "@id": `${SITE.url}/#organization` },
        areaServed: ["Colombia", "Medellín", "Antioquia", "LATAM"],
        url,
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: s.es.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Servicios", item: `${SITE.url}/#services` },
          { "@type": "ListItem", position: 3, name: s.es.nav, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ServicePageClient service={s} related={related} />
    </>
  );
}

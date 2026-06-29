import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LandingPage } from "@/components/landing-page"
import { PLAY_STORE_URL, translations, type Lang } from "@/lib/translations"

const SITE_URL = "https://prestamohub.com"

const meta: Record<
  Lang,
  { title: string; description: string; locale: string; keywords: string[] }
> = {
  es: {
    title: "Préstamo Hub: app para comparar préstamos personales en línea en México",
    description:
      "Compara préstamos personales en línea en México desde una sola app. Revisa montos de MXN 600 a 60,000, plazos de 61 a 365 días, APR máxima, costos estimados y descarga la app en Google Play.",
    locale: "es_MX",
    keywords: [
      "prestamos personales en mexico",
      "prestamos personales en linea",
      "app de prestamos mexico",
      "app para comparar prestamos",
      "comparador de prestamos",
      "credito en linea mexico",
      "prestamos en linea mexico",
      "prestamohub",
    ],
  },
  en: {
    title: "Préstamo Hub: compare online personal loans in Mexico",
    description:
      "Compare online personal loans in Mexico from one app. Review amounts from MXN 600 to 60,000, terms of 61 to 365 days, maximum APR, estimated costs and download on Google Play.",
    locale: "en_US",
    keywords: [
      "personal loans mexico app",
      "online personal loans mexico",
      "loan comparison mexico",
      "compare loans app",
      "easy credit mexico",
      "online loans mexico",
      "prestamohub",
    ],
  },
}

export function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (lang !== "es" && lang !== "en") return {}
  const m = meta[lang as Lang]
  return {
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        "es-MX": `${SITE_URL}/es`,
        en: `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/es`,
      },
    },
    openGraph: {
      type: "website",
      locale: m.locale,
      url: `${SITE_URL}/${lang}`,
      siteName: "Préstamo Hub",
      title: m.title,
      description: m.description,
      images: [{ url: "/first.png", width: 640, height: 800, alt: "Préstamo Hub" }],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: ["/first.png"],
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (lang !== "es" && lang !== "en") notFound()
  const currentLang = lang as Lang
  const t = translations[currentLang]

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name:
        currentLang === "es"
          ? "Préstamo Hub: Crédito Fácil"
          : "Préstamo Hub: Easy Credit",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Android",
      inLanguage: currentLang === "es" ? "es-MX" : "en-US",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "MXN",
      },
      downloadUrl: PLAY_STORE_URL,
      url: `${SITE_URL}/${currentLang}`,
      description: meta[currentLang].description,
      publisher: {
        "@type": "Organization",
        name: "Legalflow, S.A. de C.V.",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: currentLang === "es" ? "es-MX" : "en-US",
      mainEntity: t.faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: meta[currentLang].title,
      url: `${SITE_URL}/${currentLang}`,
      description: meta[currentLang].description,
      inLanguage: currentLang === "es" ? "es-MX" : "en-US",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: currentLang === "es" ? "Inicio" : "Home",
            item: `${SITE_URL}/${currentLang}`,
          },
        ],
      },
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage lang={currentLang} />
    </>
  )
}

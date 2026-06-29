import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LangProvider } from "@/components/lang-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BlogList } from "@/components/blog-list"
import type { Lang } from "@/lib/translations"

const SITE_URL = "https://prestamohub.com"

const meta: Record<Lang, { title: string; description: string; locale: string }> = {
  es: {
    title: "Blog de educación financiera | Préstamo Hub",
    description:
      "Guías, consejos y comparativas sobre préstamos, CAT, tasas y finanzas personales en México.",
    locale: "es_MX",
  },
  en: {
    title: "Financial education blog | Préstamo Hub",
    description:
      "Guides, tips and comparisons about loans, total cost of credit, rates and personal finance in Mexico.",
    locale: "en_US",
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
    alternates: {
      canonical: `${SITE_URL}/${lang}/blog`,
      languages: {
        "es-MX": `${SITE_URL}/es/blog`,
        en: `${SITE_URL}/en/blog`,
        "x-default": `${SITE_URL}/es/blog`,
      },
    },
    openGraph: {
      type: "website",
      locale: m.locale,
      url: `${SITE_URL}/${lang}/blog`,
      siteName: "Préstamo Hub",
      title: m.title,
      description: m.description,
    },
  }
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (lang !== "es" && lang !== "en") notFound()
  return (
    <LangProvider lang={lang as Lang}>
      <SiteHeader />
      <main>
        <BlogList />
      </main>
      <SiteFooter />
    </LangProvider>
  )
}

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LangProvider } from "@/components/lang-provider"
import { SeoKeywordPage } from "@/components/seo-keyword-page"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getPost } from "@/lib/blog"
import { getSeoPage, seoPages } from "@/lib/seo-pages"
import type { Lang } from "@/lib/translations"

const SITE_URL = "https://prestamohub.com"

export function generateStaticParams() {
  const langs: Lang[] = ["es", "en"]
  return langs.flatMap((lang) => seoPages.map((page) => ({ lang, slug: page.slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (lang !== "es" && lang !== "en") return {}

  const page = getSeoPage(slug)
  if (!page) return {}

  const currentLang = lang as Lang
  const title = page.title[currentLang]
  const description = page.description[currentLang]

  return {
    title,
    description,
    keywords: page.keywords[currentLang],
    alternates: {
      canonical: `${SITE_URL}/${currentLang}/${slug}`,
      languages: {
        "es-MX": `${SITE_URL}/es/${slug}`,
        en: `${SITE_URL}/en/${slug}`,
        "x-default": `${SITE_URL}/es/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: currentLang === "es" ? "es_MX" : "en_US",
      url: `${SITE_URL}/${currentLang}/${slug}`,
      siteName: "Préstamo Hub",
      title,
      description,
      images: [{ url: "/first.png", width: 640, height: 800, alt: "Préstamo Hub" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/first.png"],
    },
  }
}

export default async function SeoLandingRoute({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (lang !== "es" && lang !== "en") notFound()

  const currentLang = lang as Lang
  const page = getSeoPage(slug)
  if (!page) notFound()

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title[currentLang],
      url: `${SITE_URL}/${currentLang}/${slug}`,
      description: page.description[currentLang],
      inLanguage: currentLang === "es" ? "es-MX" : "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: currentLang === "es" ? "es-MX" : "en-US",
      mainEntity: page.faq[currentLang].map((item) => ({
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
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: currentLang === "es" ? "Inicio" : "Home",
          item: `${SITE_URL}/${currentLang}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.label[currentLang],
          item: `${SITE_URL}/${currentLang}/${slug}`,
        },
      ],
    },
  ]

  const relatedPosts = (page.relatedBlogSlugs ?? [])
    .map((postSlug) => getPost(postSlug))
    .filter((post): post is NonNullable<typeof post> => Boolean(post))
    .map((post) => ({
      slug: post.slug,
      title: post.title[currentLang],
      excerpt: post.excerpt[currentLang],
    }))

  return (
    <LangProvider lang={currentLang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <SeoKeywordPage page={page} lang={currentLang} relatedPosts={relatedPosts} />
      <SiteFooter />
    </LangProvider>
  )
}

import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { LangProvider } from "@/components/lang-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BlogArticle } from "@/components/blog-article"
import { blogPosts, getPost } from "@/lib/blog"
import type { Lang } from "@/lib/translations"

const SITE_URL = "https://prestamohub.com"

const BLOG_SLUG_REDIRECTS: Record<string, string> = {
  "cat-calculator-mexico": "calculadora-cat-mx",
  "what-is-a-sofom": "que-es-sofom",
  "kueski-vs-tala-vs-didi-prestamos": "kueski-vs-tala-vs-didi",
}

export function generateStaticParams() {
  const langs: Lang[] = ["es", "en"]
  return langs.flatMap((lang) =>
    blogPosts.map((post) => ({ lang, slug: post.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  if (lang !== "es" && lang !== "en") return {}
  const resolvedSlug = BLOG_SLUG_REDIRECTS[slug] ?? slug
  const post = getPost(resolvedSlug)
  if (!post) return {}
  const l = lang as Lang
  return {
    title: `${post.title[l]} | Préstamo Hub`,
    description: post.excerpt[l],
    alternates: {
      canonical: `${SITE_URL}/${lang}/blog/${resolvedSlug}`,
      languages: {
        "es-MX": `${SITE_URL}/es/blog/${resolvedSlug}`,
        en: `${SITE_URL}/en/blog/${resolvedSlug}`,
        "x-default": `${SITE_URL}/es/blog/${resolvedSlug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: l === "es" ? "es_MX" : "en_US",
      url: `${SITE_URL}/${lang}/blog/${resolvedSlug}`,
      siteName: "Préstamo Hub",
      title: post.title[l],
      description: post.excerpt[l],
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (lang !== "es" && lang !== "en") notFound()

  const resolvedSlug = BLOG_SLUG_REDIRECTS[slug]
  if (resolvedSlug) {
    redirect(`/${lang}/blog/${resolvedSlug}`)
  }

  const post = getPost(slug)
  if (!post) notFound()
  const l = lang as Lang

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title[l],
    description: post.excerpt[l],
    datePublished: post.date,
    inLanguage: l === "es" ? "es-MX" : "en-US",
    author: { "@type": "Organization", name: "Préstamo Hub" },
    publisher: {
      "@type": "Organization",
      name: "Legalflow, S.A. de C.V.",
    },
    mainEntityOfPage: `${SITE_URL}/${lang}/blog/${slug}`,
  }

  return (
    <LangProvider lang={l}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        <BlogArticle post={post} />
      </main>
      <SiteFooter />
    </LangProvider>
  )
}

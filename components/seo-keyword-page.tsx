import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { GooglePlayButton } from "@/components/google-play-button"
import { KeywordLinks } from "@/components/keyword-links"
import type { SeoPage } from "@/lib/seo-pages"
import type { Lang } from "@/lib/translations"

export function SeoKeywordPage({
  page,
  lang,
  relatedPosts,
}: {
  page: SeoPage
  lang: Lang
  relatedPosts?: Array<{
    slug: string
    title: string
    excerpt: string
  }>
}) {
  const backToHome =
    lang === "es" ? "Volver al inicio" : "Back to home"
  const goToBlog =
    lang === "es" ? "Leer blog" : "Read the blog"
  const faqTitle =
    lang === "es" ? "Preguntas frecuentes" : "Frequently asked questions"
  const relatedTitle =
    lang === "es" ? "Artículos relacionados" : "Related articles"

  return (
    <>
      <main>
        <section className="border-b border-border bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                {page.heroKicker[lang]}
              </p>
              <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
                {page.heroTitle[lang]}
              </h1>
              <p className="mt-6 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                {page.heroSubtitle[lang]}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <GooglePlayButton
                  label={lang === "es" ? "Descargar en Google Play" : "Get it on Google Play"}
                />
                <div className="flex gap-3">
                  <Link
                    href={`/${lang}`}
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    {backToHome}
                  </Link>
                  <Link
                    href={`/${lang}/blog`}
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    {goToBlog}
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {page.stats[lang].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-border bg-card p-5"
                >
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-lg font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-3 lg:grid-cols-3">
              {page.highlights[lang].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-background/80 px-4 py-3"
                >
                  <p className="inline-flex items-start gap-2 text-sm leading-relaxed text-foreground">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span>{item}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {page.sections[lang].map((section) => (
                <article
                  key={section.heading}
                  className="rounded-3xl border border-border bg-card p-6"
                >
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {section.bullets && (
                    <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/40 py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 md:px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
              {faqTitle}
            </h2>
            <div className="mt-10 space-y-4">
              {page.faq[lang].map((item) => (
                <details
                  key={item.q}
                  className="rounded-3xl border border-border bg-card p-5"
                >
                  <summary className="cursor-pointer list-none text-base font-semibold text-foreground">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {relatedPosts && relatedPosts.length > 0 && (
          <section className="bg-background py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4 md:px-6">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
                  {relatedTitle}
                </h2>
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/${lang}/blog/${post.slug}`}
                    className="rounded-3xl border border-border bg-card p-6 transition-colors hover:border-primary/40 hover:bg-secondary/40"
                  >
                    <h3 className="text-lg font-semibold text-foreground">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <KeywordLinks currentSlug={page.slug} />
      </main>
    </>
  )
}

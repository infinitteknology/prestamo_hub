"use client"

import Link from "next/link"
import { useLang } from "@/components/lang-provider"
import { seoPages } from "@/lib/seo-pages"

export function KeywordLinks({ currentSlug }: { currentSlug?: string }) {
  const { lang } = useLang()

  const links = seoPages.filter((page) => page.slug !== currentSlug)
  const title =
    lang === "es" ? "Búsquedas relacionadas" : "Related searches"
  const subtitle =
    lang === "es"
      ? "Páginas pensadas para consultas frecuentes sobre préstamos en México."
      : "Pages built around common loan-related searches in Mexico."

  return (
    <section className="border-t border-border bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">{subtitle}</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {links.map((page) => (
            <Link
              key={page.slug}
              href={`/${lang}/${page.slug}`}
              className="rounded-3xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-secondary/40"
            >
              <p className="text-sm font-semibold text-foreground">
                {page.label[lang]}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {page.description[lang]}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

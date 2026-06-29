"use client"

import Link from "next/link"
import { ArrowRight, BookOpenText, Clock } from "lucide-react"
import { useLang } from "@/components/lang-provider"
import { blogPosts, formatDate } from "@/lib/blog"

export function BlogList() {
  const { lang, t } = useLang()
  const heroTitle =
    lang === "es" ? (
      <>
        <span className="block">Blog de</span>
        <span className="text-[#2ecc71]">
          educación financiera
        </span>
      </>
    ) : (
      <>
        <span className="block text-[#2ecc71]">Financial</span>
        <span className="block">
          <span className="text-[#2ecc71]">education</span> blog
        </span>
      </>
    )

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
      <div className="relative px-4 py-4 text-center md:px-8 md:py-6">
        <span className="absolute left-[10%] top-[32%] h-2 w-2 rounded-full bg-[#7da7ff]/80" />
        <span className="absolute right-[18%] top-[50%] h-2.5 w-2.5 rounded-full bg-[#7da7ff]/85" />
        <span className="absolute bottom-[22%] left-[58%] h-3 w-3 rounded-full bg-[#7da7ff]/90" />
        <span className="absolute right-[40%] top-[14%] h-1.5 w-1.5 rounded-full bg-[#7da7ff]/75" />

        <div className="relative mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-[#b9c9f8] bg-white/60 px-4 py-2.5 text-sm font-semibold text-[#5b7ce7]">
            <BookOpenText className="size-4" />
            <span>{t.blog.title}</span>
          </div>

          <h1 className="mt-5 text-balance text-3xl font-extrabold leading-[1.08] tracking-tight text-foreground md:text-5xl">
            {heroTitle}
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-pretty text-base leading-8 text-muted-foreground md:text-lg">
            {t.blog.subtitle}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/${lang}/blog/${post.slug}`}
            className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-transform transition-colors duration-200 hover:-translate-y-1 hover:border-primary/50"
          >
            <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
              <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                {post.category[lang]}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {post.readingMinutes} {t.blog.minutes}
              </span>
            </div>
            <h2 className="mt-4 text-balance text-lg font-bold leading-snug tracking-tight group-hover:text-primary">
              {post.title[lang]}
            </h2>
            <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
              {post.excerpt[lang]}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {formatDate(post.date, lang)}
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                {t.blog.readMore}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

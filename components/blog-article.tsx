"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ChevronDown, Clock, List, Tag } from "lucide-react"
import { GooglePlayButton } from "@/components/google-play-button"
import { useLang } from "@/components/lang-provider"
import { blogPosts, formatDate, type BlogListItem, type BlogPost } from "@/lib/blog"

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
}

function renderTextWithLinks(text: string) {
  const urlRegex = /https?:\/\/[^\s]+/g
  const parts: Array<string | JSX.Element> = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let index = 0

  while ((match = urlRegex.exec(text)) !== null) {
    const raw = match[0]
    const start = match.index
    const end = start + raw.length

    if (start > lastIndex) parts.push(text.slice(lastIndex, start))

    let url = raw
    let trailing = ""
    while (url.length > 0 && /[)\],.]+$/.test(url)) {
      trailing = url.slice(-1) + trailing
      url = url.slice(0, -1)
    }

    parts.push(
      <a
        key={`url-${index}`}
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        className="font-medium text-foreground/80 underline-offset-4 hover:text-[#2ecc71] hover:underline"
      >
        {url}
      </a>,
    )
    if (trailing) parts.push(trailing)

    lastIndex = end
    index += 1
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex))

  return parts
}

function isFaqHeading(text?: string) {
  if (!text) return false
  const normalized = text.trim().toLowerCase()
  return (
    normalized === "frequently asked questions" ||
    normalized === "preguntas frecuentes" ||
    normalized === "preguntas frecuentes (faq)"
  )
}

function isRelatedGuidesHeading(text?: string) {
  if (!text) return false
  const normalized = text.trim().toLowerCase()
  return normalized === "related guides" || normalized === "guias relacionadas" || normalized === "guías relacionadas"
}

function splitFaqItem(text: string) {
  const questionEnd = text.indexOf("?")
  if (questionEnd === -1) {
    return { question: text, answer: "" }
  }
  return {
    question: text.slice(0, questionEnd + 1).trim(),
    answer: text.slice(questionEnd + 1).trim(),
  }
}

function getListItemText(item: BlogListItem) {
  return typeof item === "string" ? item : item.text
}

function getListItemHref(item: BlogListItem) {
  return typeof item === "string" ? undefined : item.href
}

function getListItemSlug(item: BlogListItem) {
  return typeof item === "string" ? undefined : item.slug
}

function renderFaqItems(
  items: Array<{ question: string; answer: string }>,
  keyPrefix: string,
) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <details
          key={`${keyPrefix}-${index}`}
          className="group rounded-2xl border border-border bg-card px-5 py-4"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-foreground">
            <span>{renderTextWithLinks(item.question)}</span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          {item.answer ? (
            <p className="mt-3 border-t border-border pt-3 text-muted-foreground">
              {renderTextWithLinks(item.answer)}
            </p>
          ) : null}
        </details>
      ))}
    </div>
  )
}

export function BlogArticle({ post }: { post: BlogPost }) {
  const { lang, t } = useLang()
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3)
  const headingItems = useMemo(() => {
    const used = new Map<string, number>()
    const items: Array<{ id: string; text: string }> = []
    for (const block of post.content[lang]) {
      if (block.type !== "h2" || !block.text) continue
      const base = slugify(block.text)
      const count = used.get(base) ?? 0
      const id = count ? `${base}-${count + 1}` : base
      used.set(base, count + 1)
      items.push({ id, text: block.text })
    }
    return items
  }, [lang, post.content])
  const keywords =
    post.keywords?.[lang]?.length
      ? post.keywords[lang]
      : Array.from(
          new Set([
            post.category[lang],
            ...post.slug
              .split("-")
              .filter((part) => part.length > 2)
              .slice(0, 6),
          ]),
        )
  const contentTitle = lang === "es" ? "Contenido" : "Contents"
  const keywordsTitle = lang === "es" ? "Palabras clave" : "Keywords"
  const articleInfoTitle = lang === "es" ? "Informacion del articulo" : "Article info"
  const authorLabel = lang === "es" ? "Por" : "By"
  const publishedLabel = lang === "es" ? "Publicado el" : "Published"
  const updatedLabel = lang === "es" ? "Actualizado el" : "Last updated"
  const author =
    post.author?.[lang] ??
    (lang === "es" ? "Equipo Editorial Préstamo Hub" : "Préstamo Hub Editorial Team")
  const publishedDate = formatDate(post.date, lang)
  const updatedDate = formatDate(post.updatedDate ?? post.date, lang)
  const [activeHeadingId, setActiveHeadingId] = useState<string>("")
  const [pinUntil, setPinUntil] = useState<number>(0)

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setActiveHeadingId(id)
    setPinUntil(Date.now() + 900)
    history.replaceState(null, "", `#${id}`)
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  useEffect(() => {
    if (headingItems.length === 0) return

    const elements = headingItems
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < pinUntil) return
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0),
          )
        const next = visible[0]?.target?.id
        if (next) setActiveHeadingId(next)
      },
      {
        root: null,
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0, 0.1, 0.2, 0.3],
      },
    )

    for (const el of elements) observer.observe(el)

    return () => observer.disconnect()
  }, [headingItems, pinUntil])

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash) setActiveHeadingId(hash)
    }
    onHashChange()
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`/${lang}`} className="hover:text-foreground">
          {t.blog.home}
        </Link>
        <span>/</span>
        <Link href={`/${lang}/blog`} className="hover:text-foreground">
          {t.nav.blog}
        </Link>
      </nav>

      <header className="mt-6">
        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
            {post.category[lang]}
          </span>
        </div>
        <h1 className="mt-4 text-balance text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {post.title[lang]}
        </h1>
        <div className="mt-4 rounded-2xl border border-border/60 bg-[linear-gradient(180deg,rgba(125,167,255,0.12),rgba(125,167,255,0.03))] px-5 py-4 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span>
              {authorLabel} <span className="font-semibold text-foreground">{author}</span>
            </span>
            <span className="text-muted-foreground/60">·</span>
            <span>
              {publishedLabel} {publishedDate}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span>
              {updatedLabel} {updatedDate}
            </span>
            <span className="text-muted-foreground/60">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {post.readingMinutes} {t.blog.minutes}
            </span>
            <span className="text-muted-foreground/60">·</span>
            <span>{post.category[lang]}</span>
          </div>
        </div>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          {post.excerpt[lang]}
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <List className="size-4 text-primary" />
              <span>{contentTitle}</span>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {headingItems.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToHeading(heading.id)
                  }}
                  className={`rounded-md px-2 py-1 text-sm leading-relaxed transition-colors ${
                    activeHeadingId === heading.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                  }`}
                >
                  {heading.text}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">{articleInfoTitle}</p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                <span>
                  {post.readingMinutes} {t.blog.minutes}
                </span>
              </div>
              <div>{formatDate(post.date, lang)}</div>
              <div>{post.category[lang]}</div>
            </div>
          </div>
        </aside>

        <div>
          <div className="flex flex-col gap-5 leading-relaxed">
            {(() => {
              let headingIndex = 0
              let currentHeadingText = ""
              return post.content[lang].map((block, i) => {
              if (block.type === "h2") {
                currentHeadingText = block.text ?? ""
                const id = headingItems[headingIndex]?.id ?? (block.text ? slugify(block.text) : undefined)
                headingIndex += 1

                return (
                  <h2
                    key={i}
                    id={id}
                    className="mt-4 scroll-mt-24 text-xl font-bold tracking-tight md:text-2xl"
                  >
                    {block.text}
                  </h2>
                )
              }
              if (block.type === "h3") {
                return (
                  <h3
                    key={i}
                    className="mt-2 text-lg font-semibold tracking-tight text-foreground md:text-xl"
                  >
                    {block.text}
                  </h3>
                )
              }
              if (block.type === "callout") {
                const internalHref = block.slug ? `/${lang}/${block.slug}` : undefined
                const toneClasses =
                  block.variant === "success"
                    ? "border-[#2ecc71]/25 bg-[linear-gradient(180deg,rgba(46,204,113,0.14),rgba(46,204,113,0.05))]"
                    : "border-primary/20 bg-[linear-gradient(180deg,rgba(125,167,255,0.12),rgba(125,167,255,0.04))]"

                return (
                  <div
                    key={i}
                    className={`rounded-2xl border p-5 md:p-6 ${toneClasses}`}
                  >
                    <p className="text-sm leading-7 text-foreground/85">
                      {renderTextWithLinks(block.text)}
                    </p>
                    {internalHref ? (
                      <Link
                        href={internalHref}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        {block.hrefLabel ?? (lang === "es" ? "Abrir" : "Open")}
                        <ArrowRight className="size-4" />
                      </Link>
                    ) : block.href ? (
                      <a
                        href={block.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        {block.hrefLabel ?? block.href}
                        <ArrowRight className="size-4" />
                      </a>
                    ) : null}
                  </div>
                )
              }
              if (block.type === "faq") {
                return <div key={i}>{renderFaqItems(block.items, `faq-${i}`)}</div>
              }
              if (block.type === "ul") {
                if (isRelatedGuidesHeading(currentHeadingText)) {
                  return (
                    <ul key={i} className="flex flex-col gap-3">
                      {block.items?.map((item, j) => {
                        const text = getListItemText(item)
                        const targetSlug =
                          typeof item === "string"
                            ? blogPosts.find(
                                (candidate) =>
                                  candidate.slug !== post.slug && candidate.title[lang] === item,
                              )?.slug
                            : getListItemSlug(item)
                        const relatedPost = targetSlug
                          ? blogPosts.find((candidate) => candidate.slug === targetSlug)
                          : undefined

                        return (
                          <li key={j} className="text-muted-foreground">
                            {relatedPost && targetSlug ? (
                              <Link
                                href={`/${lang}/blog/${targetSlug}`}
                                className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
                              >
                                {text}
                              </Link>
                            ) : (
                              text
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )
                }
                if (isFaqHeading(currentHeadingText)) {
                  return renderFaqItems(
                    (block.items ?? []).map((item) => {
                      const { question, answer } = splitFaqItem(getListItemText(item))
                      return { question, answer }
                    }),
                    `legacy-faq-${i}`,
                  )
                }
                return (
                  <ul key={i} className="flex flex-col gap-2 pl-1">
                    {block.items?.map((item, j) => {
                      const text = getListItemText(item)
                      const href = getListItemHref(item)

                      return (
                        <li key={j} className="flex gap-3 text-muted-foreground">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                          <span>
                            {href ? (
                              <span className="flex flex-col gap-1">
                                <span>{text}</span>
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="w-fit font-mono text-sm text-foreground underline-offset-4 transition-colors hover:text-[#2ecc71] hover:underline"
                                >
                                  {href}
                                </a>
                              </span>
                            ) : (
                              renderTextWithLinks(text)
                            )}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )
              }
              if (block.type === "table") {
                return (
                  <div key={i} className="mt-2">
                    {block.title ? (
                      <p className="text-base font-semibold">{block.title}</p>
                    ) : null}
                    <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
                      <table className="w-full min-w-[520px] text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            {block.columns.map((col, colIndex) => (
                              <th
                                key={`${col}-${colIndex}`}
                                className={`px-5 py-4 font-semibold text-foreground ${
                                  block.columns.length === 2 && colIndex === block.columns.length - 1
                                    ? "text-right"
                                    : "text-left"
                                }`}
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.rows.map((row, rowIndex) => (
                            <tr
                              key={`row-${rowIndex}`}
                              className="border-b border-border last:border-b-0"
                            >
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={`cell-${rowIndex}-${cellIndex}`}
                                  className={`px-5 py-4 text-muted-foreground ${
                                    block.columns.length === 2 &&
                                    cellIndex === block.columns.length - 1
                                      ? "text-right"
                                      : "text-left"
                                  }`}
                                >
                                  {renderTextWithLinks(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              }
              return (
                <p key={i} className="text-muted-foreground">
                  {block.text ? renderTextWithLinks(block.text) : null}
                </p>
              )
              })
            })()}
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Tag className="size-4 text-primary" />
              <span>{keywordsTitle}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-sm text-secondary-foreground"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-[2rem] border border-border/60 bg-[linear-gradient(180deg,rgba(46,204,113,0.12),rgba(46,204,113,0.04))] p-8 text-center md:p-10">
            <h2 className="text-balance text-xl font-bold tracking-tight">
              {t.blog.ctaTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
              {t.blog.ctaSubtitle}
            </p>
            <GooglePlayButton
              label={t.cta.button}
              className="mt-5 inline-flex"
            />
          </div>

          <div className="mt-10">
            <Link
              href={`/${lang}/blog`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              <ArrowLeft className="size-4" />
              {t.blog.backToBlog}
            </Link>
          </div>

          <section className="mt-16 border-t border-border pt-10">
            <h2 className="text-xl font-bold tracking-tight">{t.blog.relatedTitle}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${lang}/blog/${p.slug}`}
                  className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-transform transition-colors duration-200 hover:-translate-y-1 hover:border-primary/50"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    {p.category[lang]}
                  </span>
                  <h3 className="mt-2 text-balance text-base font-bold leading-snug group-hover:text-primary group-hover:underline group-hover:underline-offset-4">
                    {p.title[lang]}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    {t.blog.readMore}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </article>
  )
}

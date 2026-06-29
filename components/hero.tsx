"use client"

import Image from "next/image"
import {
  CheckCircle2,
  CirclePlay,
  BadgeDollarSign,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { useLang } from "@/components/lang-provider"
import { GooglePlayButton } from "@/components/google-play-button"

const YOUTUBE_PLACEHOLDER_URL = "https://www.youtube.com/"

export function Hero() {
  const { t } = useLang()

  const stats = [
    { label: t.hero.stat1, value: t.hero.stat1Value },
    { label: t.hero.stat2, value: t.hero.stat2Value },
    { label: t.hero.stat3, value: t.hero.stat3Value },
  ]

  const titleLines = t.hero.title
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  const actions =
    "actions" in t.hero && Array.isArray((t.hero as any).actions)
      ? ((t.hero as any).actions as Array<{ title: string; subtitle: string }>)
      : []

  const actionIcons = [Search, CheckCircle2, ShieldCheck, BadgeDollarSign]

  return (
    <section
      id="top"
      className="relative overflow-hidden"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[1.25fr_0.75fr] md:px-6 md:py-24">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="size-4" />
            {t.hero.badge}
          </span>

          <h1 className="text-3xl font-extrabold leading-[1.05] tracking-tight md:text-4xl lg:text-5xl">
            {titleLines.slice(0, -1).map((line, index) => (
              <span key={`${line}-${index}`} className="block text-foreground">
                {line}
              </span>
            ))}
            {titleLines.length ? (
              <span
                className={`block text-primary ${titleLines.length > 1 ? "mt-1" : ""}`}
              >
                {titleLines[titleLines.length - 1]}
              </span>
            ) : null}
          </h1>

          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {t.hero.subtitle}
          </p>

          {actions.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {actions.map((item, idx) => {
                const Icon = actionIcons[idx] ?? CheckCircle2
                return (
                  <div key={`${item.title}-${idx}`} className="flex items-start gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div className="leading-tight">
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-2xl border border-border bg-card/80">
            <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {stats.map((s) => (
                <div key={s.label} className="px-4 py-3">
                  <p className="text-sm font-bold text-primary">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <GooglePlayButton
              label={t.hero.ctaPrimary}
              meta={"ctaPrimaryMeta" in t.hero ? (t.hero as any).ctaPrimaryMeta : undefined}
            />
            <a
              href={YOUTUBE_PLACEHOLDER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-transform transition-colors hover:-translate-y-1 hover:bg-muted"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-muted text-foreground">
                <CirclePlay className="size-5" />
              </span>
              <span className="flex flex-col text-left leading-none">
                <span className="text-xs text-muted-foreground">
                  {"ctaSecondaryMeta" in t.hero ? (t.hero as any).ctaSecondaryMeta : ""}
                </span>
                <span className="text-sm font-semibold">{t.hero.ctaSecondary}</span>
              </span>
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs">
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/10 blur-2xl" />
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
            <Image
              src="/first.png"
              alt={t.hero.imageAlt}
              width={240}
              height={400}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          {/* <div className="absolute -right-4 top-6 hidden max-w-[220px] rounded-2xl border border-border bg-background/95 px-4 py-3 shadow-lg lg:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              SEO
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {t.hero.legalTitle}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {t.hero.legalNote}
            </p>
          </div> */}
        </div>
      </div>
    </section>
  )
}

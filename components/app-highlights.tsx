"use client"

import {
  BellRing,
  Calculator,
  CheckCircle2,
  FileSearch,
  FileText,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react"
import { useLang } from "@/components/lang-provider"

const icons = [Wallet, Calculator, FileText, Zap, BellRing, ShieldCheck]

export function AppHighlights() {
  const { t } = useLang()

  return (
    <section
      id="advantages"
      className="bg-background py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
            <CheckCircle2 className="size-4" />
            {t.advantages.kicker}
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            {t.advantages.title}{" "}
            <span className="text-primary">{t.advantages.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            {t.advantages.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            {t.advantages.bullets.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 font-semibold text-foreground"
              >
                <FileSearch className="size-4 text-primary" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {t.advantages.items.map((item, index) => {
            const Icon = icons[index] ?? Wallet
            const number = String(index + 1).padStart(2, "0")
            return (
              <article
                key={item.title}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <span className="text-sm font-bold text-primary">{number}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

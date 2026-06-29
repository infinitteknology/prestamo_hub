"use client"

import { AlertTriangle, BadgeCheck, FileText, Landmark } from "lucide-react"
import { useLang } from "@/components/lang-provider"

export function LoanDetails() {
  const { t } = useLang()

  return (
    <section id="details" className="finance-theme bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            {t.details.title}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            {t.details.subtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BadgeCheck className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">{t.details.requirementsTitle}</h3>
            </div>

            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {t.details.requirements.map((requirement) => (
                <li key={requirement} className="flex gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl bg-secondary/70 p-5">
              <div className="flex items-center gap-3">
                <AlertTriangle className="size-5 text-primary" />
                <p className="text-sm font-semibold">{t.details.importantTitle}</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t.details.importantNote}
              </p>
            </div>
          </article>

          <div className="grid gap-6">
            <article className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Landmark className="size-5" />
                </div>
                <h3 className="text-lg font-semibold">{t.details.productTitle}</h3>
              </div>

              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                {t.details.productRows.map((row) => (
                  <div
                    key={row.label}
                    className="rounded-2xl border border-border bg-background p-4"
                  >
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="mt-2 text-sm font-semibold text-foreground">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                {t.details.generalDisclaimer}
              </p>
            </article>

            <article className="rounded-3xl border border-border bg-primary p-6 text-primary-foreground md:p-8">
              <div className="flex items-center gap-3">
                <FileText className="size-5" />
                <h3 className="text-lg font-semibold">{t.details.exampleTitle}</h3>
              </div>

              <dl className="mt-6 space-y-4">
                {t.details.exampleRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start justify-between gap-6 border-b border-primary-foreground/15 pb-4"
                  >
                    <dt className="text-sm text-primary-foreground/80">{row.label}</dt>
                    <dd className="text-right text-sm font-semibold">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-5 text-xs leading-relaxed text-primary-foreground/80">
                {t.details.exampleFootnote}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

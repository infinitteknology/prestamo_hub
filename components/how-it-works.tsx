"use client"

import { Check } from "lucide-react"
import { useLang } from "@/components/lang-provider"

export function HowItWorks() {
  const { t } = useLang()

  return (
    <section id="how" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            {t.how.title}
          </h2>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {t.how.steps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {t.trust.items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <Check className="size-4 text-accent" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

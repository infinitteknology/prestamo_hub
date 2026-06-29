"use client"

import {
  Scale,
  Calculator,
  FileSearch,
  BellRing,
  Wallet,
  Smartphone,
  type LucideIcon,
} from "lucide-react"
import { useLang } from "@/components/lang-provider"

const icons: LucideIcon[] = [
  Scale,
  Calculator,
  FileSearch,
  BellRing,
  Wallet,
  Smartphone,
]

export function Features() {
  const { t } = useLang()

  return (
    <section id="features" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            {t.features.title}
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            {t.features.subtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.features.list.map((feature, i) => {
            const Icon = icons[i] ?? Scale
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
